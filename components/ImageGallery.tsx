import React from "react";
import { InfoIcon } from "lucide-react";
import { motion } from "framer-motion"; // Optional for animations

interface ImageGalleryProps {
  images: { id: string, file_name: string, file_url: string, user_id: string }[]; // Replace with actual type
  user: any; // Replace with the actual type for user
  handleDelete: (imageId: string, fileName: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, user, handleDelete }) => {
  return (
    <div className="w-full">
      <h2 className="font-bold text-2xl mb-4">Uploaded Images</h2>
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative">
              <motion.img
                src={img.file_url}
                alt={img.file_name}
                className="w-full h-40 object-cover rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              {/* Display delete button only if the image was uploaded by the current user */}
              {user.id === img.user_id && (
                <button
                  onClick={() => handleDelete(img.id, img.file_name)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                >
                  🗑️ {/* You can replace this with a garbage can icon */}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No images uploaded yet.</p>
      )}
    </div>
  );
};

export default ImageGallery;
