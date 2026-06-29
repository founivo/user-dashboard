import { createClient } from "./utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import { getMainAppUrl } from "./lib/config";

export default async function Home(props: {
  searchParams: Promise<{ access_token?: string; refresh_token?: string }>;
}) {
  const searchParams = await props.searchParams;

  // Bypass server-side check if login tokens are present in URL (client will process them)
  if (searchParams.access_token && searchParams.refresh_token) {
    return <DashboardClient />;
  }

  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch (err) {
    console.error("Auth check failed server-side:", err);
  }

  if (!user) {
    redirect(`${getMainAppUrl()}/sign-in`);
  }

  return <DashboardClient />;
}
