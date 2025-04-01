import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";

interface UseVideoPlayerProps {
    videoId: string;
    cameraEnabled: boolean;
    onPlay?: () => void;
}

export function useVideoPlayer({ videoId, cameraEnabled, onPlay }: UseVideoPlayerProps) {
    const playerRef = useRef<YT.Player | null>(null);
    const [videoProgress, setVideoProgress] = useState(0);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const closeCamera = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
            setMediaStream(null);
        }
    };

    const checkCameraAccess = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setMediaStream(stream);
            toast.success("Camera access granted. You can now watch the video.");
            return true;
        } catch (error) {
            toast.error(
                "Camera access denied or no camera available. Video playback is blocked."
            );
            return false;
        }
    };

    const saveVideoProgress = async (currentTime: number, duration: number) => {
        try {
            const response = await fetch("/api/video-tracking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    videoId,
                    currentTime,
                    duration,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save video progress");
            }
        } catch (error) {
            console.error("Error saving video progress:", error);
        }
    };

    const onPlayerStateChange = async (event: YT.OnStateChangeEvent) => {
        const player = playerRef.current;

        if (event.data === YT.PlayerState.PLAYING) {
            if (cameraEnabled) {
                const hasCamera = await checkCameraAccess();
                if (!hasCamera) {
                    player?.pauseVideo();
                    return;
                }
            }

            setIsPlaying(true);
            onPlay?.();

            // Start tracking video progress
            const interval = setInterval(() => {
                if (player) {
                    const currentTime = player.getCurrentTime();
                    const duration = player.getDuration();
                    const progress = (currentTime / duration) * 100;
                    setVideoProgress(progress);
                    saveVideoProgress(currentTime, duration);
                }
            }, 5000);

            // Cleanup interval when video stops
            player?.addEventListener("onStateChange", (e) => {
                if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
                    clearInterval(interval);
                    setIsPlaying(false);
                }
            });
        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        if (!videoId) return;

        // Load YouTube IFrame API script
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        // Initialize YouTube player
        (window as any).onYouTubeIframeAPIReady = () => {
            playerRef.current = new YT.Player("youtube-player", {
                height: "100%",
                width: "100%",
                videoId: videoId,
                events: {
                    onReady: () => console.log("YouTube player is ready"),
                    onStateChange: onPlayerStateChange,
                },
            });
        };

        // Cleanup
        return () => {
            playerRef.current?.destroy();
            delete (window as any).onYouTubeIframeAPIReady;
            closeCamera();
        };
    }, [videoId]);

    return {
        videoProgress,
        isPlaying,
        closeCamera,
    };
} 