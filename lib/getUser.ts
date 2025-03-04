// lib/getUser.ts

import { supabase } from "@/lib/supabaseClient";

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
