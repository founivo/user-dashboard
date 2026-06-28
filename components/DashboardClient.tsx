"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Discover from "./Discover";
import FindFounders from "./FindFounders";
import Messages from "./Messages";
import Saved from "./Saved";
import Billing from "./Billing";
import Settings from "./Settings";
import Notifications from "./Notifications";
import { createClient } from "@/app/utils/supabase/client";

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState("discover");
  const [syncing, setSyncing] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function syncSession() {
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        const accessToken = url.searchParams.get("access_token");
        const refreshToken = url.searchParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            url.searchParams.delete("access_token");
            url.searchParams.delete("refresh_token");
            window.history.replaceState({}, document.title, url.pathname + url.search);
            window.location.reload();
            return;
          }
        }
      }
      setSyncing(false);
    }
    syncSession();
  }, [supabase]);

  const content: Record<string, React.ReactNode> = {
    discover: <Discover />,
    search: <FindFounders />,
    messages: <Messages />,
    saved: <Saved />,
    billing: <Billing />,
    settings: <Settings />,
    notifications: <Notifications />,
  };

  if (syncing) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg-soft)", color: "#04342C", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ border: "4px solid rgba(15,110,86,0.1)", borderTop: "4px solid #0F6E56", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 16px" }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ fontWeight: "bold" }}>Syncing your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-soft)" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ marginLeft: 248, flex: 1, padding: "32px 36px", height: "100vh", overflowY: "auto" }}>
        {content[activeTab] ?? <Discover />}
      </main>
    </div>
  );
}
