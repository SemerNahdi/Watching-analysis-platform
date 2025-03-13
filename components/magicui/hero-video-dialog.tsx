"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import toast from "react-hot-toast";

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out";

interface HeroVideoDialogProps {
  videoSrc: string;
  isOpen: boolean;
  onClose: () => void;
  cameraEnabled: boolean;
  animationStyle?: AnimationStyle;
  onPlay?: () => void; // Callback for when the video starts playing
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
};

export default function HeroVideoDialog({
  videoSrc,
  isOpen,
  onClose,
  animationStyle = "from-center",
  cameraEnabled,
  onPlay,
}: HeroVideoDialogProps) {
  const playerRef = useRef<YT.Player | null>(null); // Ref for the YouTube player
  const [isYouTube, setIsYouTube] = useState(false); // Track if the video is from YouTube
  const [videoProgress, setVideoProgress] = useState(0); // Track video progress
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null); // Track the media stream
  const videoId = videoSrc.split("/embed/")[1]?.split("?")[0]; // Extract YouTube video ID

  // Function to close camera stream
  const closeCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop()); // Stop all tracks of the media stream
      setMediaStream(null); // Clear the media stream reference
      console.log("Camera has been stopped.");
    }
  };

  const checkCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream); // Store the stream
      toast.success("Camera access granted. You can now watch the video.");
      return true;
    } catch (error) {
      toast.error("Camera access denied or no camera available. Video playback is blocked.");
      return false;
    }
  };

  const saveUserLogs = async (videoId: string, currentTime: number, duration: number) => {
    try {
      const response = await fetch("/api/save-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          currentTime,
          duration,
          userId: "user-id", // Replace with actual user ID
        }),
      });

      if (!response.ok) {
        console.error("Failed to save logs");
      }
    } catch (error) {
      console.error("Error saving logs:", error);
    }
  };

  const onPlayerStateChange = async (event: YT.OnStateChangeEvent) => {
    const player = playerRef.current;

    if (event.data === YT.PlayerState.PLAYING) {
      if (cameraEnabled) {
        const hasCamera = await checkCameraAccess();
        if (!hasCamera) {
          player?.pauseVideo(); // Pause video if no camera
          return;
        }
      }

      console.log("Video started playing");
      toast.success("Video started playing");

      // Start tracking video progress
      const interval = setInterval(() => {
        if (player) {
          const currentTime = player.getCurrentTime();
          const duration = player.getDuration();
          setVideoProgress((currentTime / duration) * 100); // Update progress

          console.log(`Watched ${currentTime} out of ${duration} seconds`);

          // Save logs to your backend
          //saveUserLogs(videoId, currentTime, duration);
        }
      }, 5000); // Log every 5 seconds

      // Cleanup interval when video stops
      player?.addEventListener("onStateChange", (e) => {
        if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
          clearInterval(interval);
        }
      });

      // Trigger the onPlay callback (if provided)
      if (onPlay) onPlay();
    }
  };

  const handleCloseModal = () => {
    if (videoProgress < 90) {
      const confirmation = window.confirm("Are you sure you want to close the modal? You haven't watched 90% of the video.");
      if (confirmation) {
        closeCamera(); // Stop the camera when closing
        onClose();
      }
    } else {
      closeCamera(); // Stop the camera when closing
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen || !videoId) return;

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
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange, // Ensure you are using the same function here
        },
      });
    };

    // Cleanup
    return () => {
      playerRef.current?.destroy();
      delete (window as any).onYouTubeIframeAPIReady;
      closeCamera(); // Ensure the camera is closed when the modal is cleaned up
    };
  }, [isOpen, videoId]);

  const onPlayerReady = (event: YT.PlayerEvent) => {
    // Player is ready
    console.log("YouTube player is ready");
  };

  const selectedAnimation = animationVariants[animationStyle];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
        >
          <motion.div
            {...selectedAnimation}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            <motion.button
              onClick={handleCloseModal} // Use the new close handler
              className="absolute -top-16 right-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md"
            >
              <XIcon className="size-5" />
            </motion.button>
            <div className="relative isolate z-[1] size-full overflow-hidden rounded-2xl border-2 border-white">
              {/* YouTube Player */}
              <div id="youtube-player" className="size-full rounded-2xl" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
