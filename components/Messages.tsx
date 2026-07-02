"use client";
import { MessageSquare, Calendar, Sparkles, Zap, BellRing } from "lucide-react";

export default function Messages() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, minHeight: "80vh", justifyContent: "center", alignItems: "center" }} className="fade-in">
      <div className="coming-soon-card">
        <div className="icon-pulse-wrapper">
          <div className="pulse-ring" />
          <div className="icon-bg">
            <MessageSquare size={36} color="var(--primary)" fill="var(--primary-xlight)" />
          </div>
        </div>

        <h1 className="coming-soon-title">Direct Messaging</h1>
        <div className="coming-soon-badge">Coming Soon</div>

        <p className="coming-soon-description">
          We are building a secure, high-intent real-time messaging system. Soon you'll be able to chat directly with verified founders, share documents, and schedule video calls right from your dashboard.
        </p>

        <div className="features-preview-box">
          <h3 className="preview-heading">What's in the works:</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: Zap, label: "Direct Pitch Room", desc: "Start direct conversations with elite founders" },
              { icon: Calendar, label: "Calendly Integration", desc: "Schedule and book video calls seamlessly" },
              { icon: BellRing, label: "Real-time Alerts", desc: "Get SMS/email notifications for new answers" },
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} style={{ display: "flex", gap: 12, alignItems: "start" }}>
                  <div className="small-icon-bg">
                    <Icon size={14} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 750, color: "var(--text)" }}>{f.label}</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 1 }}>{f.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button className="btn-primary notify-btn">
          <Sparkles size={16} /> Notify Me on Launch
        </button>
      </div>

      <style>{`
        .coming-soon-card {
          background: #ffffff;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
          border-radius: 24px;
          padding: 40px 32px;
          max-width: 480px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .icon-pulse-wrapper {
          position: relative;
          margin-bottom: 24px;
        }
        .pulse-ring {
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border: 2px dashed var(--primary-100);
          border-radius: 50%;
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .icon-bg {
          width: 72px;
          height: 72px;
          background: var(--primary-xlight);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 2px 4px rgba(15,110,86,0.06);
        }
        .coming-soon-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 6px;
          font-family: 'Syne', sans-serif;
        }
        .coming-soon-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 750;
          color: var(--primary);
          background: var(--primary-xlight);
          border: 1px solid var(--primary-100);
          padding: 3px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 18px;
          font-family: 'Syne', sans-serif;
        }
        .coming-soon-description {
          font-size: 13.5px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .features-preview-box {
          background: var(--bg-soft);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 18px;
          width: 100%;
          text-align: left;
          margin-bottom: 28px;
        }
        .preview-heading {
          font-size: 13px;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 14px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-family: 'Syne', sans-serif;
        }
        .small-icon-bg {
          width: 24px;
          height: 24px;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .notify-btn {
          width: 100%;
          justify-content: center;
          height: 48px;
          border-radius: 12px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
