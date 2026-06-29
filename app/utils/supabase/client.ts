import { createBrowserClient } from "@supabase/ssr";

const FALLBACK_URL = "https://jvediwtxbeitdlozoefg.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2ZWRpd3R4YmVpdGRsb3pvZWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDQyOTQsImV4cCI6MjA5NjkyMDI5NH0.UwRKIgZa-USpYtsJAOdghTLAjfn3MbztJROsFaGJ3JE";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;
  return createBrowserClient(url, key);
}
