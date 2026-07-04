"use client";
import React, { useState, useEffect, use } from "react";
import { ArrowLeft, MapPin, CheckCircle, Star, ShieldCheck, Mail, Globe, Copy, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { DashboardFounder } from "@/app/lib/googleSheets";

// Helper to generate URL-friendly slugs/usernames from name
export function getSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const INITIAL_MOCK_FOUNDERS: DashboardFounder[] = [
  { name: "Aisha Malik", role: "CEO & Co-founder", company: "NovaTech AI", industry: "AI/ML", stage: "Series A", location: "San Francisco", tags: ["AI/ML", "SaaS", "B2B"], avatar: "AM", rating: 4.9, views: 284, meetings: 32, available: true, verified: true, bio: "Built and scaled 2 AI startups. Ex-Google. Passionate about helping founders navigate product-market fit.", email: "aisha@novatech.io", linkedin: "https://linkedin.com/in/aishamalik", companywebsite: "https://novatech.io" },
  { name: "Carlos Rivera", role: "Founder", company: "GreenPay", industry: "FinTech", stage: "Seed", location: "New York", tags: ["FinTech", "Payments", "Scaling"], avatar: "CR", rating: 4.8, views: 197, meetings: 18, available: true, verified: true, bio: "Fintech entrepreneur with 8 years experience. Raised $2M seed round. Love helping first-time founders.", email: "carlos@greenpay.co", linkedin: "https://linkedin.com/in/carlosrivera", companywebsite: "https://greenpay.co" },
  { name: "Priya Nair", role: "Co-founder & CTO", company: "EduBridge", industry: "EdTech", stage: "Pre-seed", location: "London", tags: ["EdTech", "B2C", "Tech"], avatar: "PN", rating: 5.0, views: 341, meetings: 41, available: false, verified: true, bio: "Technical co-founder turned CEO. MIT grad. Passionate about accessible education and early-stage tech.", email: "priya@edubridge.io", linkedin: "https://linkedin.com/in/priyanair", companywebsite: "https://edubridge.io" },
  { name: "Sam Osei", role: "Founder", company: "HealthSync", industry: "HealthTech", stage: "Series A", location: "Nairobi", tags: ["HealthTech", "Africa", "Impact"], avatar: "SO", rating: 4.7, views: 156, meetings: 24, available: true, verified: true, bio: "Health tech founder operating across East Africa. 3x exits. Mentor at Techstars Africa.", email: "sam@healthsync.co", linkedin: "https://linkedin.com/in/samosei", companywebsite: "https://healthsync.co" },
  { name: "Lena Müller", role: "CEO", company: "ClimateOps", industry: "ClimaTech", stage: "Seed", location: "Berlin", tags: ["ClimaTech", "B2B"], avatar: "LM", rating: 4.6, views: 122, meetings: 15, available: true, verified: false, bio: "Climate tech CEO building carbon management tools for enterprise. YC S22 alumni.", email: "lena@climateops.de", linkedin: "https://linkedin.com/in/lenamuller", companywebsite: "https://climateops.de" },
  { name: "David Kim", role: "Co-founder", company: "CryptoEdge", industry: "Web3", stage: "Pre-seed", location: "Singapore", tags: ["Web3", "DeFi"], avatar: "DK", rating: 4.5, views: 98, meetings: 11, available: false, verified: true, bio: "Web3 builder since 2017. Co-founded 3 blockchain protocols. Deep expertise in DeFi and tokenomics.", email: "david@cryptoedge.io", linkedin: "https://linkedin.com/in/davidkim", companywebsite: "https://cryptoedge.io" },
];

interface PageProps {
  params: Promise<{ username: string }>;
}

export default function FounderProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const [founder, setFounder] = useState<DashboardFounder | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL;
    
    const loadData = async () => {
      setLoading(true);
      let list = INITIAL_MOCK_FOUNDERS;
      
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

      // Find by slug
      const found = list.find(f => getSlug(f.name) === username);
      setFounder(found || null);
      setLoading(false);
    };

    loadData();
  }, [username]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg-soft)", gap: 12 }}>
        <Loader2 className="animate-spin" color="var(--primary)" size={32} />
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)" }}>Loading profile...</span>
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

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-soft)", padding: "40px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }} className="fade-in">
        {/* Back Link */}
        <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "var(--primary)", marginBottom: 24 }} className="hover-opacity">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Profile Card */}
        <div style={{ background: "#ffffff", borderRadius: 24, padding: "40px 32px", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
          
          {/* Header Info */}
          <div style={{ display: "flex", gap: 24, alignItems: "start", marginBottom: 32, flexWrap: "wrap" }}>
            <div className="avatar" style={{ width: 80, height: 80, fontSize: 24, fontWeight: 800, borderRadius: 24, background: "linear-gradient(135deg, var(--primary), var(--primary-light))", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {founder.avatar}
            </div>
            
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                <h1 style={{ fontSize: 24, fontWeight: 850, color: "var(--text)", fontFamily: "'Syne', sans-serif", margin: 0 }}>{founder.name}</h1>
                {founder.verified && (
                  <span className="green-tag" style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", fontSize: 10, fontWeight: 700 }}>
                    <CheckCircle size={11} color="var(--primary)" fill="var(--primary-xlight)" /> Verified Member
                  </span>
                )}
              </div>
              <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 550, margin: "0 0 10px" }}>
                {founder.role} @ <strong style={{ color: "var(--text)" }}>{founder.company}</strong>
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                <MapPin size={14} color="var(--text-muted)" />
                <span>{founder.location} · {founder.stage}</span>
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 }}>
            <div className="stat-card" style={{ padding: "16px 20px" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>★ {founder.rating}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", fontWeight: 700 }}>Rating</div>
            </div>
            <div className="stat-card" style={{ padding: "16px 20px" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>{founder.meetings}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", fontWeight: 700 }}>Meetings</div>
            </div>
            <div className="stat-card" style={{ padding: "16px 20px" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>{founder.views}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", fontWeight: 700 }}>Views</div>
            </div>
          </div>

          {/* Bio / About */}
          <div style={{ marginBottom: 36 }}>
            <h2 className="section-title">About the Founder</h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
              {founder.bio}
            </p>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 36 }}>
            <h2 className="section-title">Expertise</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {founder.tags.map((tag, i) => (
                <span key={i} className="green-tag" style={{ fontSize: 11, padding: "4px 12px", borderRadius: 8 }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Company Details */}
          <div style={{ marginBottom: 36, padding: 20, borderRadius: 16, background: "var(--bg-soft)", border: "1px solid var(--border)" }}>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Startup Profile</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "var(--text-secondary)" }}>Company Name:</span>
                <span style={{ fontWeight: 700, color: "var(--text)" }}>{founder.company}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "var(--text-secondary)" }}>Industry / Sector:</span>
                <span style={{ fontWeight: 700, color: "var(--text)" }}>{founder.industry}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "var(--text-secondary)" }}>Company Stage:</span>
                <span style={{ fontWeight: 700, color: "var(--text)" }}>{founder.stage}</span>
              </div>
              {founder.companywebsite && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Website:</span>
                  <a href={founder.companywebsite} target="_blank" rel="noreferrer" style={{ fontWeight: 750, color: "var(--primary)", textDecoration: "none" }}>
                    {founder.companywebsite.replace(/^https?:\/\/(www\.)?/, '')} ↗
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div style={{ marginBottom: 40 }}>
            <h2 className="section-title">Verified Contact Details</h2>
            
            {/* Email */}
            {founder.email ? (
              <div className="contact-row" onClick={() => handleCopy(founder.email, 'email')}>
                <div className="contact-icon">
                  <Mail size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingLeft: 12 }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Email Address</div>
                  <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{founder.email}</div>
                </div>
                <button style={{ background: "none", border: "none", color: "var(--primary)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  {copiedText === 'email' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic", margin: "0 0 16px" }}>No email address listed in sheet.</p>
            )}

            {/* LinkedIn */}
            {founder.linkedin ? (
              <div className="contact-row" onClick={() => handleCopy(founder.linkedin, 'linkedin')}>
                <div className="contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingLeft: 12 }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>LinkedIn Profile</div>
                  <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{founder.linkedin}</div>
                </div>
                <button style={{ background: "none", border: "none", color: "var(--primary)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  {copiedText === 'linkedin' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>No LinkedIn profile listed.</p>
            )}
          </div>

          {/* Action CTA */}
          {founder.linkedin && (
            <a href={founder.linkedin} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ width: "100%", padding: "16px 24px", borderRadius: 12, justifyContent: "center", fontSize: 15 }}>
                <span>Connect on LinkedIn</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </a>
          )}
        </div>
      </div>

      <style>{`
        .section-title {
          font-size: 13px;
          font-weight: 750;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 14px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 6px;
          font-family: 'Syne', sans-serif;
        }
        .contact-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-radius: 14px;
          background: var(--bg-soft);
          border: 1px solid var(--border);
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .contact-row:hover {
          border-color: var(--primary-200);
          background: var(--primary-xlight);
        }
        .contact-icon {
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hover-opacity:hover {
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
}
