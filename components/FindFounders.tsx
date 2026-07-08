"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, Star, Eye, MessageSquare, Bookmark, MapPin, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { DashboardFounder } from "@/app/lib/googleSheets";
import { createClient } from "@/app/utils/supabase/client";

// Helper to generate URL-friendly slugs/usernames from name
export function getSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

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
  { name: "Aisha Malik", role: "CEO & Co-founder", company: "NovaTech AI", industry: "AI/ML", stage: "Series A", location: "San Francisco", tags: ["AI/ML", "SaaS", "B2B"], avatar: "AM", rating: 4.9, views: 284, meetings: 32, available: true, verified: true, bio: "Built and scaled 2 AI startups. Ex-Google. Passionate about helping founders navigate product-market fit.", email: "aisha@novatech.io", linkedin: "https://linkedin.com/in/aishamalik", companywebsite: "https://novatech.io" },
  { name: "Carlos Rivera", role: "Founder", company: "GreenPay", industry: "FinTech", stage: "Seed", location: "New York", tags: ["FinTech", "Payments", "Scaling"], avatar: "CR", rating: 4.8, views: 197, meetings: 18, available: true, verified: true, bio: "Fintech entrepreneur with 8 years experience. Raised $2M seed round. Love helping first-time founders.", email: "carlos@greenpay.co", linkedin: "https://linkedin.com/in/carlosrivera", companywebsite: "https://greenpay.co" },
  { name: "Priya Nair", role: "Co-founder & CTO", company: "EduBridge", industry: "EdTech", stage: "Pre-seed", location: "London", tags: ["EdTech", "B2C", "Tech"], avatar: "PN", rating: 5.0, views: 341, meetings: 41, available: false, verified: true, bio: "Technical co-founder turned CEO. MIT grad. Passionate about accessible education and early-stage tech.", email: "priya@edubridge.io", linkedin: "https://linkedin.com/in/priyanair", companywebsite: "https://edubridge.io" },
  { name: "Sam Osei", role: "Founder", company: "HealthSync", industry: "HealthTech", stage: "Series A", location: "Nairobi", tags: ["HealthTech", "Africa", "Impact"], avatar: "SO", rating: 4.7, views: 156, meetings: 24, available: true, verified: true, bio: "Health tech founder operating across East Africa. 3x exits. Mentor at Techstars Africa.", email: "sam@healthsync.co", linkedin: "https://linkedin.com/in/samosei", companywebsite: "https://healthsync.co" },
  { name: "Lena Müller", role: "CEO", company: "ClimateOps", industry: "ClimaTech", stage: "Seed", location: "Berlin", tags: ["ClimaTech", "B2B"], avatar: "LM", rating: 4.6, views: 122, meetings: 15, available: true, verified: false, bio: "Climate tech CEO building carbon management tools for enterprise. YC S22 alumni.", email: "lena@climateops.de", linkedin: "https://linkedin.com/in/lenamuller", companywebsite: "https://climateops.de" },
  { name: "David Kim", role: "Co-founder", company: "CryptoEdge", industry: "Web3", stage: "Pre-seed", location: "Singapore", tags: ["Web3", "DeFi"], avatar: "DK", rating: 4.5, views: 98, meetings: 11, available: false, verified: true, bio: "Web3 builder since 2017. Co-founded 3 blockchain protocols. Deep expertise in DeFi and tokenomics.", email: "david@cryptoedge.io", linkedin: "https://linkedin.com/in/davidkim", companywebsite: "https://cryptoedge.io" },
];

const industries = ["All", "AI/ML", "FinTech", "HealthTech", "EdTech", "Web3", "ClimaTech", "SaaS"];
const stages = ["All Stages", "Pre-seed", "Seed", "Series A", "Series B+"];
const locations = ["All Locations", "Pakistan", "United States", "United Kingdom", "Canada", "Germany", "Singapore", "UAE"];

export default function FindFounders() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");
  const [stage, setStage] = useState("All Stages");
  const [location, setLocation] = useState("All Locations");
  const [saved, setSaved] = useState<number[]>([]);
  const [foundersList, setFoundersList] = useState<DashboardFounder[]>([]);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL;

    const loadFounders = async () => {
      setLoading(true);
      let sheetsFounders: DashboardFounder[] = [];
      let dbMappedFounders: DashboardFounder[] = [];

      // 1. Fetch live founder_profiles from Supabase
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

      // 2. Fetch mock founders from Google Sheet or Local Backup
      try {
        if (sheetUrl) {
          const { fetchFoundersFromGoogleSheet } = await import("@/app/lib/googleSheets");
          const data = await fetchFoundersFromGoogleSheet(sheetUrl);
          if (data && data.length > 0) {
            sheetsFounders = data;
          }
        } else {
          sheetsFounders = INITIAL_MOCK_FOUNDERS;
        }
      } catch (err) {
        console.error("Failed to load Google Sheet, using local mock data.", err);
        sheetsFounders = INITIAL_MOCK_FOUNDERS;
      }

      // 3. Merge & Deduplicate (Preclude Sheets profiles if name matches a live DB record)
      const mergedList = [...dbMappedFounders];
      
      sheetsFounders.forEach(sf => {
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
  }, []);

  const filtered = foundersList.filter(f => {
    const matchSearch = !search || 
      f.name.toLowerCase().includes(search.toLowerCase()) || 
      f.company.toLowerCase().includes(search.toLowerCase()) || 
      f.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    
    // Support sub-matching for dropdowns
    const matchIndustry = industry === "All" || f.industry.toLowerCase().includes(industry.toLowerCase());
    const matchStage = stage === "All Stages" || f.stage.toLowerCase().includes(stage.toLowerCase());
    const matchLocation = location === "All Locations" || 
      f.location.toLowerCase().includes(location.toLowerCase()) ||
      (location === "United States" && (f.location.toLowerCase().includes("usa") || f.location.toLowerCase().includes("united states") || f.location.toLowerCase().includes("san francisco") || f.location.toLowerCase().includes("new york"))) ||
      (location === "United Kingdom" && (f.location.toLowerCase().includes("uk") || f.location.toLowerCase().includes("united kingdom") || f.location.toLowerCase().includes("london"))) ||
      (location === "Pakistan" && (f.location.toLowerCase().includes("pakistan") || f.location.toLowerCase().includes("karachi") || f.location.toLowerCase().includes("lahore") || f.location.toLowerCase().includes("islamabad")));
    
    return matchSearch && matchIndustry && matchStage && matchLocation;
  });

  const hasActiveFilters = search || industry !== "All" || stage !== "All Stages" || location !== "All Locations";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }} className="fade-in">
      
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>Explore Founders</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
            Connect with over {foundersList.length}+ elite verified founders in our directory
          </p>
        </div>
        {loading && (
          <Loader2 className="animate-spin text-emerald-600" color="var(--primary)" size={20} />
        )}
      </div>

      {/* Filter panel */}
      <div className="card filter-card" style={{ padding: "16px 20px" }}>
        <div className="filters-wrapper">
          {/* Search */}
          <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
            <Search size={15} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input 
              className="input-field" 
              placeholder="Search name, startup, keywords..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              style={{ paddingLeft: 38, height: 42, fontSize: 13, background: "var(--bg-soft)", border: "1px solid var(--border)", width: "100%" }} 
            />
          </div>

          {/* Industry select */}
          <div className="select-container">
            <select 
              className="input-field select-field" 
              value={industry} 
              onChange={e => setIndustry(e.target.value)}
              style={{ height: 42, fontSize: 13, width: "100%" }}
            >
              <option value="All">All Industries</option>
              {industries.slice(1).map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          {/* Stage select */}
          <div className="select-container">
            <select 
              className="input-field select-field" 
              value={stage} 
              onChange={e => setStage(e.target.value)}
              style={{ height: 42, fontSize: 13, width: "100%" }}
            >
              <option value="All Stages">All Stages</option>
              {stages.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Location select */}
          <div className="select-container">
            <select 
              className="input-field select-field" 
              value={location} 
              onChange={e => setLocation(e.target.value)}
              style={{ height: 42, fontSize: 13, width: "100%" }}
            >
              <option value="All Locations">All Locations</option>
              {locations.slice(1).map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
        </div>

        {/* Quick industry pills */}
        <div className="pills-scroll-container">
          {industries.map(i => (
            <button 
              key={i} 
              onClick={() => setIndustry(i)} 
              className={`industry-pill-btn ${industry === i ? "active" : ""}`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 550 }}>
          Showing <strong style={{ color: "var(--text)" }}>{filtered.length}</strong> founders
        </div>
        {hasActiveFilters && (
          <button 
            onClick={() => {
              setSearch("");
              setIndustry("All");
              setStage("All Stages");
              setLocation("All Locations");
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Compact Founder Grid */}
      <div className="compact-founders-grid">
        {filtered.map((f, i) => (
          <div key={i} className="founder-compact-card">
            <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
              
              {/* Circular Avatar / Base64 photo handler */}
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
                onClick={() => setSaved(saved.includes(i) ? saved.filter(s => s !== i) : [...saved, i])}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
              >
                <Bookmark size={15} color={saved.includes(i) ? "var(--primary)" : "var(--text-muted)"} fill={saved.includes(i) ? "var(--primary)" : "none"} />
              </button>
            </div>

            <p className="card-bio-short">{f.bio}</p>

            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
              {f.tags.slice(0, 3).map((tag, j) => (
                <span key={j} className="green-tag" style={{ fontSize: 10, padding: "2px 8px" }}>{tag}</span>
              ))}
            </div>

            <div className="card-bottom-actions">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Star size={11} color="#f59e0b" fill="#f59e0b" />
                <span style={{ fontSize: 11, fontWeight: 700 }}>{f.rating}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>({f.meetings} calls)</span>
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

      <style>{`
        .filters-wrapper {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .select-container {
          width: 160px;
        }
        .pills-scroll-container {
          display: flex;
          gap: 8px;
          margin-top: 14px;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 4px;
        }
        .pills-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .industry-pill-btn {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--bg-soft);
          color: var(--text-secondary);
          border: 1px solid var(--border);
          white-space: nowrap;
          font-family: inherit;
        }
        .industry-pill-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .industry-pill-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 2px 8px rgba(15,110,86,0.15);
        }

        .compact-founders-grid {
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

        @media (max-width: 600px) {
          .select-container {
            width: 100%;
          }
          .filters-wrapper {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
