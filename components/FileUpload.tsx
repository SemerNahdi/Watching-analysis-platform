import React from "react";

interface FileUploadProps {
  file: File | null;
  uploading: boolean;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleUpload: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ file, uploading, setFile, handleUpload }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-2xl">Upload an Image</h2>
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
      />
      <button 
        onClick={handleUpload} 
        disabled={uploading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default FileUpload;
