"use client";
import { LayoutDashboard, Search, MessageSquare, Bookmark, CreditCard, Settings, LogOut, Zap, Bell } from "lucide-react";

interface Props { activeTab: string; setActiveTab: (t: string) => void; }

const nav = [
  { id: "discover", label: "Discover", icon: LayoutDashboard },
  { id: "search", label: "Find Founders", icon: Search },
  { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "billing", label: "My Plan", icon: CreditCard },
];

export default function Sidebar({ activeTab, setActiveTab }: Props) {
  return (
    <aside style={{ width: 248, minHeight: "100vh", background: "#fff", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "24px 14px", position: "fixed", top: 0, left: 0, zIndex: 50, boxShadow: "2px 0 12px rgba(15,110,86,0.04)" }}>
      {/* Logo */}
      <div style={{ marginBottom: 32, paddingLeft: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "var(--primary)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(15,110,86,0.3)" }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "var(--text)", letterSpacing: "-0.5px" }}>founivo</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, paddingLeft: 46, fontWeight: 500 }}>User Dashboard</div>
      </div>

      {/* User pill */}
      <div style={{ background: "var(--primary-50)", border: "1px solid var(--primary-100)", borderRadius: 12, padding: "12px 14px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>ZA</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>Zara Ahmed</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>$500 Plan Active</div>
        </div>
        <div style={{ width: 8, height: 8, background: "var(--primary)", borderRadius: "50%", boxShadow: "0 0 6px rgba(15,110,86,0.5)" }} />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, paddingLeft: 14, marginBottom: 6, letterSpacing: "0.07em", textTransform: "uppercase" }}>Navigation</div>
        {nav.map(({ id, label, icon: Icon, badge }) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`sidebar-link ${activeTab === id ? "active" : ""}`}>
            <Icon size={17} />
            <span style={{ flex: 1 }}>{label}</span>
            {badge && <span style={{ background: activeTab === id ? "rgba(255,255,255,0.25)" : "var(--primary)", color: "white", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{badge}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 3 }}>
        <button onClick={() => setActiveTab("notifications")} className={`sidebar-link ${activeTab === "notifications" ? "active" : ""}`}>
          <Bell size={17} /><span style={{ flex: 1 }}>Notifications</span>
          <span style={{ background: "#ef4444", color: "white", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>2</span>
        </button>
        <button onClick={() => setActiveTab("settings")} className={`sidebar-link ${activeTab === "settings" ? "active" : ""}`}>
          <Settings size={17} />Settings
        </button>
        <button className="sidebar-link" style={{ color: "#ef4444" }}>
          <LogOut size={17} />Sign Out
        </button>
      </div>
    </aside>
  );
}
