"use client";
import { Check, Zap, Star, Crown, CreditCard, Calendar, ArrowUpRight } from "lucide-react";

const plans = [
  { 
    name: "Starter", 
    price: "$200", 
    icon: Zap, 
    color: "#3b82f6", 
    bg: "#eff6ff", 
    border: "#bfdbfe", 
    current: false, 
    description: "Perfect for exploring the directory and discovering new founders.",
    features: [
      "View founder email address", 
      "View social media links", 
      "Read founder bio & startup details", 
      "Basic profile directories info", 
      "Unlimited profile browsing"
    ] 
  },
  { 
    name: "Connect", 
    price: "$500", 
    icon: Star, 
    color: "var(--primary)", 
    bg: "var(--primary-xlight)", 
    border: "var(--primary-200)", 
    current: true, 
    description: "Best for sending direct messages and scheduling connection calls.",
    features: [
      "Everything in Starter plan", 
      "View verified phone number", 
      "Direct WhatsApp contact link", 
      "Direct chat room messaging", 
      "High priority meeting request", 
      "10% connection cashback reward"
    ], 
    highlight: "Most Popular" 
  },
  { 
    name: "Premium", 
    price: "$3,000", 
    icon: Crown, 
    color: "#d97706", 
    bg: "#fffbeb", 
    border: "#fde68a", 
    current: false, 
    description: "Tailored for VC investors and recruiters seeking high-volume matching.",
    features: [
      "Everything in Connect plan", 
      "Dedicated account manager", 
      "Extended call booking windows", 
      "Custom startup matchmaking", 
      "Premium profile badge placement", 
      "Top placements in search results"
    ] 
  },
];

const history = [
  { plan: "Connect Plan", amount: "$500", date: "Jul 1, 2026", status: "Active" },
  { plan: "Starter Plan", amount: "$200", date: "Mar 12, 2026", status: "Expired" },
];

export default function Billing() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }} className="fade-in">
      {/* Title */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>My Subscription</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Manage billing plans and payment history</p>
      </div>

      {/* Current plan banner */}
      <div className="current-plan-banner">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="current-plan-badge">Active Plan</span>
          <h2 className="current-plan-title">Connect Plan — $500</h2>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>Activated on Jul 1, 2026 · Lifetime access</span>
        </div>
        <div className="current-plan-stats">
          <div className="stat-pill-inner">
            <span className="stat-label">Connection Quota</span>
            <span className="stat-value">Unlimited</span>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 20 }}>Choose a Plan</h2>
        <div className="pricing-grid">
          {plans.map((p, i) => {
            const Icon = p.icon;
            return (
              <div 
                key={i} 
                className={`plan-card ${p.current ? "current" : ""}`}
                style={{ 
                  borderColor: p.current ? p.color : "var(--border)",
                  boxShadow: p.current ? "0 10px 24px rgba(15,110,86,0.12)" : "var(--shadow-sm)"
                }}
              >
                {p.highlight && <div className="highlight-badge" style={{ background: p.color }}>{p.highlight}</div>}
                
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div className="plan-icon-bg" style={{ background: p.current ? "rgba(255,255,255,0.9)" : p.bg, borderColor: p.border }}>
                    <Icon size={20} color={p.color} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>{p.name}</h3>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>One-time payment</span>
                  </div>
                </div>

                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 18 }}>{p.description}</p>

                <div className="plan-price-box" style={{ color: p.color }}>
                  {p.price}
                </div>

                <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />

                {/* Features List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24, flex: 1 }}>
                  {p.features.map((feat, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div className="feat-check" style={{ background: `${p.color}15` }}>
                        <Check size={10} color={p.color} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Action button */}
                {p.current ? (
                  <div className="current-indicator-btn" style={{ background: p.color }}>
                    ✓ Current Active Plan
                  </div>
                ) : (
                  <button className="btn-outline plan-action-btn" style={{ borderColor: p.color, color: p.color }}>
                    Upgrade Plan <ArrowUpRight size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment history */}
      <div className="card" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <CreditCard size={16} color="var(--primary)" />
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>Billing Invoices</h3>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {history.map((h, i) => (
            <div key={i} className="invoice-row" style={{ borderBottom: i < history.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="invoice-icon-bg">
                  <CreditCard size={15} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{h.plan}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <Calendar size={11} color="var(--text-muted)" />
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{h.date}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className={`invoice-badge ${h.status === "Active" ? "active" : ""}`}>{h.status}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>{h.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .current-plan-banner {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          border-radius: 20px;
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          box-shadow: 0 4px 20px rgba(15,110,86,0.1);
        }
        .current-plan-badge {
          display: inline-block;
          align-self: flex-start;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-size: 10px;
          font-weight: 750;
          padding: 2px 10px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .current-plan-title {
          font-size: 22px;
          font-weight: 800;
          color: white;
          font-family: 'Syne', sans-serif;
        }
        .current-plan-stats {
          text-align: right;
        }
        .stat-pill-inner {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 10px 18px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        .stat-label {
          font-size: 10px;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
        }
        .stat-value {
          font-size: 18px;
          font-weight: 800;
          color: white;
          font-family: 'Syne', sans-serif;
        }

        /* Pricing Grid */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .plan-card {
          background: #ffffff;
          border: 2px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          position: relative;
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease;
        }
        .plan-card.current {
          background: var(--primary-50);
        }
        .plan-card:hover {
          transform: translateY(-2px);
        }
        .highlight-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          border-radius: 20px;
          padding: 3px 12px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: 'Syne', sans-serif;
        }
        .plan-icon-bg {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .plan-price-box {
          font-size: 30px;
          font-weight: 850;
          letter-spacing: -1px;
          font-family: 'Syne', sans-serif;
        }
        .feat-check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .plan-action-btn {
          width: 100%;
          justify-content: center;
          height: 42px;
          border-radius: 10px;
          font-size: 13px;
        }
        .current-indicator-btn {
          width: 100%;
          padding: 10px;
          text-align: center;
          color: white;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 750;
          font-family: 'Syne', sans-serif;
        }

        /* Invoices */
        .invoice-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
        }
        .invoice-icon-bg {
          width: 32px;
          height: 32px;
          background: var(--primary-50);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .invoice-badge {
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          background: #f3f4f6;
          color: var(--text-secondary);
          border: 1px solid var(--border);
        }
        .invoice-badge.active {
          background: var(--primary-50);
          color: var(--primary);
          border-color: var(--primary-100);
        }

        @media (max-width: 600px) {
          .current-plan-banner {
            padding: 20px;
          }
          .current-plan-stats {
            text-align: left;
            width: 100%;
          }
          .stat-pill-inner {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
