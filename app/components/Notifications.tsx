"use client";
import { Bell, MessageSquare, Star, Zap, UserPlus } from "lucide-react";

const alerts = [
  { id: 1, title: "Meeting Accepted", desc: "Aisha Malik accepted your meeting request for Friday.", time: "2h ago", icon: Zap, color: "var(--primary)" },
  { id: 2, title: "New Message", desc: "Carlos Rivera sent you a message regarding payment APIs.", time: "4h ago", icon: MessageSquare, color: "#3b82f6" },
  { id: 3, title: "Founder Match", desc: "A new founder matching your AI/ML criteria just joined.", time: "1d ago", icon: UserPlus, color: "#8b5cf6" },
  { id: 4, title: "Profile View", desc: "Priya Nair viewed your profile.", time: "2d ago", icon: Star, color: "#f59e0b" },
];

export default function Notifications() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 800 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>Notifications</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Stay updated with your connections and activity</p>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {alerts.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={a.id} className="msg-row" style={{ padding: "20px 24px", borderBottom: i < alerts.length - 1 ? "1px solid var(--border)" : "none", borderRadius: 0 }}>
              <div style={{ width: 44, height: 44, background: `${a.color}15`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={20} color={a.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{a.title}</h4>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{a.time}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{a.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="btn-ghost" style={{ width: "fit-content", alignSelf: "center" }}>Mark all as read</button>
    </div>
  );
}
