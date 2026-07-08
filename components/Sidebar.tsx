"use client";
import { useState, useRef, useEffect } from "react";
import { LayoutDashboard, Search, MessageSquare, Bookmark, CreditCard, Settings, LogOut, Zap, Bell, ChevronUp } from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";

interface Props { 
  activeTab: string; 
  setActiveTab: (t: string) => void; 
  profile: any;
}

export default function Sidebar({ activeTab, setActiveTab, profile }: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const getAvatarUrl = () => {
    const purpose = profile?.preferences?.purpose || "";
    const marker = "\n\n---METADATA---\n";
    if (purpose.includes(marker)) {
      try {
        const meta = JSON.parse(purpose.split(marker)[1]);
        return meta.avatar || null;
      } catch (e) {}
    }
    return null;
  };
  const userAvatarUrl = getAvatarUrl();

  const nav = [
    { id: "discover", label: "Discover", icon: LayoutDashboard },
    { id: "search", label: "Find Founders", icon: Search },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
    { id: "saved", label: "Saved", icon: Bookmark },
    { id: "billing", label: "My Plan", icon: CreditCard },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside style={{ 
      width: 248, 
      height: "100vh", 
      background: "#fff", 
      borderRight: "1px solid var(--border)", 
      display: "flex", 
      flexDirection: "column", 
      padding: "24px 14px", 
      zIndex: 50, 
      boxShadow: "2px 0 12px rgba(15,110,86,0.03)" 
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 32, paddingLeft: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ 
            width: 36, 
            height: 36, 
            background: "var(--primary)", 
            borderRadius: 10, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            boxShadow: "0 2px 8px rgba(15,110,86,0.25)" 
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "var(--text)", letterSpacing: "-0.5px" }}>founivo</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ 
          fontSize: 10, 
          color: "var(--text-muted)", 
          fontWeight: 700, 
          paddingLeft: 14, 
          marginBottom: 8, 
          letterSpacing: "0.08em", 
          textTransform: "uppercase" 
        }}>
          Navigation
        </div>
        {nav.map(({ id, label, icon: Icon, badge }) => (
          <button 
            key={id} 
            onClick={() => setActiveTab(id)} 
            className={`sidebar-link ${activeTab === id ? "active" : ""}`}
          >
            <Icon size={17} />
            <span style={{ flex: 1 }}>{label}</span>
            {badge && (
              <span style={{ 
                background: activeTab === id ? "rgba(255,255,255,0.25)" : "var(--primary)", 
                color: activeTab === id ? "#fff" : "white", 
                borderRadius: 10, 
                padding: "1px 7px", 
                fontSize: 11, 
                fontWeight: 700, 
                fontFamily: "'Syne', sans-serif" 
              }}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Profile Avatar Dropdown at Bottom */}
      <div 
        ref={dropdownRef}
        style={{ 
          borderTop: "1px solid var(--border)", 
          paddingTop: 16, 
          position: "relative",
          marginTop: "auto"
        }}
      >
        {/* Trigger */}
        <div 
          onClick={() => setShowDropdown(!showDropdown)}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 12, 
            padding: "10px", 
            borderRadius: 14, 
            cursor: "pointer",
            transition: "all 0.2s ease",
            background: showDropdown ? "var(--primary-50)" : "transparent",
            border: showDropdown ? "1px solid var(--primary-100)" : "1px solid transparent",
          }}
        >
          <div className="avatar" style={{ 
            width: 38, 
            height: 38, 
            fontSize: 13, 
            background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
            position: "relative",
            overflow: "hidden"
          }}>
            {userAvatarUrl ? (
              <img src={userAvatarUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              getInitials(profile?.full_name || "User")
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: 13, 
              fontWeight: 700, 
              color: "var(--text)", 
              overflow: "hidden", 
              textOverflow: "ellipsis", 
              whiteSpace: "nowrap",
              fontFamily: "'Syne', sans-serif"
            }}>
              {profile?.full_name || "User Name"}
            </div>
            <div style={{ 
              fontSize: 11, 
              color: "var(--text-secondary)", 
              overflow: "hidden", 
              textOverflow: "ellipsis", 
              whiteSpace: "nowrap" 
            }}>
              {profile?.email || "Account"}
            </div>
          </div>
          <ChevronUp 
            size={14} 
            color="var(--text-secondary)"
            style={{ 
              transition: "transform 0.2s",
              transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)"
            }} 
          />
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div 
            className="fade-in"
            style={{ 
              position: "absolute", 
              bottom: 64, 
              left: 0, 
              right: 0, 
              background: "#fff", 
              border: "1px solid var(--border)", 
              borderRadius: 16, 
              boxShadow: "0 10px 32px rgba(15,110,86,0.15)", 
              padding: "6px", 
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}
          >
            <button 
              onClick={() => { setActiveTab("settings"); setShowDropdown(false); }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 10, 
                padding: "10px 12px", 
                border: "none", 
                background: "none", 
                width: "100%", 
                textAlign: "left", 
                borderRadius: 10, 
                fontSize: 13, 
                fontWeight: 600, 
                color: "var(--text-secondary)", 
                cursor: "pointer",
                transition: "background 0.2s",
                fontFamily: "inherit"
              }}
              className="dropdown-btn-hover"
            >
              <Settings size={15} color="var(--text-secondary)" /> Settings
            </button>
            <div style={{ height: 1, background: "var(--border)", margin: "4px 8px" }} />
            <button 
              onClick={handleSignOut}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 10, 
                padding: "10px 12px", 
                border: "none", 
                background: "none", 
                width: "100%", 
                textAlign: "left", 
                borderRadius: 10, 
                fontSize: 13, 
                fontWeight: 700, 
                color: "#ef4444", 
                cursor: "pointer",
                transition: "background 0.2s",
                fontFamily: "inherit"
              }}
              className="dropdown-btn-hover-danger"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        )}
      </div>

      <style>{`
        .dropdown-btn-hover:hover {
          background: var(--bg-soft);
          color: var(--primary) !important;
        }
        .dropdown-btn-hover:hover svg {
          color: var(--primary) !important;
        }
        .dropdown-btn-hover-danger:hover {
          background: #fef2f2;
        }
      `}</style>
    </aside>
  );
}
