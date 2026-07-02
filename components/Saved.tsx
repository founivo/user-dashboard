"use client";
import { useState } from "react";
import { Bookmark, Star, MessageSquare, Eye, Trash2, MapPin, CheckCircle } from "lucide-react";

const initialSaved = [
  { name: "Aisha Malik", role: "CEO & Co-founder", company: "NovaTech AI", tags: ["AI/ML", "SaaS"], stage: "Series A", location: "San Francisco", avatar: "AM", rating: 4.9, savedAt: "2 days ago", verified: true, meetings: 32, bio: "Built and scaled 2 AI startups. Ex-Google. Passionate about helping founders navigate product-market fit." },
  { name: "Carlos Rivera", role: "Founder", company: "GreenPay", tags: ["FinTech", "Payments"], stage: "Seed", location: "New York", avatar: "CR", rating: 4.8, savedAt: "3 days ago", verified: true, meetings: 18, bio: "Fintech entrepreneur with 8 years experience. Raised $2M seed round. Love helping first-time founders." },
  { name: "Sam Osei", role: "Founder", company: "HealthSync", tags: ["HealthTech"], stage: "Series A", location: "Nairobi", avatar: "SO", rating: 4.7, savedAt: "1 week ago", verified: true, meetings: 45, bio: "Healthcare innovator focusing on telemedicine in emerging markets. Looking for strategic partnerships." },
  { name: "Lena Müller", role: "CEO", company: "ClimateOps", tags: ["ClimaTech", "B2B"], stage: "Seed", location: "Berlin", avatar: "LM", rating: 4.6, savedAt: "1 week ago", verified: false, meetings: 12, bio: "Decarbonizing supply chains using blockchain. Former consultant with a mission to save the planet." },
  { name: "Priya Nair", role: "Co-founder & CTO", company: "EduBridge", tags: ["EdTech"], stage: "Pre-seed", location: "London", avatar: "PN", rating: 5.0, savedAt: "2 weeks ago", verified: true, meetings: 41, bio: "Technical co-founder turned CEO. MIT grad. Passionate about accessible education and early-stage tech." },
  { name: "David Kim", role: "Co-founder", company: "CryptoEdge", tags: ["Web3", "DeFi"], stage: "Pre-seed", location: "Singapore", avatar: "DK", rating: 4.5, savedAt: "3 weeks ago", verified: true, meetings: 8, bio: "Building the next generation of decentralized exchanges. Deep background in quantitative trading." },
];

export default function Saved() {
  const [savedList, setSavedList] = useState(initialSaved);

  const removeBookmark = (name: string) => {
    setSavedList(prev => prev.filter(f => f.name !== name));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }} className="fade-in">
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>Saved Founders</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
            Manage your bookmarked founder profiles
          </p>
        </div>
        <span className="green-tag">{savedList.length} bookmarked</span>
      </div>

      {savedList.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", background: "#ffffff", border: "1px dashed var(--border)", borderRadius: "20px", padding: 40, textAlign: "center" }}>
          <Bookmark size={36} color="var(--text-muted)" style={{ marginBottom: 12 }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>No bookmarked founders yet</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6, maxWidth: 300 }}>Browse the directory and bookmark founders you'd like to reach out to later.</p>
        </div>
      ) : (
        /* Compact Grid */
        <div className="compact-saved-grid">
          {savedList.map((f, i) => (
            <div key={i} className="founder-compact-card">
              <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div className="avatar" style={{ width: 44, height: 44, fontSize: 14, background: "linear-gradient(135deg, var(--primary), var(--primary-light))" }}>{f.avatar}</div>
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, background: "var(--primary)", borderRadius: "50%", border: "2px solid white" }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", fontFamily: "'Syne', sans-serif" }}>{f.name}</span>
                    {f.verified && <CheckCircle size={13} color="var(--primary)" fill="var(--primary-xlight)" />}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 550, marginTop: 1, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{f.role} @ {f.company}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 11, color: "var(--text-muted)" }}>
                    <MapPin size={10} />
                    <span>{f.location} · {f.stage}</span>
                  </div>
                </div>

                <button 
                  onClick={() => removeBookmark(f.name)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                  title="Remove bookmark"
                >
                  <Trash2 size={14} color="#ef4444" />
                </button>
              </div>

              <p className="card-bio-short">{f.bio}</p>

              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
                {f.tags.map((tag, j) => (
                  <span key={j} className="green-tag" style={{ fontSize: 10, padding: "2px 8px" }}>{tag}</span>
                ))}
              </div>

              <div className="card-bottom-actions">
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Star size={11} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{f.rating}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="card-btn-outline">Profile</button>
                  <button className="card-btn-primary">Connect</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .compact-saved-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
        }
        .founder-compact-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
        }
        .founder-compact-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-200);
        }
        .card-bio-short {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.55;
          margin: 10px 0 12px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          height: 38px;
        }
        .card-bottom-actions {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border);
          padding-top: 10px;
        }
        .card-btn-outline {
          background: none;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }
        .card-btn-outline:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-xlight);
        }
        .card-btn-primary {
          background: var(--primary);
          border: none;
          color: white;
          border-radius: 8px;
          padding: 6px 14px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }
        .card-btn-primary:hover {
          background: var(--primary-dark);
          transform: translateY(-0.5px);
        }
      `}</style>
    </div>
  );
}
