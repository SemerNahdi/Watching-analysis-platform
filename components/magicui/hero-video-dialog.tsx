"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

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
  onPlay?: () => void;
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const videoId = videoSrc.split("/embed/")[1]?.split("?")[0];

  const { videoProgress, closeCamera } = useVideoPlayer({
    videoId: videoId || "",
    cameraEnabled,
    onPlay,
  });

  const handleCloseModal = () => {
    if (videoProgress < 90) {
      setShowConfirmation(true);
    } else {
      closeCamera();
      onClose();
    }
  };

  const handleConfirmClose = () => {
    closeCamera();
    onClose();
  };

  const selectedAnimation = animationVariants[animationStyle];

  return (
    <>
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
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={handleCloseModal}
                className="absolute -top-16 right-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md"
              >
                <XIcon className="size-5" />
              </motion.button>
              <div className="relative isolate z-[1] size-full overflow-hidden rounded-2xl border-2 border-white">
                <div id="youtube-player" className="size-full rounded-2xl" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmClose}
        title="Close Video?"
        description={`You've only watched ${Math.round(videoProgress)}% of the video. Are you sure you want to close it?`}
        confirmText="Close Video"
        cancelText="Keep Watching"
      />
    </>
  );
}
