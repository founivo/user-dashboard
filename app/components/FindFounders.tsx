"use client";
import { useState } from "react";
import { Search, Filter, Star, Eye, MessageSquare, Bookmark, MapPin, CheckCircle } from "lucide-react";

const founders = [
  { name: "Aisha Malik", role: "CEO & Co-founder", company: "NovaTech AI", industry: "AI/ML", stage: "Series A", location: "San Francisco", tags: ["AI/ML", "SaaS", "B2B", "Fundraising"], avatar: "AM", rating: 4.9, views: 284, meetings: 32, available: true, verified: true, bio: "Built and scaled 2 AI startups. Ex-Google. Passionate about helping founders navigate product-market fit." },
  { name: "Carlos Rivera", role: "Founder", company: "GreenPay", industry: "FinTech", stage: "Seed", location: "New York", tags: ["FinTech", "Payments", "Scaling"], avatar: "CR", rating: 4.8, views: 197, meetings: 18, available: true, verified: true, bio: "Fintech entrepreneur with 8 years experience. Raised $2M seed round. Love helping first-time founders." },
  { name: "Priya Nair", role: "Co-founder & CTO", company: "EduBridge", industry: "EdTech", stage: "Pre-seed", location: "London", tags: ["EdTech", "B2C", "Tech"], avatar: "PN", rating: 5.0, views: 341, meetings: 41, available: false, verified: true, bio: "Technical co-founder turned CEO. MIT grad. Passionate about accessible education and early-stage tech." },
  { name: "Sam Osei", role: "Founder", company: "HealthSync", industry: "HealthTech", stage: "Series A", location: "Nairobi", tags: ["HealthTech", "Africa", "Impact"], avatar: "SO", rating: 4.7, views: 156, meetings: 24, available: true, verified: true, bio: "Health tech founder operating across East Africa. 3x exits. Mentor at Techstars Africa." },
  { name: "Lena Müller", role: "CEO", company: "ClimateOps", industry: "ClimaTech", stage: "Seed", location: "Berlin", tags: ["ClimaTech", "B2B", "Hardware"], avatar: "LM", rating: 4.6, views: 122, meetings: 15, available: true, verified: false, bio: "Climate tech CEO building carbon management tools for enterprise. YC S22 alumni." },
  { name: "David Kim", role: "Co-founder", company: "CryptoEdge", industry: "Web3", stage: "Pre-seed", location: "Singapore", tags: ["Web3", "DeFi", "Community"], avatar: "DK", rating: 4.5, views: 98, meetings: 11, available: false, verified: true, bio: "Web3 builder since 2017. Co-founded 3 blockchain protocols. Deep expertise in DeFi and tokenomics." },
];

const industries = ["All", "AI/ML", "FinTech", "HealthTech", "EdTech", "Web3", "ClimaTech", "SaaS"];
const stages = ["All Stages", "Pre-seed", "Seed", "Series A", "Series B+"];

export default function FindFounders() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");
  const [stage, setStage] = useState("All Stages");
  const [saved, setSaved] = useState<number[]>([]);

  const filtered = founders.filter(f => {
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.company.toLowerCase().includes(search.toLowerCase()) || f.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchIndustry = industry === "All" || f.industry === industry;
    const matchStage = stage === "All Stages" || f.stage === stage;
    return matchSearch && matchIndustry && matchStage;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>Find Founders</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{founders.length} verified founders ready to connect</p>
      </div>

      {/* Search + Filters */}
      <div className="card" style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
            <Search size={15} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input className="input-field" placeholder="Search name, company, skill..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
          </div>
          <select className="input-field" value={industry} onChange={e => setIndustry(e.target.value)} style={{ width: 160 }}>
            {industries.map(i => <option key={i}>{i}</option>)}
          </select>
          <select className="input-field" value={stage} onChange={e => setStage(e.target.value)} style={{ width: 150 }}>
            {stages.map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="btn-ghost" style={{ fontSize: 13 }}><Filter size={14} />More Filters</button>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          {industries.slice(1).map(i => (
            <button key={i} onClick={() => setIndustry(industry === i ? "All" : i)} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", background: industry === i ? "var(--primary)" : "var(--bg-soft)", color: industry === i ? "white" : "var(--text-secondary)", border: `1px solid ${industry === i ? "var(--primary)" : "var(--border)"}` }}>
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>Showing <strong style={{ color: "var(--text)" }}>{filtered.length}</strong> founders</div>

      {/* Founder grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {filtered.map((f, i) => (
          <div key={i} className="founder-card">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
              <div style={{ position: "relative" }}>
                <div className="avatar" style={{ width: 52, height: 52, fontSize: 17 }}>{f.avatar}</div>
                {f.available && <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, background: "var(--primary)", borderRadius: "50%", border: "2px solid white" }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>{f.name}</span>
                  {f.verified && <CheckCircle size={14} color="var(--primary)" fill="var(--primary-xlight)" />}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{f.role} @ {f.company}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <MapPin size={11} color="var(--text-muted)" />
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{f.location}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 4 }}>·</span>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>{f.stage}</span>
                </div>
              </div>
              <button onClick={() => setSaved(saved.includes(i) ? saved.filter(s => s !== i) : [...saved, i])} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <Bookmark size={16} color={saved.includes(i) ? "var(--primary)" : "var(--text-muted)"} fill={saved.includes(i) ? "var(--primary)" : "none"} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>{f.bio}</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {f.tags.slice(0, 3).map((tag, j) => <span key={j} className="green-tag" style={{ fontSize: 11, padding: "3px 10px" }}>{tag}</span>)}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)", marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{f.rating}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Eye size={12} color="var(--text-muted)" />
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{f.views} views</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MessageSquare size={12} color="var(--text-muted)" />
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{f.meetings} meetings</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-outline" style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "9px" }}>
                <Eye size={13} />View Profile
              </button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "9px" }}>
                <MessageSquare size={13} />Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
