"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function ProtectedPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
    if (!user) return;

    const { data, error } = await supabase
      .from("images")
      .select("*")
      .eq("user_id", user.id); // Only fetch images of the logged-in user

    if (error) {
      console.error("Error fetching images:", error.message);
    } else {
      setImages(data);
    }
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
          fetchImages();
        }
      }
    }

    setUploading(false);
    setFile(null);
  };

  // Define the handleDelete function here (before the return statement)
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
    <div className="flex-1 w-full flex flex-col gap-12">
      <Toaster />
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page visible only to authenticated users.
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-2xl">Upload an Image</h2>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div>
        <h2 className="font-bold text-2xl mb-4">Uploaded Images</h2>
        {images.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative">
                <img
                  src={img.file_url}
                  alt={img.file_name}
                  className="w-full h-40 object-cover rounded-md"
                />
                {/* <button
                  onClick={() => handleDelete(img.id, img.file_name)} // Pass the correct arguments
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                >
                  Delete
                </button> */}
              </div>
            ))}
          </div>
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
}