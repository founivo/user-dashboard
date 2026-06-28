import { createClient } from "./utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function Home(props: {
  searchParams: Promise<{ access_token?: string; refresh_token?: string }>;
}) {
  const searchParams = await props.searchParams;

  // Bypass server-side check if login tokens are present in URL (client will process them)
  if (searchParams.access_token && searchParams.refresh_token) {
    return <DashboardClient />;
  }

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    const signInUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL
      ? `${process.env.NEXT_PUBLIC_MAIN_APP_URL}/sign-in`
      : "http://localhost:3000/sign-in";
    redirect(signInUrl);
  }

  return <DashboardClient />;
}
