"use client";
import { Bookmark, Star, MessageSquare, Eye, Trash2, MapPin } from "lucide-react";

const saved = [
  { name: "Aisha Malik", role: "CEO & Co-founder", company: "NovaTech AI", tags: ["AI/ML", "SaaS"], stage: "Series A", location: "San Francisco", avatar: "AM", rating: 4.9, savedAt: "2 days ago" },
  { name: "Carlos Rivera", role: "Founder", company: "GreenPay", tags: ["FinTech", "Payments"], stage: "Seed", location: "New York", avatar: "CR", rating: 4.8, savedAt: "3 days ago" },
  { name: "Sam Osei", role: "Founder", company: "HealthSync", tags: ["HealthTech"], stage: "Series A", location: "Nairobi", avatar: "SO", rating: 4.7, savedAt: "1 week ago" },
  { name: "Lena Müller", role: "CEO", company: "ClimateOps", tags: ["ClimaTech", "B2B"], stage: "Seed", location: "Berlin", avatar: "LM", rating: 4.6, savedAt: "1 week ago" },
  { name: "Priya Nair", role: "Co-founder & CTO", company: "EduBridge", tags: ["EdTech"], stage: "Pre-seed", location: "London", avatar: "PN", rating: 5.0, savedAt: "2 weeks ago" },
  { name: "David Kim", role: "Co-founder", company: "CryptoEdge", tags: ["Web3", "DeFi"], stage: "Pre-seed", location: "Singapore", avatar: "DK", rating: 4.5, savedAt: "3 weeks ago" },
];

export default function Saved() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>Saved Founders</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{saved.length} founders bookmarked</p>
        </div>
        <span className="green-tag">{saved.length} saved</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {saved.map((f, i) => (
          <div key={i} className="founder-card">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>{f.avatar}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{f.role}</div>
                </div>
              </div>
              <button style={{ background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} color="var(--text-muted)" /></button>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>{f.company}</div>

            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
              <MapPin size={11} color="var(--text-muted)" />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{f.location} · {f.stage}</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {f.tags.map((tag, j) => <span key={j} className="green-tag" style={{ fontSize: 11, padding: "3px 10px" }}>{tag}</span>)}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Star size={12} color="#f59e0b" fill="#f59e0b" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{f.rating}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Bookmark size={11} color="var(--text-muted)" />
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Saved {f.savedAt}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "8px" }}><Eye size={13} />View</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "8px" }}><MessageSquare size={13} />Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
