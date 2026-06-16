import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Lipsesc variabilele de mediu VITE_SUPABASE_URL sau VITE_SUPABASE_ANON_KEY.\n");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
