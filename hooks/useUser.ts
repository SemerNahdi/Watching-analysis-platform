// hooks/useUser.ts
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import { User } from "@supabase/supabase-js";
import { InfoIcon, Loader2 } from "lucide-react";
const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be signed in to access this page.", {
          icon: 'ℹ️',
        });
      } else {
        setUser(user);
      }
    };

    fetchUser();
  }, []);

  return user;
};

export default useUser;
