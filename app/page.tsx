import { createClient } from "./utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function Home(props: {
  searchParams: Promise<{ access_token?: string; refresh_token?: string }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  if (searchParams.access_token && searchParams.refresh_token) {
    try {
      await supabase.auth.setSession({
        access_token: searchParams.access_token,
        refresh_token: searchParams.refresh_token,
      });
    } catch (err) {
      console.error("Failed to set session on server side:", err);
    }
  }

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    const signInUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL
      ? `${process.env.NEXT_PUBLIC_MAIN_APP_URL}/sign-in`
      : "http://localhost:3000/sign-in";
    redirect(signInUrl);
  }

  return <DashboardClient />;
}
