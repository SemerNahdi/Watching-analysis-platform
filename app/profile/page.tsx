"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import ImageGallery from "@/components/ImageGallery";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndContent = async () => {
      try {
        // Get user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Get user's uploaded content
          const { data: content, error } = await supabase
            .from('media')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          setMedia(content || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndContent();
  }, []);

  const handleDelete = async (id: string, fileName: string, type: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setMedia(media.filter(item => item.id !== id));
      toast.success('Media deleted successfully');
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Profile Info Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold block">Email:</span> 
                {user.email}
              </p>
              <p>
                <span className="font-semibold block">Last Active:</span> 
                {new Date(user.last_sign_in_at || "").toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content Main Area */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <ImageGallery 
              media={media} 
              user={user} 
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}