import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react"; // Import the Play icon
import HeroVideoDialog from "@/components/magicui/hero-video-dialog"; // Import the updated HeroVideoDialog

interface Media {
  id: string;
  file_name: string;
  file_url: string;
  user_id: string;
  type: "image" | "youtube";
}

interface ImageGalleryProps {
  media: Media[];
  user: any;
  handleDelete: (
    mediaId: string,
    fileName: string,
    type: "image" | "youtube"
  ) => void;
}

const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/0.jpg`; // Default thumbnail
};

const ImageGallery: React.FC<ImageGalleryProps> = ({
  media,
  user,
  handleDelete,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null); // Track the selected video

  return (
    <div className="w-full">
      <h2 className="font-bold text-2xl mb-4">Uploaded Media</h2>
      {media.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {media.map((item) => (
            <div key={item.id} className="relative">
              {item.type === "image" ? (
                <motion.div
                  className="w-full aspect-[16/9] rounded-md overflow-hidden" // Use aspect ratio
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={item.file_url}
                    alt={item.file_name}
                    className="w-full h-full object-cover" // Ensure the image covers the area
                  />
                </motion.div>
              ) : (
                <div
                  className="group relative cursor-pointer"
                  onClick={() =>
                    setSelectedVideo(
                      `https://www.youtube.com/embed/${item.file_url}`
                    )
                  }
                >
                  {/* Thumbnail */}
                  <div className="w-full aspect-[16/9] rounded-md overflow-hidden border shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]">
                    <img
                      src={getYouTubeThumbnail(item.file_url)} // Dynamically fetch thumbnail
                      alt="Video thumbnail"
                      className="w-full h-full object-cover" // Ensure the thumbnail covers the area
                    />
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
                    <div className="flex size-28 items-center justify-center rounded-full bg-primary/10 backdrop-blur-md">
                      <div
                        className={`relative flex size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-b from-primary/30 to-primary shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]`}
                      >
                        <Play
                          className="size-10 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                          style={{
                            filter:
                              "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {user.id === item.user_id && (
                <button
                  onClick={() =>
                    handleDelete(item.id, item.file_name, item.type)
                  }
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No media uploaded yet.</p>
      )}

      {/* Hero Video Dialog */}
      <HeroVideoDialog
        videoSrc={selectedVideo || ""}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)} // Close the modal
        animationStyle="from-center" // Customize the animation style
      />
    </div>
  );
};

export default ImageGallery;