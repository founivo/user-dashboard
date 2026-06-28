"use client";
import { useState, useEffect } from "react";
import { Bell, Shield, User, Trash2, CreditCard, Save, Loader2 } from "lucide-react";
import { createClient } from "../utils/supabase/client";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [purpose, setPurpose] = useState("");

  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          setEmail(user.email || "");

          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

          if (profile) {
            setName(profile.full_name || "");
          }

          const { data: pref } = await supabase
            .from("user_preferences")
            .select("*")
            .eq("id", user.id)
            .single();

          if (pref) {
            setLocation(pref.location || "");
            setIndustry(pref.industry || "");
            setPurpose(pref.purpose || "");
          }
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: name })
        .eq("id", userId);

      if (profileError) throw profileError;

      const { error: prefError } = await supabase
        .from("user_preferences")
        .upsert({
          id: userId,
          location,
          industry,
          purpose,
        });

      if (prefError) throw prefError;

      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px", gap: 10 }}>
        <Loader2 className="animate-spin" size={24} style={{ color: "var(--primary)" }} />
        <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>Loading settings...</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 640 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>Settings</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 34, height: 34, background: "var(--primary-xlight)", border: "1px solid var(--primary-100)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={16} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Profile Info</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { label: "Full Name", val: name, set: setName, disabled: false },
            { label: "Email", val: email, set: () => {}, disabled: true },
            { label: "Location", val: location, set: setLocation, disabled: false },
            { label: "Preferred Industry", val: industry, set: setIndustry, disabled: false },
            { label: "Goal / Purpose", val: purpose, set: setPurpose, disabled: false },
          ].map((f, i) => (
            <div key={i} style={{ gridColumn: f.label === "Goal / Purpose" ? "span 2" : "auto" }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</div>
              <input 
                className="input-field" 
                value={f.val} 
                onChange={e => f.set(e.target.value)} 
                disabled={f.disabled}
                style={{ 
                  fontSize: 13, 
                  background: f.disabled ? "var(--bg-soft)" : "white", 
                  cursor: f.disabled ? "not-allowed" : "text",
                  color: f.disabled ? "var(--text-muted)" : "var(--text)"
                }} 
              />
            </div>
          ))}
        </div>
        <button 
          onClick={handleSave} 
          className="btn-primary" 
          style={{ marginTop: 18, fontSize: 13 }}
          disabled={saving}
        >
          {saving ? (
            <><Loader2 size={14} className="animate-spin" /> Saving...</>
          ) : (
            <><Save size={14} />Save Changes</>
          )}
        </button>
      </div>

      {/* Notifications */}
      {[
        { icon: Bell, title: "Notifications", items: [
          { label: "New founder joins", sub: "When a founder in your saved industry signs up", on: true },
          { label: "Message reply", sub: "When a founder replies to your message", on: true },
          { label: "Meeting confirmed", sub: "When a founder accepts your meeting request", on: true },
          { label: "Weekly digest", sub: "A summary of new founders each week", on: false },
        ]},
        { icon: Shield, title: "Privacy", items: [
          { label: "Show my profile to founders", sub: "Founders can see who viewed their profile", on: true },
          { label: "Allow founder follow-ups", sub: "Founders can send you connection requests", on: false },
        ]},
      ].map((section, si) => {
        const Icon = section.icon;
        return (
          <div key={si} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 34, height: 34, background: "var(--primary-xlight)", border: "1px solid var(--primary-100)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{section.title}</h3>
            </div>
            {section.items.map((item, ii) => (
              <div key={ii} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: ii < section.items.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{item.sub}</div>
                </div>
                <div style={{ width: 44, height: 24, background: item.on ? "var(--primary)" : "var(--border)", borderRadius: 12, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ width: 18, height: 18, background: "white", borderRadius: "50%", position: "absolute", top: 3, left: item.on ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {/* Payment */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 34, height: 34, background: "var(--primary-xlight)", border: "1px solid var(--primary-100)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CreditCard size={16} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Payment</h3>
        </div>
        <div style={{ padding: 16, background: "var(--bg-soft)", borderRadius: 12, border: "1px solid var(--border)", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Saved Card</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Visa **** 4521</div>
        </div>
        <button className="btn-ghost" style={{ fontSize: 13 }}><CreditCard size={14} />Update Payment Method</button>
      </div>

      {/* Danger */}
      <div className="card" style={{ border: "1px solid #fecaca" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Trash2 size={18} color="#ef4444" />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#ef4444" }}>Danger Zone</h3>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Deleting your account is permanent. All your saved founders, messages and plan access will be lost.</p>
        <button style={{ background: "transparent", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>Delete Account</button>
      </div>
    </div>
  );
}
