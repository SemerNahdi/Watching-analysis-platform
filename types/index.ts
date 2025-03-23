
export interface Media {
  id: string;
  file_name: string;
  file_url: string;
  user_id: string;
  type: "image" | "youtube";
}

export interface FileUploadProps {
  file: File | null;
  uploading: boolean;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  youtubeLink: string;
  setYoutubeLink: React.Dispatch<React.SetStateAction<string>>;
  handleUpload: () => void;
  uploadProgress?: number; // Add upload progress
}

export interface ImageGalleryProps {
  media: Media[];
  user: any;
  handleDelete: (
    mediaId: string,
    fileName: string,
    type: "image" | "youtube"
  ) => void;
}

