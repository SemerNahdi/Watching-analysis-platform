import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import { User } from "@supabase/supabase-js";
import { InfoIcon, Loader2 } from "lucide-react";

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          throw new Error(error.message);
        }

        if (!user) {
          toast.error("You must be signed in to access this page.", {
            icon: 'ℹ️',
          });
        } else {
          setUser(user);
        }
      } catch (error) {
        toast.error("Error fetching user: " + error.message, {
          icon: '⚠️',
        });
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return user;
};

export default useUser;
