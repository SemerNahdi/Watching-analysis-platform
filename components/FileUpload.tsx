"use client";

import { useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { config } from "../config";
import { sanitizeFileName } from "../utils/sanitizeFileName";
import toast, { Toaster } from "react-hot-toast";

const bucketName = config.SUPABASE_BUCKET_NAME;

interface FileUploadProps {
  onUploadSuccess: () => void; // Callback function triggered after successful upload
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null); // State to store the selected file
  const [uploading, setUploading] = useState(false); // State to track upload progress
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the file input element

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setUploading(true);

    try {
      // Get the current authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("You must be logged in to upload files.");
        setUploading(false);
        return;
      }

      const userId = user.id; // Get the user ID
      const uniqueFileName = `${Date.now()}_${sanitizeFileName(file.name)}`; // Create a unique file name

      // Step 1: Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(`uploads/${uniqueFileName}`, file);

      if (uploadError) {
        throw new Error(uploadError.message); // Throw error if upload fails
      }

      console.log("File uploaded successfully:", uploadData);

      // Step 2: Get the public URL of the uploaded file
      const { data: publicUrlData, error: urlError } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`uploads/${uniqueFileName}`);

      if (urlError) {
        throw new Error(urlError.message); // Throw error if URL generation fails
      }

      const publicUrl = publicUrlData.publicUrl; // Public URL of the uploaded file

      // Step 3: Store file metadata in the database
      const { error: dbError } = await supabase
        .from("uploads") // Ensure the table name is correct
        .insert([
          {
            file_name: uniqueFileName, // Unique file name
            file_url: publicUrl, // Public URL of the file
            user_id: userId, // ID of the user who uploaded the file
          },
        ]);

      if (dbError) {
        throw new Error(dbError.message); // Throw error if database insertion fails
      }

      // Success: Notify the user and trigger the success callback
      toast.success("File uploaded successfully!");
      onUploadSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error.message || "Failed to upload file. Please try again.");
    } finally {
      // Reset states and clear the file input
      setUploading(false);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      {/* File input element */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)} // Update state when a file is selected
        ref={fileInputRef} // Reference to the file input
      />

      {/* Upload button */}
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}