"use client";
import { useState, useEffect } from "react";
import { Bookmark, Star, MessageSquare, Eye, Trash2, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";
import { DashboardFounder } from "@/app/lib/googleSheets";
import Link from "next/link";
import { getSlug } from "./FindFounders";

interface ProfileMetadata {
  personal_photo?: string;
  startup_logo?: string;
  fees_30m?: string;
  fees_1h?: string;
  fees_custom_min?: string;
  fees_custom_val?: string;
  skills?: string[];
  
  startup_name?: string;
  startup_stage?: string;
  startup_category?: string;
  startup_location?: string;
  startup_team_size?: string;
  startup_funding?: string;
  startup_bio?: string;
  startup_linkedin?: string;
  startup_twitter?: string;
  startup_website?: string;
}

const parseBioAndMetadata = (rawBio: string): { bioText: string; metadata: ProfileMetadata } => {
  const marker = "\n\n---METADATA---\n";
  if (rawBio && rawBio.includes(marker)) {
    const parts = rawBio.split(marker);
    const bioText = parts[0];
    try {
      const metadata = JSON.parse(parts[1]);
      return { bioText, metadata };
    } catch (e) {
      console.error("Error parsing profile metadata:", e);
      return { bioText: rawBio, metadata: {} };
    }
  }
  return { bioText: rawBio || "", metadata: {} };
};

const INITIAL_MOCK_FOUNDERS: DashboardFounder[] = [
  { name: "Bilal Raza", role: "Co-founder & CEO", company: "Founivo", industry: "AI/ML", stage: "Seed", location: "Pakistan", tags: ["AI/ML", "SaaS", "B2B"], avatar: "BR", rating: 4.9, views: 312, meetings: 45, available: true, verified: true, bio: "Building Founivo to connect elite startup founders. Software engineer, passionate about AI agent workflows and product growth.", email: "bilal@founivo.com", linkedin: "https://linkedin.com/in/bilalraza", companywebsite: "https://founivo.com" },
  { name: "Nehal Raza", role: "Co-founder & CTO", company: "Founivo", industry: "SaaS", stage: "Seed", location: "Pakistan", tags: ["SaaS", "Scaling", "Full Stack"], avatar: "NR", rating: 5.0, views: 284, meetings: 32, available: true, verified: true, bio: "Co-founder & CTO at Founivo. Ex-Software Architect. Passionate about next-gen frontend engineering, database optimization, and web performance.", email: "nehal@founivo.com", linkedin: "https://linkedin.com/in/nehalraza", companywebsite: "https://founivo.com" },
  { name: "Hamza Sheikh", role: "Founder & CEO", company: "DealFlow", industry: "FinTech", stage: "Pre-seed", location: "Pakistan", tags: ["FinTech", "Payments", "B2B"], avatar: "HS", rating: 4.8, views: 156, meetings: 18, available: true, verified: true, bio: "Fintech innovator building payment infrastructure for businesses in Pakistan. Passionate about financial inclusion.", email: "hamza@dealflow.pk", linkedin: "https://linkedin.com/in/hamzasheikh", companywebsite: "https://dealflow.pk" },
  { name: "Zainab Khan", role: "Co-founder", company: "HealthAI", industry: "HealthTech", stage: "Seed", location: "Pakistan", tags: ["HealthTech", "AI/ML", "MedTech"], avatar: "ZK", rating: 4.7, views: 197, meetings: 24, available: true, verified: true, bio: "Building AI tools for radiology and diagnostics. Medical researcher turned tech entrepreneur.", email: "zainab@healthai.pk", linkedin: "https://linkedin.com/in/zainabkhan", companywebsite: "https://healthai.pk" },
  { name: "Sarah Ahmed", role: "Founder", company: "Edubase", industry: "EdTech", stage: "Pre-seed", location: "Pakistan", tags: ["EdTech", "B2C", "E-Learning"], avatar: "SA", rating: 4.6, views: 122, meetings: 15, available: true, verified: true, bio: "Ex-educator building gamified learning environments for local school children. Passionate about primary education.", email: "sarah@edubase.pk", linkedin: "https://linkedin.com/in/sarahahmed", companywebsite: "https://edubase.pk" },
  { name: "Muhammad Ali", role: "Co-founder & CTO", company: "Web3Space", industry: "Web3", stage: "Seed", location: "Pakistan", tags: ["Web3", "Blockchain", "DeFi"], avatar: "MA", rating: 4.5, views: 98, meetings: 11, available: false, verified: true, bio: "Decentralized applications developer and smart contract auditor. Helping brands transition into the Web3 space.", email: "ali@web3space.io", linkedin: "https://linkedin.com/in/muhammadali", companywebsite: "https://web3space.io" },
];

interface SavedProps {
  savedFounders: string[];
  toggleSave: (name: string) => void;
}

export default function Saved({ savedFounders, toggleSave }: SavedProps) {
  const [foundersList, setFoundersList] = useState<DashboardFounder[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const loadFounders = async () => {
      setLoading(true);
      let dbMappedFounders: DashboardFounder[] = [];

      try {
        const { data: dbFounders } = await supabase
          .from("founder_profiles")
          .select("*");
        
        if (dbFounders) {
          dbMappedFounders = dbFounders.map((f: any) => {
            const { bioText, metadata: parsed } = parseBioAndMetadata(f.bio || "");
            return {
              name: f.full_name,
              role: f.role || "Founder",
              company: f.company || parsed.startup_name || "Stealth Startup",
              industry: parsed.startup_category || f.category || "AI/ML",
              stage: parsed.startup_stage || "Seed",
              location: parsed.startup_location || "Pakistan",
              tags: parsed.skills || ["Founder", "Tech Startup"],
              avatar: parsed.personal_photo || f.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
              rating: 4.9,
              views: 142,
              meetings: 0,
              available: true,
              verified: true,
              bio: bioText,
              email: "founder-contact@founivo.io",
              linkedin: f.linkedin || parsed.startup_linkedin || "",
              companywebsite: f.website || parsed.startup_website || ""
            };
          });
        }
      } catch (err) {
        console.error("Failed to query live database profiles:", err);
      }

      // Merge Supabase DB profiles with INITIAL_MOCK_FOUNDERS
      const mergedList = [...dbMappedFounders];
      INITIAL_MOCK_FOUNDERS.forEach(sf => {
        const nameSlug = getSlug(sf.name);
        const exists = dbMappedFounders.some(dbf => getSlug(dbf.name) === nameSlug);
        if (!exists) {
          mergedList.push(sf);
        }
      });

      setFoundersList(mergedList);
      setLoading(false);
    };

    loadFounders();
  }, [supabase]);

  // Construct saved list by mapping saved slugs to profiles (with mock fallback lookup)
  const savedList: DashboardFounder[] = [];
  savedFounders.forEach(slug => {
    let found = foundersList.find(f => getSlug(f.name) === slug);
    if (!found) {
      found = INITIAL_MOCK_FOUNDERS.find(f => getSlug(f.name) === slug);
    }
    if (found) {
      savedList.push(found);
    }
  });

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

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
          <Loader2 className="animate-spin" size={32} color="var(--primary)" />
        </div>
      ) : savedList.length === 0 ? (
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
                  <div className="avatar" style={{ width: 44, height: 44, fontSize: 14, background: "linear-gradient(135deg, var(--primary), var(--primary-light))", position: "relative", overflow: "hidden" }}>
                    {f.avatar && (f.avatar.startsWith("data:image") || f.avatar.startsWith("http")) ? (
                      <img src={f.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={f.name} />
                    ) : (
                      f.avatar
                    )}
                  </div>
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
                  onClick={() => toggleSave(f.name)}
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
                  <Link href={`/founder/${getSlug(f.name)}`}>
                    <button className="card-btn-outline">Profile</button>
                  </Link>
                  <Link href={`/founder/${getSlug(f.name)}`}>
                    <button className="card-btn-primary">Connect</button>
                  </Link>
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
