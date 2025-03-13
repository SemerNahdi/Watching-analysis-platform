"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { InfoIcon, Loader2 } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import ImageGallery from "@/components/ImageGallery";
import { User } from "@supabase/supabase-js";

interface Media {
  id: string;
  file_name: string;
  file_url: string;
  user_id: string;
  type: "image" | "youtube";
}

const extractYouTubeId = (url: string): string | null => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export default function ProtectedPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [youtubeLink, setYoutubeLink] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const [media, setMedia] = useState<Media[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be signed in to access this page.", {
          icon: <InfoIcon />,
        });
        return;
      } else {
        setUser(user);
      }
    };

    fetchUser();
  }, []);

  const fetchMedia = async () => {
    if (!user) return;
    setLoadingMedia(true);
    const { data, error } = await supabase.from("media").select("*");

    if (error) {
      console.error("Error fetching media:", error.message);
    } else {
      setMedia(data);
    }
    setLoadingMedia(false);
  };

  useEffect(() => {
    fetchMedia();
  }, [user]);

  const handleUpload = async () => {
    if (!user) return;

    setUploading(true);
    setUploadProgress(0);

    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase
        .storage
        .from("watchplatform-videos")
        .upload(`images/${fileName}`, file, {
          cacheControl: "3600",
          upsert: false,
          onProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          },
        });

      if (error) {
        console.error("Error uploading file:", error.message);
        toast.error("Failed to upload image.");
      } else {
        const { data: publicUrlData, error: urlError } = supabase.storage
          .from("watchplatform-videos")
          .getPublicUrl(`images/${fileName}`);

        if (urlError) {
          console.error("Error fetching public URL:", urlError.message);
          toast.error("Failed to retrieve image URL.");
        } else {
          const publicUrl = publicUrlData.publicUrl;

          const { error: dbError } = await supabase
            .from("media")
            .insert([{ file_name: fileName, file_url: publicUrl, user_id: user.id, type: "image" }]);

          if (dbError) {
            console.error("Error saving metadata:", dbError.message);
            toast.error(`Failed to save metadata. ${dbError.message}`);
          } else {
            toast.success("Image uploaded successfully!");
            fetchMedia();
          }
        }
      }
    } else if (youtubeLink) {
      const videoId = extractYouTubeId(youtubeLink);

      if (!videoId) {
        toast.error("Invalid YouTube link. Please provide a valid URL.");
        setUploading(false);
        return;
      }

      const { error: dbError } = await supabase
        .from("media")
        .insert([{ file_name: "YouTube Video", file_url: videoId, user_id: user.id, type: "youtube" }]);

      if (dbError) {
        console.error("Error saving YouTube link:", dbError.message);
        toast.error(`Failed to save YouTube link. ${dbError.message}`);
      } else {
        toast.success("YouTube link uploaded successfully!");
        fetchMedia();
      }
    }

    setUploading(false);
    setFile(null);
    setYoutubeLink("");
    setUploadProgress(0);
  };

  const handleDelete = async (mediaId: string, fileName: string, type: "image" | "youtube") => {
    if (!user) return;

    if (type === "image") {
      const { error: storageError } = await supabase
        .storage
        .from("watchplatform-videos")
        .remove([`images/${fileName}`]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError.message);
        toast.error("Failed to delete image from storage.");
        return;
      }
    }

    const { error: dbError } = await supabase
      .from("media")
      .delete()
      .eq("id", mediaId);

    if (dbError) {
      console.error("Error deleting media from database:", dbError.message);
      toast.error("Failed to delete media from database.");
    } else {
      toast.success("Media deleted successfully!");
      fetchMedia();
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <Toaster />
      
      {/* Authenticated User Info */}
      {/* <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page visible only to authenticated users.
        </div>
      </div> */}

      {/* Upload Section */}
      <div className="flex flex-col gap-4">
        <FileUpload 
          file={file} 
          uploading={uploading} 
          setFile={setFile} 
          youtubeLink={youtubeLink}
          setYoutubeLink={setYoutubeLink}
          handleUpload={handleUpload} 
          uploadProgress={uploadProgress} // Pass upload progress
        />
      </div>

      {/* Media Gallery */}
      {loadingMedia ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-gray-500" size={24} />
        </div>
      ) : (
        <ImageGallery 
          media={media} 
          user={user} 
          handleDelete={handleDelete} 
        />
      )}
    </div>
  );
}