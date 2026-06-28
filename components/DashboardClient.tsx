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

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState("discover");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("access_token")) {
        url.searchParams.delete("access_token");
        url.searchParams.delete("refresh_token");
        window.history.replaceState({}, document.title, url.pathname + url.search);
      }
    }
  }, []);

  const content: Record<string, React.ReactNode> = {
    discover: <Discover />,
    search: <FindFounders />,
    messages: <Messages />,
    saved: <Saved />,
    billing: <Billing />,
    settings: <Settings />,
    notifications: <Notifications />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-soft)" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ marginLeft: 248, flex: 1, padding: "32px 36px", height: "100vh", overflowY: "auto" }}>
        {content[activeTab] ?? <Discover />}
      </main>
    </div>
  );
}
