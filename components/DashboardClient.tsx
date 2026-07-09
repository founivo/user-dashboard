"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Discover from "./Discover";
import FindFounders from "./FindFounders";
import Messages from "./Messages";
import Saved from "./Saved";
import Billing from "./Billing";
import Settings from "./Settings";
import Notifications from "./Notifications";
import { createClient } from "@/app/utils/supabase/client";
import { Menu, X } from "lucide-react";

export const themes: Record<string, Record<string, string>> = {
  emerald: { primary: '#0F6E56', dark: '#0a5441', light: '#12856a', xlight: '#e6f4f1', p50: '#f0faf7', p100: '#d1ede6', p200: '#a3dbcd' },
  blue: { primary: '#2563EB', dark: '#1D4ED8', light: '#3B82F6', xlight: '#EFF6FF', p50: '#F8FAFC', p100: '#DBEAFE', p200: '#BFDBFE' },
  violet: { primary: '#7C3AED', dark: '#6D28D9', light: '#8B5CF6', xlight: '#F5F3FF', p50: '#FAFAFA', p100: '#EDE9FE', p200: '#DDD6FE' },
  rose: { primary: '#E11D48', dark: '#BE123C', light: '#F43F5E', xlight: '#FFF1F2', p50: '#FFF5F5', p100: '#FFE4E6', p200: '#FECDD3' },
  orange: { primary: '#EA580C', dark: '#C2410C', light: '#F97316', xlight: '#FFF7ED', p50: '#FAFAF9', p100: '#FFEDD5', p200: '#FED7AA' },
  teal: { primary: '#0D9488', dark: '#0F766E', light: '#14B8A6', xlight: '#F0FDFA', p50: '#F4FAF8', p100: '#CCFBF1', p200: '#99F6E4' },
  indigo: { primary: '#4F46E5', dark: '#4338CA', light: '#6366F1', xlight: '#EEF2FF', p50: '#FAFAFE', p100: '#E0E7FF', p200: '#C7D2FE' }
};

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState("discover");
  const [syncing, setSyncing] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [theme, setTheme] = useState("emerald");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  // Shared state for saved founders
  const [savedFounders, setSavedFounders] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("founivo-saved-founders");
    if (saved) {
      try {
        setSavedFounders(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved founders:", e);
      }
    }
  }, []);

  const toggleSave = (name: string) => {
    setSavedFounders(prev => {
      const next = prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name];
      localStorage.setItem("founivo-saved-founders", JSON.stringify(next));
      return next;
    });
  };

  // Read initial tab parameter from URL if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  useEffect(() => {
    async function syncSession() {
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        const accessToken = url.searchParams.get("access_token");
        const refreshToken = url.searchParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            url.searchParams.delete("access_token");
            url.searchParams.delete("refresh_token");
            window.history.replaceState({}, document.title, url.pathname + url.search);
            window.location.reload();
            return;
          }
        }
      }
      setSyncing(false);
    }
    syncSession();
  }, [supabase]);

  // Load profile and saved theme
  useEffect(() => {
    if (syncing) return;

    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          const { data: prefData } = await supabase
            .from("user_preferences")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

          setProfile({
            ...profileData,
            preferences: prefData
          });
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      }
    }
    loadProfile();

    const savedTheme = localStorage.getItem("founivo-dashboard-theme");
    if (savedTheme && themes[savedTheme]) {
      changeTheme(savedTheme);
    }
  }, [syncing, supabase]);

  const changeTheme = (themeName: string) => {
    if (!themes[themeName]) return;
    setTheme(themeName);
    localStorage.setItem("founivo-dashboard-theme", themeName);
    
    const colors = themes[themeName];
    Object.entries(colors).forEach(([key, val]) => {
      const cssKey = key === 'primary' ? '--primary' : `--primary-${key}`;
      document.documentElement.style.setProperty(cssKey, val);
    });
  };

  const content: Record<string, React.ReactNode> = {
    discover: <Discover savedFounders={savedFounders} toggleSave={toggleSave} />,
    search: <FindFounders savedFounders={savedFounders} toggleSave={toggleSave} />,
    messages: <Messages />,
    saved: <Saved savedFounders={savedFounders} toggleSave={toggleSave} />,
    billing: <Billing />,
    settings: <Settings />,
    notifications: <Notifications />,
  };

  if (syncing) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg-soft)", color: "#04342C", fontFamily: "sans-serif" }}>
        <div style={{ textCenter: "center" } as any}>
          <div style={{ border: "4px solid rgba(15,110,86,0.1)", borderTop: "4px solid #0F6E56", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto 16px" }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ fontWeight: "bold" }}>Syncing your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-soft)" }}>
      {/* Sidebar - Desktop and Mobile */}
      <div className={`sidebar-container ${mobileMenuOpen ? "open" : ""}`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }} 
          profile={profile}
        />
      </div>

      {/* Main Layout Area */}
      <div className="main-content-layout">
        {/* Top Header */}
        <header className="dashboard-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Mobile menu toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Title / Greeting */}
            <div className="greeting-box">
              <span className="welcome-label">Welcome back,</span>
              <span className="user-name-label">{profile?.full_name || "User"}</span>
            </div>
          </div>

          {/* Theme Color Selector */}
          <div className="theme-selector-box">
            <span className="theme-label">Theme</span>
            <div style={{ display: "flex", gap: 6 }}>
              {Object.keys(themes).map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => changeTheme(themeName)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: themes[themeName].primary,
                    border: theme === themeName ? "2.5px solid #fff" : "none",
                    boxShadow: theme === themeName ? "0 0 0 2px var(--primary)" : "0 1px 3px rgba(0,0,0,0.15)",
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: theme === themeName ? "scale(1.2)" : "scale(1)"
                  }}
                  title={themeName.toUpperCase()}
                />
              ))}
            </div>
          </div>
        </header>

        {/* Dynamic page content */}
        <main style={{ flex: 1, padding: "28px 24px", maxWidth: 1200, width: "100%", margin: "0 auto" }}>
          {content[activeTab] ?? <Discover savedFounders={savedFounders} toggleSave={toggleSave} />}
        </main>
      </div>

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
        .theme-selector-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-soft);
          padding: 6px 14px;
          border-radius: 30px;
          border: 1px solid var(--border);
        }
        .theme-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
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
    </div>
  );
}
