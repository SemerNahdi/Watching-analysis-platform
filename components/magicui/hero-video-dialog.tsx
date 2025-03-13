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
  onPlay,
}: HeroVideoDialogProps) {
  const playerRef = useRef<YT.Player | null>(null); // Ref for the YouTube player
  const [isYouTube, setIsYouTube] = useState(false); // Track if the video is from YouTube
  const videoId = videoSrc.split("/embed/")[1]?.split("?")[0]; // Extract YouTube video ID

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
          onStateChange: onPlayerStateChange,
        },
      });
    };

    // Cleanup
    return () => {
      playerRef.current?.destroy();
      delete (window as any).onYouTubeIframeAPIReady;
    };
  }, [isOpen, videoId]);

  const onPlayerReady = (event: YT.PlayerEvent) => {
    // Player is ready
    console.log("YouTube player is ready");
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === YT.PlayerState.PLAYING) {
      console.log("Video started playing");
      //toast.success("Video started playing");
      if (onPlay) onPlay(); // Trigger the onPlay callback
    }
  };

  const selectedAnimation = animationVariants[animationStyle];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
        >
          <motion.div
            {...selectedAnimation}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            <motion.button
              onClick={onClose}
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