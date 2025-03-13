"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import ImageGallery from "@/components/ImageGallery";
import useUser from "@/hooks/useUser";
import useMedia from "@/hooks/useMedia";

export default function ProtectedPage() {
  const user = useUser(); // Fetch user from your custom hook
  const {
    media,
    uploading,
    uploadProgress,
    loadingMedia,
    handleUpload,
    handleDelete,
  } = useMedia(user); // Custom hook to handle media logic

  const [file, setFile] = useState<File | null>(null);
  const [youtubeLink, setYoutubeLink] = useState<string>("");

  // Ensure user is loaded before continuing
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Please log in to access this page.</span>
      </div>
    );
  }

  // Function to handle upload completion and reset fields
  const handleUploadAndClearFields = async () => {
    await handleUpload(file, youtubeLink); // Upload the media
    setFile(null); // Clear the file field
    setYoutubeLink(""); // Clear the YouTube link field
  };

  return (
    <div className="flex flex-col gap-12">
      <Toaster />

      {/* Upload Section */}
      <div className="flex flex-col gap-4">
        <FileUpload
          file={file}
          uploading={uploading}
          setFile={setFile}
          youtubeLink={youtubeLink}
          setYoutubeLink={setYoutubeLink}
          handleUpload={handleUploadAndClearFields} // Use the new function to handle upload and reset
          uploadProgress={uploadProgress} // Pass upload progress
        />
      </div>

      {/* Media Gallery */}
      {loadingMedia ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-gray-500" size={24} />
        </div>
      ) : (
        <ImageGallery media={media} user={user} handleDelete={handleDelete} />
      )}
    </div>
  );
}
