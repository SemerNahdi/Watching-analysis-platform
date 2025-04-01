import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Trash2, Clock } from "lucide-react";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import toast from "react-hot-toast";
import { Media, ImageGalleryProps } from "@/types";
import { formatDistanceToNow } from "date-fns";

const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/0.jpg`;
};

const ImageGallery: React.FC<ImageGalleryProps> = ({
  media,
  user,
  handleDelete,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <div className="w-full">
      <h2 className="font-bold text-2xl mb-4">Uploaded Media</h2>
      {media.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item) => (
            <div key={item.id} className="group relative">
              {item.type === "image" ? (
                <motion.div
                  className="w-full aspect-[16/9] rounded-md overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={item.file_url}
                    alt={item.file_name}
                    className="w-full h-full object-cover"
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
                      src={getYouTubeThumbnail(item.file_url)}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
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

              {/* Metadata and Delete Button */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Clock className="size-4" />
                  <span>
                    {formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                {user?.id === item.user_id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id, item.file_name, item.type);
                    }}
                    className="p-1.5 text-neutral-600 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Delete media"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
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
        onClose={() => setSelectedVideo(null)}
        animationStyle="from-bottom"
        cameraEnabled={true}
        onPlay={() => {
          console.log("Video play event tracked");
        }}
      />
    </div>
  );
};

export default ImageGallery;
