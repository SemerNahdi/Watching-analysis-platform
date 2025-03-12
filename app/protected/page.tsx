"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { InfoIcon } from "lucide-react";
import FileUpload from "@/components/FileUpload"; // Import the FileUpload component
import ImageGallery from "@/components/ImageGallery"; // Import the ImageGallery component

export default function ProtectedPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<any[]>([]); // Replace `any` with the correct image type
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        // redirect("/sign-in");
        // Add your custom sign-in logic here
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

  const fetchImages = async () => {
    if (!user) return;
    setLoadingImages(true);
    const { data, error } = await supabase.from("images").select("*");

    if (error) {
      console.error("Error fetching images:", error.message);
    } else {
      setImages(data);
    }
    setLoadingImages(false);
  };

  useEffect(() => {
    fetchImages();
  }, [user]);

  const handleUpload = async () => {
    if (!file || !user) return;

    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase
      .storage
      .from("watchplatform-videos")
      .upload(`images/${fileName}`, file);

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
          .from("images")
          .insert([{ file_name: fileName, file_url: publicUrl, user_id: user.id }]);

        if (dbError) {
          console.error("Error saving metadata:", dbError.message);
          toast.error(`Failed to save metadata. ${dbError.message}`);
        } else {
          toast.success("Image uploaded successfully!");
          fetchImages(); // Refresh images after upload
        }
      }
    }
    setUploading(false);
    setFile(null);
  };

  const handleDelete = async (imageId: string, fileName: string) => {
    if (!user) return;

    // Deleting from Supabase Storage
    const { error: storageError } = await supabase
      .storage
      .from("watchplatform-videos")
      .remove([`images/${fileName}`]);

    if (storageError) {
      console.error("Error deleting file from storage:", storageError.message);
      toast.error("Failed to delete image from storage.");
      return;
    }

    // Deleting from the images table in the database
    const { error: dbError } = await supabase
      .from("images")
      .delete()
      .eq("id", imageId);

    if (dbError) {
      console.error("Error deleting image from database:", dbError.message);
      toast.error("Failed to delete image from database.");
    } else {
      toast.success("Image deleted successfully!");
      fetchImages(); // Refresh the list of images after deletion
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <Toaster />
      
      {/* Authenticated User Info */}
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page visible only to authenticated users.
        </div>
      </div>

      {/* Upload Image Section */}
      <div className="flex flex-col gap-4">
        <FileUpload 
          file={file} 
          uploading={uploading} 
          setFile={setFile} 
          handleUpload={handleUpload} 
        />
      </div>

      {/* Image Gallery */}
      {loadingImages ? (
        <div className="flex justify-center items-center h-40">
          {/* Loading Spinner */}
        </div>
      ) : (
        <ImageGallery 
          images={images} 
          user={user} 
          handleDelete={handleDelete} 
        />
      )}
    </div>
  );
}
