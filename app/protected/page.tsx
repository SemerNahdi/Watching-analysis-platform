"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { motion } from "framer-motion"; // Import motion for animation

export default function ProtectedPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true); // New state to track loading

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        redirect("/sign-in");
      } else {
        setUser(user);
      }
    };

    fetchUser();
  }, []);

  const fetchImages = async () => {
    if (!user) return; // Ensure user is available before fetching images

    setLoadingImages(true); // Set loading to true when fetching images
    const { data, error } = await supabase
      .from("images")
      .select("*");

    if (error) {
      console.error("Error fetching images:", error.message);
    } else {
      setImages(data);
    }
    setLoadingImages(false); // Set loading to false when done fetching images
  };

  useEffect(() => {
    fetchImages();
  }, [user]); // Dependency on user, so it fetches images when the user is set

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
      // Get the public URL of the uploaded file
      const { data: publicUrlData, error: urlError } = supabase.storage
        .from("watchplatform-videos")
        .getPublicUrl(`images/${fileName}`);

      if (urlError) {
        console.error("Error fetching public URL:", urlError.message);
        toast.error("Failed to retrieve image URL.");
      } else {
        const publicUrl = publicUrlData.publicUrl;

        // Store image metadata in the database including the file URL
        const { error: dbError } = await supabase
          .from("images")
          .insert([{ file_name: fileName, file_url: publicUrl, user_id: user.id }]);

        if (dbError) {
          console.error("Error saving metadata:", dbError.message);
          toast.error(`Failed to save metadata. ${dbError.message}`);
        } else {
          toast.success("Image uploaded successfully!");
          fetchImages(); // Refresh the list of images
        }
      }
    }

    setUploading(false);
    setFile(null);
  };

  const handleDelete = async (imageId: string, fileName: string) => {
    console.log("handleDelete called with:", imageId, fileName); // Debugging log
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
    <div className="flex-1 w-full flex flex-col gap-12">
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
        <h2 className="font-bold text-2xl">Upload an Image</h2>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Loading State */}
      {loadingImages ? (
        <div className="flex justify-center items-center h-40">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-12 h-12 border-4 border-t-blue-500 border-gray-300 rounded-full"
          />
        </div>
      ) : (
        <AnimatedGroup preset="scale">
          {/* Display Uploaded Images */}
          <div>
            <h2 className="font-bold text-2xl mb-4">Uploaded Images</h2>
            {images.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="relative">
                    <motion.img
                      src={img.file_url} // Use the public URL saved in the database
                      alt={img.file_name}
                      className="w-full h-40 object-cover rounded-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <button
                      onClick={() => handleDelete(img.id, img.file_name)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No images uploaded yet.</p>
            )}
          </div>
        </AnimatedGroup>
      )}
    </div>
  );
}
