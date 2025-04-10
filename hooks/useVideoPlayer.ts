import { useRef, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { faceDetectionService, EmotionData } from "@/services/faceDetectionService";

interface UseVideoPlayerProps {
    videoId: string;
    cameraEnabled: boolean;
    onPlay?: () => void;
    onEmotionDetected?: (data: EmotionData) => void;
}

export function useVideoPlayer({ videoId, cameraEnabled, onPlay, onEmotionDetected }: UseVideoPlayerProps) {
    const playerRef = useRef<YT.Player | null>(null);
    const [videoProgress, setVideoProgress] = useState(0);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const closeCamera = () => {
        try {
            // Stop emotion tracking first
            faceDetectionService.stopEmotionTracking();

            // Stop all media tracks
            if (mediaStream) {
                mediaStream.getTracks().forEach((track) => {
                    track.stop();
                    track.enabled = false;
                });
                setMediaStream(null);
            }

            // Clean up video element
            if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current = null;
            }

            toast.success('Camera closed successfully');
        } catch (error) {
            console.error('Error closing camera:', error);
            toast.error('Error closing camera');
        }
    };

    const pauseVideo = () => {
        if (playerRef.current) {
            playerRef.current.pauseVideo();
        }
    };

    const checkCameraAccess = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setMediaStream(stream);
            
            // Create video element for face detection
            if (!videoRef.current) {
                const video = document.createElement('video');
                video.srcObject = stream;
                await video.play();
                videoRef.current = video;

                // Check for face presence
                const hasFace = await faceDetectionService.detectFace(video);
                if (!hasFace) {
                    toast.error('No face detected. Please position yourself in front of the camera.');
                    closeCamera();
                    return false;
                }

                // Start emotion tracking if callback is provided
                if (onEmotionDetected) {
                    toast.success('Starting emotion tracking...');
                    faceDetectionService.startEmotionTracking(video, onEmotionDetected);
                }
            }

            toast.success('Camera access granted and face detected. You can now watch the video.');
            return true;
        } catch (error) {
            toast.error(
                'Camera access denied or no camera available. Video playback is blocked.'
            );
            return false;
        }
    };

    const saveVideoProgress = async (currentTime: number, duration: number) => {
        // try {
        //     const response = await fetch("/api/video-tracking", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             videoId,
        //             currentTime,
        //             duration,
        //         }),
        //     });

        //     if (!response.ok) {
        //         throw new Error("Failed to save video progress");
        //     }
        // } catch (error) {
        //     console.error("Error saving video progress:", error);
        // }
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
            try {
                playerRef.current?.destroy();
                delete (window as any).onYouTubeIframeAPIReady;
                closeCamera();
            } catch (error) {
                console.error('Error in cleanup:', error);
            }
        };
    }, [videoId]);

    return {
        videoProgress,
        isPlaying,
        closeCamera,
        pauseVideo,
    };
} 