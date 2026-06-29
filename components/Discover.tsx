"use client";
import { useState, useEffect } from "react";
import { 
  Search, TrendingUp, Star, Zap, ArrowRight, Eye, 
  MessageSquare, Bookmark, ChevronRight, CheckCircle, 
  MapPin, Bot, CreditCard, Activity, BookOpen, Settings, Link as LinkIcon, Loader2
} from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";

const featured = [
  { 
    name: "Aisha Malik", role: "CEO & Co-founder", company: "NovaTech AI", 
    tags: ["AI/ML", "SaaS"], stage: "Series A", location: "San Francisco",
    avatar: "AM", rating: 4.9, meetings: 32, views: 284, available: true, verified: true,
    bio: "Built and scaled 2 AI startups. Ex-Google. Passionate about helping founders navigate product-market fit."
  },
  { 
    name: "Carlos Rivera", role: "Founder", company: "GreenPay", 
    tags: ["FinTech", "Scaling"], stage: "Seed", location: "New York",
    avatar: "CR", rating: 4.8, meetings: 18, views: 197, available: true, verified: true,
    bio: "Fintech entrepreneur with 8 years experience. Raised $2M seed round. Love helping first-time founders."
  },
  { 
    name: "Sam Osei", role: "Founder", company: "HealthSync", 
    tags: ["HealthTech", "B2C"], stage: "Series A", location: "Nairobi",
    avatar: "SO", rating: 4.7, meetings: 45, views: 312, available: true, verified: true,
    bio: "Healthcare innovator focusing on telemedicine in emerging markets. Looking for strategic partnerships."
  },
  { 
    name: "Lena Müller", role: "CEO", company: "ClimateOps", 
    tags: ["ClimaTech", "B2B"], stage: "Seed", location: "Berlin",
    avatar: "LM", rating: 4.6, meetings: 12, views: 156, available: false, verified: true,
    bio: "Decarbonizing supply chains using blockchain. Former consultant with a mission to save the planet."
  },
  { 
    name: "David Kim", role: "Co-founder", company: "CryptoEdge", 
    tags: ["Web3", "DeFi"], stage: "Pre-seed", location: "Singapore",
    avatar: "DK", rating: 4.5, meetings: 8, views: 124, available: true, verified: false,
    bio: "Building the next generation of decentralized exchanges. Deep background in quantitative trading."
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

export default function Discover() {
  const [userName, setUserName] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();
          if (profile?.full_name) {
            setUserName(profile.full_name.split(" ")[0]);
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setProfileLoading(false);
      }
    }
    loadProfile();
  }, [supabase]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Hero banner */}
      <div className="fade-in" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1ab38a 100%)", borderRadius: 20, padding: "36px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -60, right: 80, width: 160, height: 160, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px", marginBottom: 16 }}>
            <Zap size={12} color="white" fill="white" />
            <span style={{ fontSize: 12, color: "white", fontWeight: 600 }}>518 verified founders live</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "white", letterSpacing: "-0.5px", marginBottom: 12, lineHeight: 1.2 }}>
            {getGreeting()}, {profileLoading ? "..." : userName || "there"} 👋
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", marginBottom: 28, maxWidth: 460, lineHeight: 1.6 }}>
            Skip the guesswork. Meet verified startup founders for real advice, mentorship, and strategic connections.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, maxWidth: 400, position: "relative" }}>
              <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input className="input-field" placeholder="Search by name, skill, or industry..." style={{ paddingLeft: 40, height: 48, background: "rgba(255,255,255,0.98)" }} />
            </div>
            <button className="btn-primary" style={{ background: "white", color: "var(--primary)", flexShrink: 0, height: 48, padding: "0 24px" }}>Search</button>
          </div>
        </div>
      </div>

      {/* Featured founders - Horizontal Scroll */}
      <div className="fade-in fade-in-1">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)" }}>Top Recommended</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 2 }}>Hand-picked founders for your current stage</p>
          </div>
          <button style={{ fontSize: 14, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            View all <ChevronRight size={16} />
          </button>
        </div>
        
        <div style={{ 
          display: "flex", 
          gap: 20, 
          overflowX: "auto", 
          paddingBottom: 20,
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}>
          {featured.map((f, i) => (
            <div key={i} className="founder-card" style={{ 
              minWidth: 400, 
              padding: 24,
              scrollSnapAlign: "start",
              flexShrink: 0
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                <div style={{ position: "relative" }}>
                  <div className="avatar" style={{ width: 56, height: 56, fontSize: 18 }}>{f.avatar}</div>
                  {f.available && <div style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, background: "var(--primary)", borderRadius: "50%", border: "2px solid white" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>{f.name}</span>
                    {f.verified && <CheckCircle size={15} color="var(--primary)" fill="var(--primary-xlight)" />}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{f.role} @ {f.company}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                    <MapPin size={12} color="var(--text-muted)" />
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{f.location}</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 4 }}>·</span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{f.stage}</span>
                  </div>
                </div>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                  <Bookmark size={18} />
                </button>
              </div>

              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16, height: 40, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{f.bio}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {f.tags.map((tag, j) => (
                  <span key={j} className="green-tag" style={{ fontSize: 11, padding: "4px 12px" }}>{tag}</span>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid var(--border)", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Star size={13} color="#f59e0b" fill="#f59e0b" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{f.rating}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Eye size={13} color="var(--text-muted)" />
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{f.views} views</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <MessageSquare size={13} color="var(--text-muted)" />
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{f.meetings} meetings</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-outline" style={{ flex: 1, justifyContent: "center", height: 40 }}>
                  <Eye size={14} />View Profile
                </button>
                <button className="btn-primary" style={{ flex: 1, justifyContent: "center", height: 40 }}>
                  <MessageSquare size={14} />Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="fade-in fade-in-2">
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>Explore by Industry</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {categories.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "#fff", borderRadius: 12, cursor: "pointer", border: "1px solid var(--border)", transition: "all 0.2s shadow-sm" }} className="card-hover">
                <div style={{ width: 40, height: 40, background: "var(--primary-50)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{c.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{c.count} founders</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
