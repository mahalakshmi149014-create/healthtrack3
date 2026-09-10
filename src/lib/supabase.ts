import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mopragbtlvqaafemkuam.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vcHJhZ2J0bHZxYWFmZW1rdWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MTg5NzIsImV4cCI6MjEwMzk5NDk3Mn0.Bl4tRRreS0sp8IAYP-X35swY4fzVMS2irCPWyjEwBVI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
