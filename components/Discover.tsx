"use client";
import { useState, useEffect } from "react";
import { 
  Search, TrendingUp, Star, Zap, ArrowRight, Eye, 
  MessageSquare, Bookmark, ChevronRight, CheckCircle, 
  MapPin, Bot, CreditCard, Activity, BookOpen, Settings, Link as LinkIcon, Loader2
} from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";
import Link from "next/link";
import { getSlug } from "./FindFounders";
import { DashboardFounder } from "@/app/lib/googleSheets";

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

const featured = [
  { 
    name: "Bilal Raza", role: "Co-founder & CEO", company: "Founivo", 
    tags: ["AI/ML", "SaaS"], stage: "Seed", location: "Pakistan",
    avatar: "BR", rating: 4.9, meetings: 45, views: 312, available: true, verified: true,
    bio: "Building Founivo to connect elite startup founders. Software engineer, passionate about AI agent workflows and product growth."
  },
  { 
    name: "Nehal Raza", role: "Co-founder & CTO", company: "Founivo", 
    tags: ["SaaS", "Scaling"], stage: "Seed", location: "Pakistan",
    avatar: "NR", rating: 5.0, meetings: 32, views: 284, available: true, verified: true,
    bio: "Co-founder & CTO at Founivo. Ex-Software Architect. Passionate about next-gen frontend engineering, database optimization, and web performance."
  },
  { 
    name: "Hamza Sheikh", role: "Founder & CEO", company: "DealFlow", 
    tags: ["FinTech", "B2B"], stage: "Pre-seed", location: "Pakistan",
    avatar: "HS", rating: 4.8, meetings: 18, views: 156, available: true, verified: true,
    bio: "Fintech innovator building payment infrastructure for businesses in Pakistan. Passionate about financial inclusion."
  },
  { 
    name: "Zainab Khan", role: "Co-founder", company: "HealthAI", 
    tags: ["HealthTech", "AI/ML"], stage: "Seed", location: "Pakistan",
    avatar: "ZK", rating: 4.7, meetings: 24, views: 197, available: true, verified: true,
    bio: "Building AI tools for radiology and diagnostics. Medical researcher turned tech entrepreneur."
  },
];

const categories = [
  { label: "AI & Machine Learning", count: 128, icon: Bot },
  { label: "FinTech", count: 94, icon: CreditCard },
  { label: "HealthTech", count: 76, icon: Activity },
  { label: "EdTech", count: 63, icon: BookOpen },
  { label: "SaaS & B2B", count: 112, icon: Settings },
  { label: "Web3 & Crypto", count: 45, icon: LinkIcon },
];

interface DiscoverProps {
  savedFounders: string[];
  toggleSave: (name: string) => void;
}

export default function Discover({ savedFounders, toggleSave }: DiscoverProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [foundersList, setFoundersList] = useState<DashboardFounder[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL;

    const loadFounders = async () => {
      let sheetsFounders: DashboardFounder[] = [];
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

      try {
        if (sheetUrl) {
          const { fetchFoundersFromGoogleSheet } = await import("@/app/lib/googleSheets");
          const data = await fetchFoundersFromGoogleSheet(sheetUrl);
          if (data && data.length > 0) {
            sheetsFounders = data;
          }
        }
      } catch (err) {
        console.error("Failed to load Google Sheet, using fallback.", err);
      }

      const mergedList = [...dbMappedFounders];
      sheetsFounders.forEach(sf => {
        const nameSlug = getSlug(sf.name);
        const exists = dbMappedFounders.some(dbf => getSlug(dbf.name) === nameSlug);
        if (!exists) {
          mergedList.push(sf);
        }
      });

      setFoundersList(mergedList);
    };

    loadFounders();
  }, [supabase]);

  // Merge live database/sheets attributes with the featured mock array items (especially custom uploaded avatars)
  const featuredList = featured.map(feat => {
    const live = foundersList.find(f => getSlug(f.name) === getSlug(feat.name));
    if (live) {
      return {
        ...feat,
        avatar: live.avatar,
        role: live.role,
        company: live.company,
        bio: live.bio,
        tags: live.tags,
        location: live.location,
        stage: live.stage
      };
    }
    return feat;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }} className="fade-in">
      {/* Hero banner */}
      <div className="hero-banner">
        <div className="hero-shimmer" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="status-pill">
            <Zap size={11} color="white" fill="white" />
            <span>518 Verified Founders Online</span>
          </div>
          <h1 className="hero-title">
            Connect with Elite Startup Founders
          </h1>
          <p className="hero-subtitle">
            Skip the gatekeepers. Connect with vetted founders for strategic partnerships, direct advice, and investment opportunities.
          </p>
          <div className="search-bar-wrapper">
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
              <input 
                className="input-field" 
                placeholder="Search founders by name, startup, category..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 46, height: 50, border: "none", borderRadius: "14px", background: "#ffffff" }} 
              />
            </div>
            <button className="btn-primary search-btn">Explore</button>
          </div>
        </div>
      </div>

      {/* Featured founders */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>Recommended for You</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Top connections based on your industry preferences</p>
          </div>
          <button style={{ fontSize: 13, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
            View all <ChevronRight size={15} />
          </button>
        </div>
        
        {/* Responsive Grid instead of pure horizontal scroll */}
        <div className="founders-grid">
          {featuredList.map((f, i) => (
            <div key={i} className="founder-compact-card">
              <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div 
                    className="avatar" 
                    style={{ 
                      width: 44, 
                      height: 44, 
                      fontSize: 14, 
                      background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    {f.avatar && (f.avatar.startsWith("data:image") || f.avatar.startsWith("http")) ? (
                      <img src={f.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={f.name} />
                    ) : (
                      f.avatar
                    )}
                  </div>
                  {f.available && <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, background: "var(--primary)", borderRadius: "50%", border: "2px solid white" }} />}
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
                >
                  <Bookmark size={15} color={savedFounders.includes(getSlug(f.name)) ? "var(--primary)" : "var(--text-muted)"} fill={savedFounders.includes(getSlug(f.name)) ? "var(--primary)" : "none"} />
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
      </div>

      {/* Categories */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>Browse by Category</h3>
        <div className="categories-grid">
          {categories.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="category-card">
                <div className="category-icon-wrapper">
                  <Icon size={18} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 750, color: "var(--text)" }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{c.count} verified founders</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .hero-banner {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          border-radius: 20px;
          padding: 32px 36px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(15,110,86,0.12);
        }
        .hero-shimmer {
          position: absolute;
          top: -50px;
          right: -50px;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
          border-radius: 50%;
        }
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 4px 12px;
          margin-bottom: 14px;
          font-size: 11px;
          color: white;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .hero-title {
          font-size: 28px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
          line-height: 1.25;
        }
        .hero-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.85);
          margin-bottom: 24px;
          max-width: 520px;
          line-height: 1.6;
        }
        .search-bar-wrapper {
          display: flex;
          gap: 10px;
          max-width: 550px;
          width: 100%;
        }
        .search-btn {
          background: #ffffff !important;
          color: var(--primary) !important;
          padding: 0 24px !important;
          height: 50px !important;
          border-radius: 14px !important;
          font-size: 13px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
        }
        .search-btn:hover {
          background: var(--primary-xlight) !important;
          transform: translateY(-1px) !important;
        }
        
        /* Compact Grid */
        .founders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
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
          line-height: 1.5;
          margin: 10px 0 12px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          height: 36px;
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
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
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
          padding: 5px 12px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
        }
        .card-btn-primary:hover {
          background: var(--primary-dark);
          transform: translateY(-0.5px);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }
        .category-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .category-card:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
          border-color: var(--primary-200);
        }
        .category-icon-wrapper {
          width: 36px;
          height: 36px;
          background: var(--primary-xlight);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @media (max-width: 600px) {
          .hero-banner {
            padding: 24px 20px;
          }
          .hero-title {
            font-size: 22px;
          }
          .search-bar-wrapper {
            flex-direction: column;
            gap: 8px;
          }
          .search-btn {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
