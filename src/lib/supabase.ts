import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bivaqryurarvhuzhzwoq.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpdmFxcnl1cmFydmh1emh6d29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNDQ3MTgsImV4cCI6MjEwNDYyMDcxOH0.kBvIZbJz9SLff6I04tj5THERPamlyt9KK2ZgicGTjZ4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
