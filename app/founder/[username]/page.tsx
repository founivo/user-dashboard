"use client";
import React, { useState, useEffect, use } from "react";
import { 
  ArrowLeft, MapPin, CheckCircle, Star, Mail, Globe, 
  Copy, Check, Loader2, Clock, Calendar, CheckCircle2, 
  ExternalLink, ChevronRight, MessageSquare, AlertCircle, Briefcase, Building, Sparkles, User
} from "lucide-react";
import Link from "next/link";
import { DashboardFounder } from "@/app/lib/googleSheets";
import { createClient } from "@/app/utils/supabase/client";

// Helper to generate URL-friendly slugs/usernames from name
function getSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Inline SVG Logos for real-brand official colors
const LinkedInLogo = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2" style={{ flexShrink: 0 }}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const TwitterXLogo = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#000000" style={{ flexShrink: 0 }}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GitHubLogo = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#24292F" style={{ flexShrink: 0 }}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const GlobeLogo = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// Define structure for our rich profile metadata
interface ProfileMetadata {
  personal_photo?: string;
  startup_logo?: string;
  fees_30m?: string;
  fees_1h?: string;
  fees_custom_min?: string;
  fees_custom_val?: string;
  skills?: string[];
  
  // Startup profile specific
  startup_name?: string;
  startup_role?: string;
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

const INITIAL_MOCK_FOUNDERS: DashboardFounder[] = [
  { name: "Aisha Malik", role: "CEO & Co-founder", company: "NovaTech AI", industry: "AI/ML", stage: "Series A", location: "San Francisco", tags: ["AI/ML", "SaaS", "B2B"], avatar: "AM", rating: 4.9, views: 284, meetings: 32, available: true, verified: true, bio: "Built and scaled 2 AI startups. Ex-Google. Passionate about helping founders navigate product-market fit.", email: "aisha@novatech.io", linkedin: "https://linkedin.com/in/aishamalik", companywebsite: "https://novatech.io" },
  { name: "Carlos Rivera", role: "Founder", company: "GreenPay", industry: "FinTech", stage: "Seed", location: "New York", tags: ["FinTech", "Payments", "Scaling"], avatar: "CR", rating: 4.8, views: 197, meetings: 18, available: true, verified: true, bio: "Fintech entrepreneur with 8 years experience. Raised $2M seed round. Love helping first-time founders.", email: "carlos@greenpay.co", linkedin: "https://linkedin.com/in/carlosrivera", companywebsite: "https://greenpay.co" },
  { name: "Priya Nair", role: "Co-founder & CTO", company: "EduBridge", industry: "EdTech", stage: "Pre-seed", location: "London", tags: ["EdTech", "B2C", "Tech"], avatar: "PN", rating: 5.0, views: 341, meetings: 41, available: false, verified: true, bio: "Technical co-founder turned CEO. MIT grad. Passionate about accessible education and early-stage tech.", email: "priya@edubridge.io", linkedin: "https://linkedin.com/in/priyanair", companywebsite: "https://edubridge.io" },
  { name: "Sam Osei", role: "Founder", company: "HealthSync", industry: "HealthTech", stage: "Series A", location: "Nairobi", tags: ["HealthTech", "Africa", "Impact"], avatar: "SO", rating: 4.7, views: 156, meetings: 24, available: true, verified: true, bio: "Health tech founder operating across East Africa. 3x exits. Mentor at Techstars Africa.", email: "sam@healthsync.co", linkedin: "https://linkedin.com/in/samosei", companywebsite: "https://healthsync.co" },
  { name: "Lena Müller", role: "CEO", company: "ClimateOps", industry: "ClimaTech", stage: "Seed", location: "Berlin", tags: ["ClimaTech", "B2B"], avatar: "LM", rating: 4.6, views: 122, meetings: 15, available: true, verified: false, bio: "Climate tech CEO building carbon management tools for enterprise. YC S22 alumni.", email: "lena@climateops.de", linkedin: "https://linkedin.com/in/lenamuller", companywebsite: "https://climateops.de" },
  { name: "David Kim", role: "Co-founder", company: "CryptoEdge", industry: "Web3", stage: "Pre-seed", location: "Singapore", tags: ["Web3", "DeFi"], avatar: "DK", rating: 4.5, views: 98, meetings: 11, available: false, verified: true, bio: "Web3 builder since 2017. Co-founded 3 blockchain protocols. Deep expertise in DeFi and tokenomics.", email: "david@cryptoedge.io", linkedin: "https://linkedin.com/in/davidkim", companywebsite: "https://cryptoedge.io" },
];

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80";
const DEFAULT_LOGO = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&q=80";

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

interface PageProps {
  params: Promise<{ username: string }>;
}

export default function FounderProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const [founder, setFounder] = useState<DashboardFounder | null>(null);
  const [metadata, setMetadata] = useState<ProfileMetadata>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"personal" | "startup">("personal");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Scheduling states (Interactive Payout / Booking)
  const [selectedRate, setSelectedRate] = useState<{ label: string; price: string; minutes: string } | null>(null);
  const [bookingDate, setBookingDate] = useState<string | null>(null);
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<"select-rate" | "scheduling" | "success">("select-rate");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Pitch Deck Request state
  const [deckRequestSent, setDeckRequestSent] = useState(false);
  const [deckRequestLoading, setDeckRequestLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL;
    
    const loadData = async () => {
      setLoading(true);
      let list = INITIAL_MOCK_FOUNDERS;
      let matchedMetadata: ProfileMetadata = {};
      let finalFounder: DashboardFounder | null = null;

      try {
        // 1. Speculative query to Supabase founder_profiles
        const { data: dbFounders } = await supabase
          .from("founder_profiles")
          .select("*");
        
        if (dbFounders && dbFounders.length > 0) {
          const matchedDb = dbFounders.find(f => getSlug(f.full_name) === username);
          if (matchedDb) {
            const { bioText, metadata: parsed } = parseBioAndMetadata(matchedDb.bio || "");
            matchedMetadata = parsed;
            
            finalFounder = {
              name: matchedDb.full_name,
              role: matchedDb.role || "Founder",
              company: matchedDb.company || parsed.startup_name || "Stealth Startup",
              industry: parsed.startup_category || matchedDb.category || "AI / SaaS",
              stage: parsed.startup_stage || "Seed",
              location: parsed.startup_location || "Karachi, PK",
              tags: parsed.skills || ["Founder", "Tech Startup"],
              avatar: matchedDb.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
              rating: 4.9,
              views: 284,
              meetings: 14,
              available: true,
              verified: true,
              bio: bioText,
              email: "verified-contact@founivo.io",
              linkedin: matchedDb.linkedin || "",
              companywebsite: matchedDb.website || ""
            };
          }
        }
      } catch (err) {
        console.error("Database query failed, falling back to sheets:", err);
      }

      // 2. Fallback to Google Sheets/Mock Data if no Supabase profile matched
      if (!finalFounder) {
        if (sheetUrl) {
          try {
            const { fetchFoundersFromGoogleSheet } = await import("@/app/lib/googleSheets");
            const data = await fetchFoundersFromGoogleSheet(sheetUrl);
            if (data && data.length > 0) {
              list = data;
            }
          } catch (err) {
            console.error("Failed to load Google Sheet, falling back to mock data.", err);
          }
        }

        const found = list.find(f => getSlug(f.name) === username);
        if (found) {
          finalFounder = found;
          // Create simulated metadata from sheets data
          matchedMetadata = {
            personal_photo: DEFAULT_AVATAR,
            startup_logo: DEFAULT_LOGO,
            fees_30m: "30",
            fees_1h: "60",
            fees_custom_min: "20",
            fees_custom_val: "25",
            skills: found.tags,
            startup_name: found.company,
            startup_stage: found.stage,
            startup_category: found.industry,
            startup_location: found.location,
            startup_team_size: "5-10",
            startup_funding: "$500K",
            startup_bio: `${found.company} is building revolutionary technology in the ${found.industry} space. Serving customers globally.`,
            startup_website: found.companywebsite || "website.com",
            startup_linkedin: found.linkedin || "linkedin.com/company"
          };
        }
      }

      setFounder(finalFounder);
      setMetadata(matchedMetadata);
      setLoading(false);
    };

    loadData();
  }, [username]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleBookSession = () => {
    if (!bookingDate || !bookingTime) {
      alert("Please select a date and time slot.");
      return;
    }
    setBookingLoading(true);
    setTimeout(() => {
      setBookingLoading(false);
      setBookingStep("success");
    }, 1500);
  };

  const handleRequestDeck = () => {
    setDeckRequestLoading(true);
    setTimeout(() => {
      setDeckRequestLoading(false);
      setDeckRequestSent(true);
    }, 1200);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg-soft)", gap: 12 }}>
        <Loader2 className="animate-spin" color="var(--primary)" size={32} />
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)" }}>Resolving credentials...</span>
      </div>
    );
  }

  if (!founder) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg-soft)", padding: 24, textAlign: "center" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", marginBottom: 8, fontFamily: "'Syne', sans-serif" }}>Profile Not Found</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, maxWidth: 400, marginBottom: 24 }}>The founder profile you are looking for does not exist or has been removed from the directory.</p>
        <Link href="/" style={{ textDecoration: "none" }}>
          <button className="btn-primary" style={{ padding: "12px 24px" }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </Link>
      </div>
    );
  }

  // Generate next 5 dates for the calendar
  const getNextDays = () => {
    const days = [];
    const dateNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 1; i <= 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        dayName: dateNames[d.getDay()],
        dayNum: d.getDate(),
        month: monthNames[d.getMonth()],
        fullString: `${dateNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}`
      });
    }
    return days;
  };

  const nextDays = getNextDays();
  const timeSlots = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-soft)", padding: "40px 24px 80px" }}>
      
      {/* Scoped CSS styling for user dashboard profile */}
      <style>{`
        .profile-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          width: 100%;
        }
        @media (max-width: 992px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
        }
        .social-link-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 14px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          color: var(--text);
          font-weight: 500;
          font-size: 13.5px;
          cursor: pointer;
        }
        .social-link-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.04);
          border-color: rgba(15, 110, 86, 0.2);
        }
        .fee-card {
          padding: 22px;
          background: #ffffff;
          border: 1.5px solid var(--border);
          border-radius: 18px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }
        .fee-card:hover {
          border-color: var(--primary);
          box-shadow: 0 12px 30px -5px rgba(15, 110, 86, 0.12);
          transform: translateY(-3px);
        }
        .fee-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--primary);
          color: white;
          padding: 4px 12px;
          font-size: 9px;
          font-weight: 800;
          font-family: 'Syne', sans-serif;
          border-bottom-left-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .tab-btn {
          position: relative;
          padding: 16px 24px;
          font-size: 14px;
          font-weight: 800;
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'Syne', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .tab-btn:hover {
          color: var(--primary);
        }
        .tab-btn.active {
          color: var(--primary);
        }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3.5px;
          background: var(--primary);
          border-radius: 3px 3px 0 0;
        }
        .cover-banner {
          width: 100%; 
          height: 180px; 
          background: linear-gradient(135deg, var(--primary) 0%, #17a382 50%, #20c997 100%); 
          border-radius: 24px; 
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: 0 32px;
          box-shadow: 0 10px 30px -10px rgba(15, 110, 86, 0.25);
        }
        .date-pill {
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: #ffffff;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 68px;
          font-family: inherit;
        }
        .date-pill:hover {
          border-color: var(--primary);
          background: var(--primary-xlight);
        }
        .date-pill.active {
          border-color: var(--primary);
          background: var(--primary);
          color: white !important;
        }
        .time-pill {
          padding: 10px 16px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: #ffffff;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
        }
        .time-pill:hover {
          border-color: var(--primary);
          background: var(--primary-xlight);
        }
        .time-pill.active {
          border-color: var(--primary);
          background: var(--primary);
          color: white;
        }
        .btn-booking-primary {
          background: var(--primary);
          border: none;
          color: white;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 750;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Syne', sans-serif;
          width: 100%;
        }
        .btn-booking-primary:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(15,110,86,0.25);
        }
        .btn-deck-request {
          background: #ffffff;
          border: 1.5px solid var(--primary);
          color: var(--primary);
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Syne', sans-serif;
        }
        .btn-deck-request:hover {
          background: var(--primary-xlight);
        }
      `}</style>

      {/* Main Container */}
      <div style={{ maxWidth: 1160, margin: "0 auto" }} className="fade-in">
        
        {/* Back Link */}
        <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "var(--primary)", marginBottom: 24 }} className="hover-opacity">
          <ArrowLeft size={16} /> Back to Directory
        </Link>

        {/* Cover Banner Area */}
        <div className="cover-banner">
          <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: "radial-gradient(circle at 10% 20%, #fff 2px, transparent 2px), radial-gradient(circle at 85% 70%, #fff 3px, transparent 3px)", backgroundSize: "50px 50px", borderRadius: 24 }} />
          
          {/* Overlapping Identity Hub */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            borderRadius: 22,
            padding: "20px 32px",
            width: "calc(100% - 64px)",
            transform: "translateY(55px)",
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.01)",
            zIndex: 10
          }}>
            {/* Circular Image frame */}
            <div style={{ position: "relative", width: 104, height: 104, borderRadius: "50%", flexShrink: 0, border: "4px solid #ffffff", background: "#f8fafc", boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
              <img 
                src={activeTab === "personal" ? (metadata.personal_photo || DEFAULT_AVATAR) : (metadata.startup_logo || DEFAULT_LOGO)} 
                alt={founder.name}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
              />
            </div>

            {/* Name & Taglines */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.5px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {activeTab === "personal" ? founder.name : (metadata.startup_name || founder.company)}
                </h2>
                {founder.verified && <CheckCircle size={18} color="var(--primary)" fill="var(--primary-xlight)" style={{ flexShrink: 0 }} />}
              </div>
              
              {activeTab === "personal" ? (
                <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 6, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                  <Briefcase size={14} color="var(--primary)" />
                  {founder.role} @ <span style={{ fontWeight: 700, color: "var(--text)" }}>{metadata.startup_name || founder.company}</span>
                </p>
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 6, fontWeight: 500, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Building size={14} color="var(--primary)" /> {metadata.startup_stage || founder.stage}</span>
                  <span style={{ color: "var(--border)" }}>•</span>
                  <span>{metadata.startup_category || founder.industry}</span>
                </p>
              )}
            </div>

            {/* Available to Book Badge */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <span className="green-tag" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", height: 32, fontSize: 11, background: "var(--primary-xlight)", border: "1px solid var(--primary-100)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }}></span>
                Available for Calls
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Switcher Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: 12, paddingBottom: 0, marginTop: 110 }}>
          <button 
            className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === "startup" ? "active" : ""}`}
            onClick={() => setActiveTab("startup")}
          >
            Startup Profile
          </button>
        </div>

        {/* PROFILE MAIN GRID */}
        <div className="profile-grid" style={{ marginTop: 24 }}>
          
          {/* LEFT AREA: PRIMARY DETAILS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
            
            {/* 1. PERSONAL TAB */}
            {activeTab === "personal" && (
              <>
                {/* About Bio Card */}
                <div className="card">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 32, height: 32, background: "var(--primary-xlight)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User size={15} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>About Aisha</h3>
                  </div>
                  <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                    {founder.bio || "No biography added yet."}
                  </p>
                </div>

                {/* Consultation Booking Rates Cards */}
                <div className="card">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 32, height: 32, background: "var(--primary-xlight)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Clock size={15} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Consultation Slots</h3>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
                    Select an advisory session length below to open the scheduler and request a video slot.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                    
                    {/* Rate 1 */}
                    <div className="fee-card">
                      <div className="fee-badge">Popular</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                        <Clock size={14} color="var(--primary)" /> 30-Min session
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 2, margin: "4px 0" }}>
                        <span style={{ fontSize: 26, fontWeight: 800, color: "var(--primary)", fontFamily: "'Syne', sans-serif" }}>${metadata.fees_30m || "30"}</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>/ call</span>
                      </div>
                      <p style={{ fontSize: 11.5, color: "var(--text-muted)", minHeight: 34 }}>Quick check-in, advice on product-market fit, or networking.</p>
                      
                      <button 
                        className="card-btn-primary" 
                        style={{ width: "100%", height: 36, marginTop: 8 }}
                        onClick={() => {
                          setSelectedRate({ label: "30-Minute Consultation", price: metadata.fees_30m || "30", minutes: "30" });
                          setBookingStep("scheduling");
                        }}
                      >
                        Book Session
                      </button>
                    </div>

                    {/* Rate 2 */}
                    <div className="fee-card">
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                        <Clock size={14} color="var(--primary)" /> 1-Hour Session
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 2, margin: "4px 0" }}>
                        <span style={{ fontSize: 26, fontWeight: 800, color: "var(--primary)", fontFamily: "'Syne', sans-serif" }}>${metadata.fees_1h || "60"}</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>/ call</span>
                      </div>
                      <p style={{ fontSize: 11.5, color: "var(--text-muted)", minHeight: 34 }}>Detailed business review, pitch deck feedback, or architecture setup.</p>
                      
                      <button 
                        className="card-btn-primary" 
                        style={{ width: "100%", height: 36, marginTop: 8 }}
                        onClick={() => {
                          setSelectedRate({ label: "1-Hour Strategic Session", price: metadata.fees_1h || "60", minutes: "60" });
                          setBookingStep("scheduling");
                        }}
                      >
                        Book Session
                      </button>
                    </div>

                    {/* Rate 3 */}
                    <div className="fee-card">
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                        <Clock size={14} color="var(--primary)" /> {metadata.fees_custom_min || "20"}-Min Custom
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 2, margin: "4px 0" }}>
                        <span style={{ fontSize: 26, fontWeight: 800, color: "var(--primary)", fontFamily: "'Syne', sans-serif" }}>${metadata.fees_custom_val || "25"}</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>/ call</span>
                      </div>
                      <p style={{ fontSize: 11.5, color: "var(--text-muted)", minHeight: 34 }}>Custom duration slot set by founder for specific booking demands.</p>
                      
                      <button 
                        className="card-btn-primary" 
                        style={{ width: "100%", height: 36, marginTop: 8 }}
                        onClick={() => {
                          setSelectedRate({ label: `${metadata.fees_custom_min || "20"}-Minute Consultation`, price: metadata.fees_custom_val || "25", minutes: metadata.fees_custom_min || "20" });
                          setBookingStep("scheduling");
                        }}
                      >
                        Book Session
                      </button>
                    </div>

                  </div>
                </div>

                {/* Skills Card */}
                <div className="card">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 32, height: 32, background: "var(--primary-xlight)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Star size={15} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Areas of Expertise</h3>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {(metadata.skills || founder.tags).map((skill, i) => (
                      <span key={i} className="green-tag" style={{ fontSize: 11.5, padding: "5px 14px", fontWeight: 600 }}>{skill}</span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 2. STARTUP TAB */}
            {activeTab === "startup" && (
              <>
                {/* Startup Description */}
                <div className="card">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 32, height: 32, background: "var(--primary-xlight)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Building size={15} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Startup Core Vision</h3>
                  </div>
                  <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                    {metadata.startup_bio || `${metadata.startup_name || founder.company} is building revolutionary solutions. Focuses on innovation and high scale.`}
                  </p>
                  
                  {/* Pitch Deck action */}
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 24, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text)" }}>Company Pitch Deck</div>
                      <p style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>Request investor presentation slides for review.</p>
                    </div>
                    <div style={{ marginLeft: "auto" }}>
                      {deckRequestSent ? (
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: 6 }}>
                          <CheckCircle2 size={16} /> Request Sent!
                        </span>
                      ) : (
                        <button 
                          className="btn-deck-request" 
                          onClick={handleRequestDeck}
                          disabled={deckRequestLoading}
                        >
                          {deckRequestLoading ? (
                            <><Loader2 className="animate-spin" size={14} /> Requesting...</>
                          ) : (
                            <><Mail size={14} /> Request Deck</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Startup Details Grid */}
                <div className="card">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 32, height: 32, background: "var(--primary-xlight)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Building size={15} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Business Snapshot</h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
                    {[
                      { label: "Startup Name", value: metadata.startup_name || founder.company },
                      { label: "Founder Role", value: metadata.startup_role || founder.role },
                      { label: "Funding Stage", value: metadata.startup_stage || founder.stage },
                      { label: "Industry Category", value: metadata.startup_category || founder.industry },
                      { label: "Headquarters", value: metadata.startup_location || founder.location },
                      { label: "Team Size", value: metadata.startup_team_size || "5-10" },
                      { label: "Total Funding", value: metadata.startup_funding || "$1M+" },
                    ].map((f, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</span>
                        <span style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text)" }}>{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* INTERACTIVE CALENDAR SCHEDULER WIDGET */}
            {bookingStep !== "select-rate" && (
              <div className="card fade-in" style={{ border: "1.5px solid var(--primary)", boxShadow: "0 10px 30px rgba(15, 110, 86, 0.08)" }}>
                
                {bookingStep === "scheduling" ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20 }}>
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>Schedule Consultation</h3>
                        <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
                          Booking: <strong style={{ color: "var(--primary)" }}>{selectedRate?.label} (${selectedRate?.price})</strong>
                        </p>
                      </div>
                      <button 
                        onClick={() => setBookingStep("select-rate")}
                        style={{ background: "none", border: "none", fontSize: 11.5, fontWeight: 750, color: "var(--text-muted)", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Step 1: Select Date */}
                    <div style={{ marginBottom: 20 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text)", textTransform: "uppercase", display: "block", marginBottom: 10, letterSpacing: "0.03em" }}>1. Select Meeting Date</span>
                      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                        {nextDays.map((d, i) => (
                          <div 
                            key={i} 
                            className={`date-pill ${bookingDate === d.fullString ? "active" : ""}`}
                            onClick={() => setBookingDate(d.fullString)}
                          >
                            <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, color: bookingDate === d.fullString ? "white" : "inherit" }}>{d.dayName}</span>
                            <span style={{ fontSize: 16, fontWeight: 800 }}>{d.dayNum}</span>
                            <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.7 }}>{d.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Select Time */}
                    <div style={{ marginBottom: 24 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text)", textTransform: "uppercase", display: "block", marginBottom: 10, letterSpacing: "0.03em" }}>2. Select Available Slot (PKT)</span>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {timeSlots.map((time, i) => (
                          <button 
                            key={i}
                            className={`time-pill ${bookingTime === time ? "active" : ""}`}
                            onClick={() => setBookingTime(time)}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit checkout */}
                    <button 
                      className="btn-booking-primary"
                      onClick={handleBookSession}
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? (
                        <><Loader2 className="animate-spin" size={16} /> Verifying Secure Checkout...</>
                      ) : (
                        <><Calendar size={16} /> Confirm Booking & Request Session</>
                      )}
                    </button>
                  </>
                ) : (
                  
                  /* Booking success state */
                  <div style={{ textAlign: "center", padding: "20px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 56, height: 56, background: "var(--primary-soft)", borderRadius: "50%", display: "flex", alignItems: "center", justify: "center", color: "var(--primary)" } as any} className="justify-center items-center">
                      <CheckCircle2 size={36} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>Consultation Requested!</h3>
                      <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, maxWidth: 360, lineHeight: 1.5 }}>
                        Your calendar request has been forwarded to <strong>{founder.name}</strong>. You will receive an email invite containing the video room link as soon as they confirm!
                      </p>
                    </div>
                    <div style={{ background: "var(--bg-soft)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", width: "100%", maxWidth: 340, textAlign: "left" }}>
                      <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>SESSION SUMMARY</div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, marginTop: 4, color: "var(--text)" }}>{selectedRate?.label} ({selectedRate?.minutes}m)</div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{bookingDate} at {bookingTime}</div>
                    </div>
                    <button 
                      className="btn-ghost" 
                      style={{ height: 38, padding: "0 20px", fontSize: 12.5 }}
                      onClick={() => {
                        setBookingStep("select-rate");
                        setSelectedRate(null);
                        setBookingDate(null);
                        setBookingTime(null);
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT AREA: SIDEBAR CONTACT DETAILS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* SOCIAL / CONNECTIONS CARD */}
            <div className="card">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
                {activeTab === "personal" ? "Founder Connections" : "Startup Links"}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {activeTab === "personal" ? (
                  /* Personal Links with authentic colors */
                  <>
                    {metadata.startup_linkedin || founder.linkedin ? (
                      <a 
                        href={(metadata.startup_linkedin || founder.linkedin).startsWith("http") ? (metadata.startup_linkedin || founder.linkedin) : `https://${metadata.startup_linkedin || founder.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link-item"
                      >
                        <div className="social-logo-container">
                          <LinkedInLogo size={16} />
                        </div>
                        <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>LinkedIn Profile</span>
                        <ExternalLink size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      </a>
                    ) : (
                      <div style={{ color: "var(--text-muted)", fontSize: 12.5, fontStyle: "italic", padding: "10px 12px" }}>No LinkedIn profile listed.</div>
                    )}

                    {metadata.startup_twitter ? (
                      <a 
                        href={`https://twitter.com/${metadata.startup_twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link-item"
                      >
                        <div className="social-logo-container">
                          <TwitterXLogo size={14} />
                        </div>
                        <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>Twitter / X Profile</span>
                        <ExternalLink size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      </a>
                    ) : null}

                    {metadata.startup_website || founder.companywebsite ? (
                      <a 
                        href={(metadata.startup_website || founder.companywebsite).startsWith("http") ? (metadata.startup_website || founder.companywebsite) : `https://${metadata.startup_website || founder.companywebsite}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link-item"
                      >
                        <div className="social-logo-container">
                          <GlobeLogo size={16} />
                        </div>
                        <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>Personal Portfolio</span>
                        <ExternalLink size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      </a>
                    ) : null}
                  </>
                ) : (
                  /* Startup Links */
                  <>
                    {metadata.startup_website || founder.companywebsite ? (
                      <a 
                        href={(metadata.startup_website || founder.companywebsite).startsWith("http") ? (metadata.startup_website || founder.companywebsite) : `https://${metadata.startup_website || founder.companywebsite}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link-item"
                      >
                        <div className="social-logo-container">
                          <GlobeLogo size={16} />
                        </div>
                        <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>Company Website</span>
                        <ExternalLink size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      </a>
                    ) : (
                      <div style={{ color: "var(--text-muted)", fontSize: 12.5, fontStyle: "italic", padding: "10px 12px" }}>No startup website listed.</div>
                    )}

                    {metadata.startup_linkedin ? (
                      <a 
                        href={(metadata.startup_linkedin).startsWith("http") ? (metadata.startup_linkedin) : `https://${metadata.startup_linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link-item"
                      >
                        <div className="social-logo-container">
                          <LinkedInLogo size={16} />
                        </div>
                        <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>Company LinkedIn</span>
                        <ExternalLink size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      </a>
                    ) : null}
                  </>
                )}
              </div>
            </div>

            {/* DIRECT CONTACT PANEL */}
            <div className="card">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Verified Contacts</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                
                {/* Email row */}
                <div style={{ padding: "12px 14px", background: "var(--bg-soft)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                  <Mail size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Email Address</div>
                    <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", marginTop: 2 }}>
                      {founder.email || "aisha@novatech.io"}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCopy(founder.email || "aisha@novatech.io", 'email')}
                    style={{ background: "none", border: "none", color: "var(--primary)", fontSize: 11, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}
                  >
                    {copiedText === 'email' ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                {/* Rating views summary */}
                <div style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--text-secondary)" }}>
                    <span>Rating Score:</span>
                    <strong style={{ color: "var(--text)" }}>★ {founder.rating} ({founder.meetings} bookings)</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--text-secondary)" }}>
                    <span>Profile Views:</span>
                    <strong style={{ color: "var(--text)" }}>{founder.views}</strong>
                  </div>
                </div>

              </div>
            </div>

            {/* CHAT CALLOUT / DIRECT MESSAGE */}
            <div className="card" style={{ border: "1.5px dashed rgba(15, 110, 86, 0.3)", background: "rgba(15, 110, 86, 0.01)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "start" }}>
                <MessageSquare size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ fontSize: 13.5, fontWeight: 700, color: "var(--primary)" }}>Direct Messaging</h4>
                  <p style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5 }}>
                    Investors or founders who have booked a call can chat with {founder.name} directly via Founivo Messages.
                  </p>
                  <Link href="/messages" style={{ textDecoration: "none" }}>
                    <button className="btn-booking-primary" style={{ height: 32, padding: "0 14px", fontSize: 11.5, marginTop: 12, borderRadius: 8 }}>
                      Send Message
                    </button>
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
