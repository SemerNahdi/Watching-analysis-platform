import React, { useState } from "react";
import { Info, UploadCloud, Youtube, XIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
// import { Tooltip } from "@/components/ui/tooltip"; // Assuming you have a Tooltip component

interface FileUploadProps {
  file: File | null;
  uploading: boolean;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  youtubeLink: string;
  setYoutubeLink: React.Dispatch<React.SetStateAction<string>>;
  handleUpload: () => void;
  uploadProgress?: number; // Add upload progress
}

const FileUpload: React.FC<FileUploadProps> = ({
  file,
  uploading,
  setFile,
  youtubeLink,
  setYoutubeLink,
  handleUpload,
  uploadProgress = 0,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-bold text-2xl flex items-center gap-2">
        <UploadCloud className="text-blue-500" size={24} />
        Upload Media
      </h2>

      {/* Drag-and-Drop Area */}
      <div
        className={`p-6 border-2 border-dashed rounded-lg ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
        } transition-all duration-200`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="text-center">
          <UploadCloud className="mx-auto text-gray-400" size={40} />
          <p className="mt-2 text-gray-600">
            Drag & drop an image here, or{" "}
            <label
              htmlFor="file-upload"
              className="text-blue-500 cursor-pointer hover:underline"
            >
              browse files
            </label>
          </p>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
      </div>

      {/* Selected File Preview */}
      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg"
        >
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-16 h-16 object-cover rounded-md"
          />
          <div className="flex-1">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <button
            onClick={() => setFile(null)}
            className="p-2 text-gray-500 hover:text-red-500"
          >
            <XIcon size={16} />
          </button>
        </motion.div>
      )}

      {/* YouTube Link Input */}
      <div className="flex flex-col gap-2">
        <label className="font-medium flex items-center gap-2">
          <Youtube className="text-red-500" size={20} />
          Or Add a YouTube Link
          {/* <Tooltip content="Paste a valid YouTube video link">
            <Info size={16} className="text-gray-400" />
          </Tooltip> */}
        </label>
        <input
          type="text"
          placeholder="Paste YouTube link here"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Upload Progress Bar */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            className="bg-blue-500 h-2.5 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${uploadProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || (!file && !youtubeLink)}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Uploading... ({uploadProgress}%)
          </>
        ) : (
          "Upload"
        )}
      </button>
    </div>
  );
};

export default FileUpload;