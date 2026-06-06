"use client";
import { Bell, Shield, User, Trash2, CreditCard, Save } from "lucide-react";

export default function Settings() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 640 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>Settings</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 34, height: 34, background: "var(--primary-xlight)", border: "1px solid var(--primary-100)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={16} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Profile Info</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { label: "Full Name", val: "Zara Ahmed" },
            { label: "Email", val: "zara@example.com" },
            { label: "Location", val: "Karachi, PK" },
            { label: "Startup Stage", val: "Idea Stage" },
          ].map((f, i) => (
            <div key={i}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</div>
              <input className="input-field" defaultValue={f.val} style={{ fontSize: 13 }} />
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ marginTop: 18, fontSize: 13 }}><Save size={14} />Save Changes</button>
      </div>

      {/* Notifications */}
      {[
        { icon: Bell, title: "Notifications", items: [
          { label: "New founder joins", sub: "When a founder in your saved industry signs up", on: true },
          { label: "Message reply", sub: "When a founder replies to your message", on: true },
          { label: "Meeting confirmed", sub: "When a founder accepts your meeting request", on: true },
          { label: "Weekly digest", sub: "A summary of new founders each week", on: false },
        ]},
        { icon: Shield, title: "Privacy", items: [
          { label: "Show my profile to founders", sub: "Founders can see who viewed their profile", on: true },
          { label: "Allow founder follow-ups", sub: "Founders can send you connection requests", on: false },
        ]},
      ].map((section, si) => {
        const Icon = section.icon;
        return (
          <div key={si} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 34, height: 34, background: "var(--primary-xlight)", border: "1px solid var(--primary-100)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{section.title}</h3>
            </div>
            {section.items.map((item, ii) => (
              <div key={ii} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: ii < section.items.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{item.sub}</div>
                </div>
                <div style={{ width: 44, height: 24, background: item.on ? "var(--primary)" : "var(--border)", borderRadius: 12, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ width: 18, height: 18, background: "white", borderRadius: "50%", position: "absolute", top: 3, left: item.on ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {/* Payment */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 34, height: 34, background: "var(--primary-xlight)", border: "1px solid var(--primary-100)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CreditCard size={16} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Payment</h3>
        </div>
        <div style={{ padding: 16, background: "var(--bg-soft)", borderRadius: 12, border: "1px solid var(--border)", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Saved Card</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Visa **** 4521</div>
        </div>
        <button className="btn-ghost" style={{ fontSize: 13 }}><CreditCard size={14} />Update Payment Method</button>
      </div>

      {/* Danger */}
      <div className="card" style={{ border: "1px solid #fecaca" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Trash2 size={18} color="#ef4444" />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#ef4444" }}>Danger Zone</h3>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Deleting your account is permanent. All your saved founders, messages and plan access will be lost.</p>
        <button style={{ background: "transparent", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>Delete Account</button>
      </div>
    </div>
  );
}
