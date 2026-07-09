"use client";
import React, { useState, useEffect, use, useRef } from "react";
import { 
  ArrowLeft, MapPin, CheckCircle, Star, Mail, Globe, Eye, 
  Copy, Check, Loader2, Clock, Calendar, CheckCircle2, 
  ExternalLink, ChevronRight, MessageSquare, AlertCircle, Briefcase, Building, Sparkles, User,
  Menu, X, Camera, Plus, Trash2
} from "lucide-react";
import Link from "next/link";
import { DashboardFounder } from "@/app/lib/googleSheets";
import { createClient } from "@/app/utils/supabase/client";
import Sidebar from "../../../components/Sidebar";

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

// Theme structures to load correctly on dynamic routes
const themes: Record<string, Record<string, string>> = {
  emerald: { primary: '#0F6E56', dark: '#0a5441', light: '#12856a', xlight: '#e6f4f1', p50: '#f0faf7', p100: '#d1ede6', p200: '#a3dbcd' },
  blue: { primary: '#2563EB', dark: '#1D4ED8', light: '#3B82F6', xlight: '#EFF6FF', p50: '#F8FAFC', p100: '#DBEAFE', p200: '#BFDBFE' },
  violet: { primary: '#7C3AED', dark: '#6D28D9', light: '#8B5CF6', xlight: '#F5F3FF', p50: '#FAFAFA', p100: '#EDE9FE', p200: '#DDD6FE' },
  rose: { primary: '#E11D48', dark: '#BE123C', light: '#F43F5E', xlight: '#FFF1F2', p50: '#FFF5F5', p100: '#FFE4E6', p200: '#FECDD3' },
  orange: { primary: '#EA580C', dark: '#C2410C', light: '#F97316', xlight: '#FFF7ED', p50: '#FAFAF9', p100: '#FFEDD5', p200: '#FED7AA' },
  teal: { primary: '#0D9488', dark: '#0F766E', light: '#14B8A6', xlight: '#F0FDFA', p50: '#F4FAF8', p100: '#CCFBF1', p200: '#99F6E4' },
  indigo: { primary: '#4F46E5', dark: '#4338CA', light: '#6366F1', xlight: '#EEF2FF', p50: '#FAFAFE', p100: '#E0E7FF', p200: '#C7D2FE' }
};

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80";
const DEFAULT_LOGO = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&q=80";

const INITIAL_MOCK_FOUNDERS: DashboardFounder[] = [
  { name: "Aisha Malik", role: "CEO & Co-founder", company: "NovaTech AI", industry: "AI/ML", stage: "Series A", location: "San Francisco", tags: ["AI/ML", "SaaS", "B2B"], avatar: "AM", rating: 4.9, views: 284, meetings: 32, available: true, verified: true, bio: "Built and scaled 2 AI startups. Ex-Google. Passionate about helping founders navigate product-market fit.", email: "aisha@novatech.io", linkedin: "https://linkedin.com/in/aishamalik", companywebsite: "https://novatech.io" },
  { name: "Carlos Rivera", role: "Founder", company: "GreenPay", industry: "FinTech", stage: "Seed", location: "New York", tags: ["FinTech", "Payments", "Scaling"], avatar: "CR", rating: 4.8, views: 197, meetings: 18, available: true, verified: true, bio: "Fintech entrepreneur with 8 years experience. Raised $2M seed round. Love helping first-time founders.", email: "carlos@greenpay.co", linkedin: "https://linkedin.com/in/carlosrivera", companywebsite: "https://greenpay.co" },
  { name: "Priya Nair", role: "Co-founder & CTO", company: "EduBridge", industry: "EdTech", stage: "Pre-seed", location: "London", tags: ["EdTech", "B2C", "Tech"], avatar: "PN", rating: 5.0, views: 341, meetings: 41, available: false, verified: true, bio: "Technical co-founder turned CEO. MIT grad. Passionate about accessible education and early-stage tech.", email: "priya@edubridge.io", linkedin: "https://linkedin.com/in/priyanair", companywebsite: "https://edubridge.io" },
  { name: "Sam Osei", role: "Founder", company: "HealthSync", industry: "HealthTech", stage: "Series A", location: "Nairobi", tags: ["HealthTech", "Africa", "Impact"], avatar: "SO", rating: 4.7, views: 156, meetings: 24, available: true, verified: true, bio: "Health tech founder operating across East Africa. 3x exits. Mentor at Techstars Africa.", email: "sam@healthsync.co", linkedin: "https://linkedin.com/in/samosei", companywebsite: "https://healthsync.co" },
  { name: "Lena Müller", role: "CEO", company: "ClimateOps", industry: "ClimaTech", stage: "Seed", location: "Berlin", tags: ["ClimaTech", "B2B"], avatar: "LM", rating: 4.6, views: 122, meetings: 15, available: true, verified: false, bio: "Climate tech CEO building carbon management tools for enterprise. YC S22 alumni.", email: "lena@climateops.de", linkedin: "https://linkedin.com/in/lenamuller", companywebsite: "https://climateops.de" },
  { name: "David Kim", role: "Co-founder", company: "CryptoEdge", industry: "Web3", stage: "Pre-seed", location: "Singapore", tags: ["Web3", "DeFi"], avatar: "DK", rating: 4.5, views: 98, meetings: 11, available: false, verified: true, bio: "Web3 builder since 2017. Co-founded 3 blockchain protocols. Deep expertise in DeFi and tokenomics.", email: "david@cryptoedge.io", linkedin: "https://linkedin.com/in/davidkim", companywebsite: "https://cryptoedge.io" },
];

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

const serializeBioAndMetadata = (bio: string, metadata: ProfileMetadata): string => {
  const marker = "\n\n---METADATA---\n";
  return bio.split(marker)[0] + marker + JSON.stringify(metadata);
};

interface ProfileMetadata {
  personal_photo?: string;
  startup_logo?: string;
  fees_30m?: string;
  fees_1h?: string;
  fees_custom_min?: string;
  fees_custom_val?: string;
  skills?: string[];
  
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

interface FounderPageProps {
  params: Promise<{ username: string }>;
}

export default function FounderProfilePage({ params }: FounderPageProps) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const [founder, setFounder] = useState<DashboardFounder | null>(null);
  const [metadata, setMetadata] = useState<ProfileMetadata>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"personal" | "startup">("personal");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Edit / Save states
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [founderId, setFounderId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // File Upload references
  const personalFileRef = useRef<HTMLInputElement>(null);
  const startupFileRef = useRef<HTMLInputElement>(null);

  // Editable Personal Profile fields
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");
  const [personalPhoto, setPersonalPhoto] = useState(DEFAULT_AVATAR);
  const [skills, setSkills] = useState<string[]>([]);
  const [fees30m, setFees30m] = useState("30");
  const [fees1h, setFees1h] = useState("60");
  const [feesCustomMin, setFeesCustomMin] = useState("20");
  const [feesCustomVal, setFeesCustomVal] = useState("25");

  // Personal socials
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");

  // Editable Startup Profile fields
  const [startupName, setStartupName] = useState("");
  const [startupRole, setStartupRole] = useState("");
  const [startupStage, setStartupStage] = useState("");
  const [startupCategory, setStartupCategory] = useState("");
  const [startupLocation, setStartupLocation] = useState("");
  const [startupTeamSize, setStartupTeamSize] = useState("");
  const [startupFunding, setStartupFunding] = useState("");
  const [startupBio, setStartupBio] = useState("");
  const [startupLogo, setStartupLogo] = useState(DEFAULT_LOGO);
  
  // Startup socials
  const [startupLinkedin, setStartupLinkedin] = useState("");
  const [startupTwitter, setStartupTwitter] = useState("");
  const [startupWebsite, setStartupWebsite] = useState("");

  const [newSkillText, setNewSkillText] = useState("");

  // Layout states for Sidebar + Header sync
  const [userProfile, setUserProfile] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("founivo-dashboard-theme");
    if (savedTheme && themes[savedTheme]) {
      const colors = themes[savedTheme];
      Object.entries(colors).forEach(([key, val]) => {
        const cssKey = key === 'primary' ? '--primary' : `--primary-${key}`;
        document.documentElement.style.setProperty(cssKey, val);
      });
    }
  }, []);

  // Fetch logged in user details for sidebar
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          setUserProfile(profileData);
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      }
    }
    loadUserProfile();
  }, []);

  // Fetch target founder profile data
  useEffect(() => {
    const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL;
    
    const loadData = async () => {
      setLoading(true);
      let list = INITIAL_MOCK_FOUNDERS;
      let matchedMetadata: ProfileMetadata = {};
      let finalFounder: DashboardFounder | null = null;

      try {
        const { data: dbFounders } = await supabase
          .from("founder_profiles")
          .select("*");
        
        if (dbFounders && dbFounders.length > 0) {
          const matchedDb = dbFounders.find((f: any) => getSlug(f.full_name) === username);
          if (matchedDb) {
            setFounderId(matchedDb.id);
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

      if (finalFounder) {
        setFounder(finalFounder);
        setMetadata(matchedMetadata);

        // Pre-populate states for editing
        setName(finalFounder.name);
        setBio(finalFounder.bio || "");
        setRole(finalFounder.role || "Founder");
        setPersonalPhoto(matchedMetadata.personal_photo || DEFAULT_AVATAR);
        setSkills(matchedMetadata.skills || finalFounder.tags || []);
        
        setFees30m(matchedMetadata.fees_30m || "30");
        setFees1h(matchedMetadata.fees_1h || "60");
        setFeesCustomMin(matchedMetadata.fees_custom_min || "20");
        setFeesCustomVal(matchedMetadata.fees_custom_val || "25");

        setLinkedin(finalFounder.linkedin || matchedMetadata.startup_linkedin || "");
        setTwitter(matchedMetadata.startup_twitter || "");
        setGithub("");
        setWebsite(finalFounder.companywebsite || matchedMetadata.startup_website || "");

        setStartupName(matchedMetadata.startup_name || finalFounder.company || "TechCo AI");
        setStartupRole(matchedMetadata.startup_role || finalFounder.role || "Co-founder & CTO");
        setStartupStage(matchedMetadata.startup_stage || finalFounder.stage || "Series A");
        setStartupCategory(matchedMetadata.startup_category || finalFounder.industry || "AI / SaaS");
        setStartupLocation(matchedMetadata.startup_location || finalFounder.location || "Karachi, PK");
        setStartupTeamSize(matchedMetadata.startup_team_size || "5-10");
        setStartupFunding(matchedMetadata.startup_funding || "$1M+");
        setStartupBio(matchedMetadata.startup_bio || "");
        setStartupLogo(matchedMetadata.startup_logo || DEFAULT_LOGO);
        setStartupLinkedin(matchedMetadata.startup_linkedin || "");
        setStartupTwitter(matchedMetadata.startup_twitter || "");
        setStartupWebsite(matchedMetadata.startup_website || "");
      }

      setLoading(false);
    };

    loadData();
  }, [username]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "personal" | "startup") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        const MAX_WIDTH = 180;
        const MAX_HEIGHT = 180;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        if (type === "personal") {
          setPersonalPhoto(dataUrl);
        } else {
          setStartupLogo(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const targetId = founderId || currentUserId;
    if (!targetId) {
      alert("Unable to save. User identifier missing.");
      return;
    }

    setSaving(true);
    try {
      const updatedMetadata: ProfileMetadata = {
        personal_photo: personalPhoto,
        startup_logo: startupLogo,
        fees_30m: fees30m,
        fees_1h: fees1h,
        fees_custom_min: feesCustomMin,
        fees_custom_val: feesCustomVal,
        skills,
        startup_name: startupName,
        startup_role: startupRole,
        startup_stage: startupStage,
        startup_category: startupCategory,
        startup_location: startupLocation,
        startup_team_size: startupTeamSize,
        startup_funding: startupFunding,
        startup_bio: startupBio,
        startup_linkedin: startupLinkedin,
        startup_twitter: startupTwitter,
        startup_website: startupWebsite
      };

      const serializedBio = serializeBioAndMetadata(bio, updatedMetadata);

      // Perform upsert so mock records can also be initialized in DB
      const { error: founderErr } = await supabase
        .from("founder_profiles")
        .upsert({
          id: targetId,
          full_name: name,
          bio: serializedBio,
          company: startupName,
          role: role,
          category: startupCategory,
          twitter,
          linkedin,
          website
        });

      if (founderErr) throw founderErr;

      setMetadata(updatedMetadata);
      
      // Update local founder card preview state
      if (founder) {
        setFounder({
          ...founder,
          name,
          role,
          company: startupName,
          bio,
          linkedin,
          companywebsite: website
        });
      }

      setEditing(false);
    } catch (err) {
      console.error("Error saving founder profile:", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkillText.trim() && !skills.includes(newSkillText.trim())) {
      setSkills([...skills, newSkillText.trim()]);
      setNewSkillText("");
    }
  };

  const removeSkill = (indexToRemove: number) => {
    setSkills(skills.filter((_, i) => i !== indexToRemove));
  };

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
        fullString: `${dateNames[d.getDay()]} ${monthNames[d.getMonth()]} ${d.getDate()}`
      });
    }
    return days;
  };

  const handleActiveTabChange = (tab: string) => {
    window.location.href = `/?tab=${tab}`;
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

  const nextDays = getNextDays();
  const timeSlots = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-soft)" }}>
      
      {/* Scoped CSS styling for user dashboard profile */}
      <style>{`
        .sidebar-container {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          width: 248px;
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .main-content-layout {
          margin-left: 248px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          min-width: 0;
        }
        .dashboard-header {
          height: 72px;
          background: #ffffff;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 90;
          box-shadow: 0 1px 2px rgba(0,0,0,0.01);
        }
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
        }
        .mobile-menu-toggle:hover {
          background: var(--bg-soft);
        }
        .greeting-box {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .welcome-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .user-name-label {
          font-size: 15px;
          font-weight: 850;
          color: var(--primary);
          font-family: 'Syne', sans-serif;
        }

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
        .social-logo-container {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .fee-card {
          padding: 24px;
          background: #ffffff;
          border: 1.5px solid var(--border);
          border-radius: 18px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          gap: 16px;
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
        
        .profile-tab-btn {
          position: relative;
          padding: 16px 24px;
          font-size: 14px;
          font-weight: 800;
          color: var(--text-secondary);
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'Syne', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .profile-tab-btn:hover {
          color: var(--primary);
          background: var(--primary-50);
          border-radius: 12px 12px 0 0;
        }
        .profile-tab-btn.active {
          color: var(--primary);
          background: none;
        }
        .profile-tab-btn.active::after {
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
          background: var(--primary) !important;
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
          background: var(--primary) !important;
          color: white !important;
        }

        @media (max-width: 768px) {
          .sidebar-container {
            transform: translateX(-248px);
          }
          .sidebar-container.open {
            transform: translateX(0);
            box-shadow: 8px 0 24px rgba(0,0,0,0.1);
          }
          .main-content-layout {
            margin-left: 0;
          }
          .mobile-menu-toggle {
            display: block;
          }
          .dashboard-header {
            padding: 0 16px;
          }
          .welcome-label {
            display: none;
          }
          .user-name-label {
            font-size: 14px;
          }
        }
      `}</style>

      {/* Hidden File inputs */}
      <input type="file" ref={personalFileRef} style={{ display: "none" }} accept="image/*" onChange={(e) => handleImageChange(e, "personal")} />
      <input type="file" ref={startupFileRef} style={{ display: "none" }} accept="image/*" onChange={(e) => handleImageChange(e, "startup")} />

      {/* Sidebar - Desktop and Mobile */}
      <div className={`sidebar-container ${mobileMenuOpen ? "open" : ""}`}>
        <Sidebar 
          activeTab="" 
          setActiveTab={handleActiveTabChange} 
          profile={userProfile}
        />
      </div>

      {/* Main Layout Area */}
      <div className="main-content-layout">
        
        {/* Top Header */}
        <header className="dashboard-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="greeting-box">
              <span className="welcome-label">Viewing Profile:</span>
              <span className="user-name-label">{name}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, padding: "28px 24px", maxWidth: 1200, width: "100%", margin: "0 auto" }}>

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
                  src={activeTab === "personal" ? personalPhoto : startupLogo} 
                  alt={name}
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
                {editing && (
                  <button 
                    onClick={() => activeTab === "personal" ? personalFileRef.current?.click() : startupFileRef.current?.click()}
                    style={{ 
                      position: "absolute", 
                      bottom: -2, 
                      right: -2, 
                      width: 32, 
                      height: 32, 
                      background: "#ffffff", 
                      border: "1px solid var(--border)", 
                      borderRadius: "50%", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      cursor: "pointer",
                      boxShadow: "0 3px 6px rgba(0,0,0,0.12)"
                    }}
                    title="Change Photo"
                  >
                    <Camera size={14} color="var(--text-secondary)" />
                  </button>
                )}
              </div>

              {/* Name & Taglines */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {editing ? (
                    <input 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="input-field" 
                      style={{ fontSize: 20, fontWeight: 800, height: 38, width: 220, padding: "0 10px" }}
                    />
                  ) : (
                    <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.5px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {activeTab === "personal" ? name : startupName}
                    </h2>
                  )}
                  {founder.verified && <CheckCircle size={18} color="var(--primary)" fill="var(--primary-xlight)" style={{ flexShrink: 0 }} />}
                </div>
                
                {activeTab === "personal" ? (
                  <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 6, fontWeight: 500, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <Briefcase size={14} color="var(--primary)" />
                    {editing ? (
                      <input 
                        value={role} 
                        onChange={e => setRole(e.target.value)} 
                        className="input-field" 
                        style={{ fontSize: 13, height: 32, width: 180, padding: "0 8px" }}
                      />
                    ) : (
                      role
                    )}
                    {startupLogo && (startupLogo.startsWith("data:image") || startupLogo.startsWith("http")) ? (
                      <img 
                        src={startupLogo} 
                        style={{ width: 16, height: 16, borderRadius: 4, objectFit: "cover", display: "inline-block", verticalAlign: "middle", margin: "0 2px" }} 
                        alt="Startup Logo" 
                      />
                    ) : (
                      " @ "
                    )}
                    <span style={{ fontWeight: 700, color: "var(--text)" }}>{startupName}</span>
                  </p>
                ) : (
                  <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 6, fontWeight: 500, display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Building size={14} color="var(--primary)" /> {startupStage}</span>
                    <span style={{ color: "var(--border)" }}>•</span>
                    <span>{startupCategory}</span>
                  </p>
                )}
              </div>

              {/* Rating & Views in Header space */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0, paddingLeft: 12 }}>
                {/* Rating */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 50 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#f59e0b" }}>
                    <Star size={16} fill="#f59e0b" />
                    <span style={{ fontSize: 15, fontWeight: 800 }}>{founder.rating || 4.9}</span>
                  </div>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{founder.meetings || 0} calls</span>
                </div>
                
                {/* Divider line */}
                <div style={{ width: 1, height: 28, background: "var(--border)" }} />
                
                {/* Views */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 50 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)" }}>
                    <Eye size={16} />
                    <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{founder.views || 142}</span>
                  </div>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Switcher Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: 12, paddingBottom: 0, marginTop: 110 }}>
            <button 
              className={`profile-tab-btn ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              Founder Profile
            </button>
            <button 
              className={`profile-tab-btn ${activeTab === "startup" ? "active" : ""}`}
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
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>About {name.split(" ")[0]}</h3>
                    </div>
                    {editing ? (
                      <textarea 
                        value={bio} 
                        onChange={e => setBio(e.target.value)} 
                        className="input-field" 
                        placeholder="Write your professional bio..."
                        style={{ height: 130, resize: "none", lineHeight: 1.6 }} 
                      />
                    ) : (
                      <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                        {bio || "No biography added yet."}
                      </p>
                    )}
                  </div>

                  {/* Consultation Booking Rates Cards */}
                  <div className="card">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 32, height: 32, background: "var(--primary-xlight)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Clock size={15} color="var(--primary)" />
                      </div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Consultation Slots</h3>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
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
                          <span style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>$</span>
                          {editing ? (
                            <input 
                              type="number"
                              value={fees30m} 
                              onChange={e => setFees30m(e.target.value)} 
                              className="input-field"
                              style={{ padding: "4px 8px", fontSize: 16, width: 70, fontWeight: 700, height: 32, display: "inline-block" }}
                            />
                          ) : (
                            <span style={{ fontSize: 26, fontWeight: 800, color: "var(--primary)", fontFamily: "'Syne', sans-serif" }}>{fees30m}</span>
                          )}
                          <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>/ call</span>
                        </div>
                        <p style={{ fontSize: 11.5, color: "var(--text-secondary)", minHeight: 34 }}>Quick check-in, advice on product-market fit, or networking.</p>
                        
                        <button 
                          className="btn-primary" 
                          style={{ width: "100%", height: 38, marginTop: 8, justifyContent: "center", fontSize: 13 }}
                          onClick={() => {
                            setSelectedRate({ label: "30-Minute Consultation", price: fees30m, minutes: "30" });
                            setBookingStep("scheduling");
                          }}
                          disabled={editing}
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
                          <span style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>$</span>
                          {editing ? (
                            <input 
                              type="number"
                              value={fees1h} 
                              onChange={e => setFees1h(e.target.value)} 
                              className="input-field"
                              style={{ padding: "4px 8px", fontSize: 16, width: 70, fontWeight: 700, height: 32, display: "inline-block" }}
                            />
                          ) : (
                            <span style={{ fontSize: 26, fontWeight: 800, color: "var(--primary)", fontFamily: "'Syne', sans-serif" }}>{fees1h}</span>
                          )}
                          <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>/ call</span>
                        </div>
                        <p style={{ fontSize: 11.5, color: "var(--text-secondary)", minHeight: 34 }}>Detailed business review, pitch deck feedback, or architecture setup.</p>
                        
                        <button 
                          className="btn-primary" 
                          style={{ width: "100%", height: 38, marginTop: 8, justifyContent: "center", fontSize: 13 }}
                          onClick={() => {
                            setSelectedRate({ label: "1-Hour Strategic Session", price: fees1h, minutes: "60" });
                            setBookingStep("scheduling");
                          }}
                          disabled={editing}
                        >
                          Book Session
                        </button>
                      </div>

                      {/* Rate 3 */}
                      <div className="fee-card">
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                          <Clock size={14} color="var(--primary)" /> 
                          {editing ? (
                            <input 
                              type="number"
                              value={feesCustomMin} 
                              onChange={e => setFeesCustomMin(e.target.value)} 
                              className="input-field"
                              style={{ padding: "2px 6px", fontSize: 12, width: 44, fontWeight: 700, height: 26, display: "inline-block" }}
                            />
                          ) : (
                            feesCustomMin
                          )}
                          -Min Custom
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 2, margin: "4px 0" }}>
                          <span style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>$</span>
                          {editing ? (
                            <input 
                              type="number"
                              value={feesCustomVal} 
                              onChange={e => setFeesCustomVal(e.target.value)} 
                              className="input-field"
                              style={{ padding: "4px 8px", fontSize: 16, width: 70, fontWeight: 700, height: 32, display: "inline-block" }}
                            />
                          ) : (
                            <span style={{ fontSize: 26, fontWeight: 800, color: "var(--primary)", fontFamily: "'Syne', sans-serif" }}>{feesCustomVal}</span>
                          )}
                          <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>/ call</span>
                        </div>
                        <p style={{ fontSize: 11.5, color: "var(--text-secondary)", minHeight: 34 }}>Custom duration slot set by founder for specific booking demands.</p>
                        
                        <button 
                          className="btn-primary" 
                          style={{ width: "100%", height: 38, marginTop: 8, justifyContent: "center", fontSize: 13 }}
                          onClick={() => {
                            setSelectedRate({ label: `${feesCustomMin}-Minute Consultation`, price: feesCustomVal, minutes: feesCustomMin });
                            setBookingStep("scheduling");
                          }}
                          disabled={editing}
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
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: editing ? 12 : 0 }}>
                      {skills.map((skill, i) => (
                        <span key={i} className="green-tag" style={{ fontSize: 11.5, padding: "5px 14px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
                          {skill}
                          {editing && (
                            <button onClick={() => removeSkill(i)} style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontWeight: 800, fontSize: 10 }}>×</button>
                          )}
                        </span>
                      ))}
                    </div>
                    {editing && (
                      <div style={{ display: "flex", gap: 8, maxWidth: 300, marginTop: 12 }}>
                        <input 
                          type="text" 
                          value={newSkillText}
                          onChange={e => setNewSkillText(e.target.value)}
                          placeholder="Add skill tag..."
                          className="input-field"
                          style={{ height: 34, padding: "0 12px", fontSize: 13 }}
                        />
                        <button onClick={addSkill} className="btn-primary" style={{ height: 34, padding: "0 14px", fontSize: 12 }}><Plus size={12} /> Add</button>
                      </div>
                    )}
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
                    {editing ? (
                      <textarea 
                        value={startupBio} 
                        onChange={e => setStartupBio(e.target.value)} 
                        className="input-field" 
                        placeholder="Write startup bio and vision details..."
                        style={{ height: 130, resize: "none", lineHeight: 1.6 }} 
                      />
                    ) : (
                      <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                        {startupBio || `${startupName} is building revolutionary solutions. Focuses on innovation and high scale.`}
                      </p>
                    )}
                    
                    {/* Pitch Deck action */}
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 24, borderTop: "1px solid var(--border)", paddingTop: 20, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text)" }}>Company Pitch Deck</div>
                        <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>Request investor presentation slides for review.</p>
                      </div>
                      <div style={{ marginLeft: "auto" }}>
                        {deckRequestSent ? (
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: 6 }}>
                            <CheckCircle2 size={16} /> Request Sent!
                          </span>
                        ) : (
                          <button 
                            className="btn-outline" 
                            style={{ height: 38, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}
                            onClick={handleRequestDeck}
                            disabled={deckRequestLoading || editing}
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
                        { label: "Startup Name", value: startupName, set: setStartupName, placeholder: "e.g. TechCo" },
                        { label: "Founder Role", value: startupRole, set: setStartupRole, placeholder: "e.g. Co-founder & CEO" },
                        { label: "Funding Stage", value: startupStage, set: setStartupStage, placeholder: "e.g. Series A" },
                        { label: "Industry Category", value: startupCategory, set: setStartupCategory, placeholder: "e.g. AI / SaaS" },
                        { label: "Headquarters", value: startupLocation, set: setStartupLocation, placeholder: "e.g. Karachi, PK" },
                        { label: "Team Size", value: startupTeamSize, set: setStartupTeamSize, placeholder: "e.g. 5-10" },
                        { label: "Total Funding", value: startupFunding, set: setStartupFunding, placeholder: "e.g. $1M+" },
                      ].map((f: any, i: number) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</span>
                          {editing ? (
                            <input 
                              value={f.value} 
                              onChange={e => f.set(e.target.value)} 
                              placeholder={f.placeholder}
                              className="input-field" 
                              style={{ height: 36, padding: "0 10px", fontSize: 13 }} 
                            />
                          ) : (
                            <span style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text)" }}>{f.value}</span>
                          )}
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
                          <p style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2 }}>
                            Booking: <strong style={{ color: "var(--primary)" }}>{selectedRate?.label} (${selectedRate?.price})</strong>
                          </p>
                        </div>
                        <button 
                          onClick={() => setBookingStep("select-rate")}
                          style={{ background: "none", border: "none", fontSize: 11.5, fontWeight: 750, color: "var(--text-secondary)", cursor: "pointer" }}
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Step 1: Select Date */}
                      <div style={{ marginBottom: 20 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text)", textTransform: "uppercase", display: "block", marginBottom: 10, letterSpacing: "0.03em" }}>1. Select Meeting Date</span>
                        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                          {nextDays.map((d: any, i: number) => (
                            <div 
                              key={i} 
                              className={`date-pill ${bookingDate === d.fullString ? "active" : ""}`}
                              onClick={() => setBookingDate(d.fullString)}
                              style={{ color: bookingDate === d.fullString ? "#ffffff" : "var(--text-secondary)" }}
                            >
                              <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, color: "inherit" }}>{d.dayName}</span>
                              <span style={{ fontSize: 16, fontWeight: 800, color: "inherit" }}>{d.dayNum}</span>
                              <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, color: "inherit" }}>{d.month}</span>
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
                              style={{ color: bookingTime === time ? "#ffffff" : "var(--text-secondary)" }}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Submit checkout */}
                      <button 
                        className="btn-primary"
                        onClick={handleBookSession}
                        disabled={bookingLoading}
                        style={{ width: "100%", justifyContent: "center", padding: "14px 24px", height: 48, fontSize: 14 }}
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
                      <div style={{ width: 56, height: 56, background: "var(--primary-xlight)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }} className="justify-center items-center">
                        <CheckCircle2 size={36} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>Consultation Requested!</h3>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6, maxWidth: 360, lineHeight: 1.5 }}>
                          Your calendar request has been forwarded to <strong>{name}</strong>. You will receive an email invite containing the video room link as soon as they confirm!
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
              
              {/* DIRECT CONTACT PANEL (EMAIL AT TOP) */}
              <div className="card">
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Verified Contacts</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Email row */}
                  <div style={{ padding: "12px 14px", background: "var(--bg-soft)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                    <Mail size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 700 }}>Email Address</div>
                      <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", marginTop: 2 }}>
                        {founder.email || "founder-contact@founivo.io"}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCopy(founder.email || "founder-contact@founivo.io", 'email')}
                      style={{ background: "none", border: "none", color: "var(--primary)", fontSize: 11, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}
                    >
                      {copiedText === 'email' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* SOCIAL / CONNECTIONS CARD (BELOW EMAIL) */}
              <div className="card">
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
                  {activeTab === "personal" ? "Founder Connections" : "Startup Links"}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {activeTab === "personal" ? (
                    /* Personal Links with authentic colors */
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[
                          { logo: LinkedInLogo, label: "LinkedIn", val: linkedin, set: setLinkedin, placeholder: "linkedin.com/in/username" },
                          { logo: TwitterXLogo, label: "Twitter / X", val: twitter, set: setTwitter, placeholder: "@handle" },
                          { logo: GlobeLogo, label: "Website", val: website, set: setWebsite, placeholder: "website.com" }
                        ].map((s: any, i: number) => {
                          const Logo = s.logo;
                          return (
                            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              {editing ? (
                                <>
                                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}><Logo size={12} /> {s.label}</span>
                                  <input 
                                    value={s.val} 
                                    onChange={e => s.set(e.target.value)} 
                                    placeholder={s.placeholder}
                                    className="input-field" 
                                    style={{ height: 34, padding: "0 10px", fontSize: 13 }}
                                  />
                                </>
                              ) : (
                                s.val && (
                                  <a 
                                    href={s.val.startsWith("http") ? s.val : `https://${s.val}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link-item"
                                  >
                                    <div className="social-logo-container">
                                      <Logo size={16} />
                                    </div>
                                    <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>{s.label} Profile</span>
                                    <ExternalLink size={12} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
                                  </a>
                                )
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    /* Startup Links */
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {[
                        { logo: GlobeLogo, label: "Company Website", val: startupWebsite, set: setStartupWebsite, placeholder: "companywebsite.com" },
                        { logo: LinkedInLogo, label: "Company LinkedIn", val: startupLinkedin, set: setStartupLinkedin, placeholder: "linkedin.com/company/startup" },
                        { logo: TwitterXLogo, label: "Company Twitter / X", val: startupTwitter, set: setStartupTwitter, placeholder: "@company" }
                      ].map((s: any, i: number) => {
                        const Logo = s.logo;
                        return (
                          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {editing ? (
                              <>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}><Logo size={12} /> {s.label}</span>
                                <input 
                                  value={s.val} 
                                  onChange={e => s.set(e.target.value)} 
                                  placeholder={s.placeholder}
                                  className="input-field" 
                                  style={{ height: 34, padding: "0 10px", fontSize: 13 }}
                                />
                              </>
                            ) : (
                              s.val && (
                                <a 
                                  href={s.val.startsWith("http") ? s.val : `https://${s.val}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="social-link-item"
                                >
                                  <div className="social-logo-container">
                                    <Logo size={16} />
                                  </div>
                                  <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>{s.label}</span>
                                  <ExternalLink size={12} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
                                </a>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* CHAT CALLOUT / DIRECT MESSAGE */}
              <div className="card" style={{ border: "1.5px dashed rgba(15, 110, 86, 0.3)", background: "rgba(15, 110, 86, 0.01)" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "start" }}>
                  <MessageSquare size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h4 style={{ fontSize: 13.5, fontWeight: 700, color: "var(--primary)" }}>Direct Messaging</h4>
                    <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5 }}>
                      Investors or founders who have booked a call can chat with {name} directly via Founivo Messages.
                    </p>
                    <Link href="/messages" style={{ textDecoration: "none" }}>
                      <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "8px 14px", fontSize: 12, height: 36, marginTop: 12 }} disabled={editing}>
                        Send Message
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
