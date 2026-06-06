"use client";
import { Check, Zap, Star, Crown, CreditCard, Calendar, ArrowUpRight } from "lucide-react";

const plans = [
  { name: "Starter", price: "$200", icon: Zap, color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", current: false, features: ["View founder email", "View social media profiles", "Read founder bio & about", "Basic profile info", "Unlimited profile browsing"] },
  { name: "Connect", price: "$500", icon: Star, color: "#0F6E56", bg: "#e6f4f1", border: "#a3dbcd", current: true, features: ["Everything in Starter", "View phone number", "View WhatsApp contact", "Direct messaging", "Meeting request (high priority)", "Founder earns 10% per meeting"], highlight: "Most Popular" },
  { name: "Premium", price: "$3,000", icon: Crown, color: "#d97706", bg: "#fffbeb", border: "#fde68a", current: false, features: ["Everything in Connect", "All $500 features", "Extended meeting time", "Priority matching", "Dedicated support", "Top of search results"] },
];

const history = [
  { plan: "Connect Plan", amount: "$500", date: "Jun 1, 2025", status: "Active" },
  { plan: "Starter Plan", amount: "$200", date: "Mar 12, 2025", status: "Expired" },
];

export default function Billing() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>My Plan</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Manage your Founivo subscription</p>
      </div>

      {/* Current plan banner */}
      <div style={{ background: "linear-gradient(135deg, var(--primary), #1ab38a)", borderRadius: 16, padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Current Plan</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "white", fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>Connect — $500</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>Active since Jun 1, 2025 · One-time payment</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 18px", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>Messages left</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "white", fontFamily: "'Syne', sans-serif" }}>Unlimited</div>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>No expiry on your plan</div>
        </div>
      </div>

      {/* Plan cards */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>All Plans</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {plans.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} style={{ background: p.current ? p.bg : "#fff", border: `2px solid ${p.current ? p.border : "var(--border)"}`, borderRadius: 16, padding: "24px", position: "relative", boxShadow: p.current ? "0 4px 20px rgba(15,110,86,0.12)" : "var(--shadow-sm)" }}>
                {p.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: p.color, color: "white", borderRadius: 20, padding: "3px 14px", fontSize: 11, fontWeight: 700, fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap" }}>{p.highlight}</div>}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 38, height: 38, background: p.bg, borderRadius: 10, border: `1px solid ${p.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color={p.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>One-time</div>
                  </div>
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: p.color, fontFamily: "'Syne', sans-serif", letterSpacing: "-1px", marginBottom: 20 }}>{p.price}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {p.features.map((feat, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ width: 16, height: 16, background: `${p.color}20`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <Check size={9} color={p.color} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{feat}</span>
                    </div>
                  ))}
                </div>
                {p.current
                  ? <div style={{ width: "100%", padding: "10px", textAlign: "center", background: p.color, color: "white", borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>✓ Current Plan</div>
                  : <button className="btn-outline" style={{ width: "100%", justifyContent: "center", borderColor: p.color, color: p.color, fontSize: 13 }}>
                      {plans.indexOf(p) > plans.findIndex(pl => pl.current) ? "Upgrade" : "Downgrade"} <ArrowUpRight size={14} />
                    </button>
                }
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment history */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <CreditCard size={16} color="var(--primary)" />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Payment History</h3>
        </div>
        {history.map((h, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < history.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, background: "var(--primary-xlight)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CreditCard size={16} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{h.plan}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                  <Calendar size={11} color="var(--text-muted)" />
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{h.date}</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: h.status === "Active" ? "var(--primary-xlight)" : "#f3f4f6", color: h.status === "Active" ? "var(--primary)" : "var(--text-muted)", border: `1px solid ${h.status === "Active" ? "var(--primary-100)" : "var(--border)"}` }}>{h.status}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>{h.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
