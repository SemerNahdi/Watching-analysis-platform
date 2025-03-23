import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import { Media } from "@/types"; // Assuming you define the Media interface

const useMedia = (user: any) => {
    const [media, setMedia] = useState<Media[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loadingMedia, setLoadingMedia] = useState(true);
    const supabase = createClient();

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

    const handleUpload = async (file: File | null, youtubeLink: string) => {
        if (!user) return;

        setUploading(true);
        setUploadProgress(0);

        if (file) {
            // Handle file upload (image/video)
            const fileName = `${Date.now()}_${file.name}`;
            const { data, error } = await supabase
                .storage
                .from("watchplatform-videos")
                .upload(`images/${fileName}`, file, {
                    cacheControl: "3600",
                    upsert: false,
                    onProgress: (progress: { loaded: number; total: number }) => {
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
            // Handle YouTube link upload
            const videoId = extractYouTubeId(youtubeLink);

            if (!videoId) {
                toast.error("Invalid YouTube link. Please provide a valid URL.");
                setUploading(false);
                return;
            }

            // Save YouTube video as media
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

    useEffect(() => {
        fetchMedia();
    }, [user]);

    return {
        media,
        uploading,
        uploadProgress,
        loadingMedia,
        handleUpload,
        handleDelete,
    };
};

export default useMedia;

// Helper function to extract YouTube video ID
const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};
