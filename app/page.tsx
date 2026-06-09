"use client";

import { useState } from "react";
import Billing from "@/components/Billing";
import Discover from "@/components/Discover";
import FindFounders from "@/components/FindFounders";
import Messages from "@/components/Messages";
import Notifications from "@/components/Notifications";
import Saved from "@/components/Saved";
import Settings from "@/components/Settings";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [activeTab, setActiveTab] = useState("discover");

  const content: Record<string, React.ReactNode> = {
    discover: <Discover />,
    search: <FindFounders/>,
    messages: <Messages/>,
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
