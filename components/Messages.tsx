"use client";
import { useState } from "react";
import { Search, Send, Paperclip, MoreVertical, Lock, CheckCheck, Info, Phone, Video } from "lucide-react";

const conversations = [
  { id: 1, name: "Aisha Malik", company: "NovaTech AI", plan: "$500", time: "5m ago", unread: 2, avatar: "AM", lastMsg: "Sure! I'd love to schedule a call.", unlocked: true, status: "online",
    messages: [
      { from: "me", text: "Hi Aisha! I found your profile on Founivo. Your experience with AI startups is exactly what I need.", time: "10:00 AM", seen: true },
      { from: "them", text: "Hi! Thanks for reaching out. What are you building?", time: "10:05 AM" },
      { from: "me", text: "I'm building a platform to connect startup founders with early users. Pre-seed stage.", time: "10:08 AM", seen: true },
      { from: "them", text: "That sounds really interesting! I'd love to hear more.", time: "10:12 AM" },
      { from: "me", text: "Would you be open to a 30-minute call this week?", time: "10:15 AM", seen: true },
      { from: "them", text: "Sure! I'd love to schedule a call.", time: "5m ago" },
    ]
  },
  { id: 2, name: "Carlos Rivera", company: "GreenPay", plan: "$500", time: "2h ago", unread: 0, avatar: "CR", lastMsg: "Let me know when you're free.", unlocked: true, status: "offline",
    messages: [
      { from: "them", text: "Hey! Saw you were interested in FinTech. Happy to connect.", time: "Yesterday" },
      { from: "me", text: "Yes! I'd love your perspective on payment APIs.", time: "Yesterday", seen: true },
      { from: "them", text: "Let me know when you're free.", time: "2h ago" },
    ]
  },
  { id: 3, name: "Priya Nair", company: "EduBridge", plan: "$200", time: "1d ago", unread: 0, avatar: "PN", lastMsg: "Upgrade to message me directly.", unlocked: false, status: "offline",
    messages: []
  },
];

export default function Messages() {
  const [selected, setSelected] = useState(conversations[0]);
  const [input, setInput] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, height: "calc(100vh - 84px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>Messages</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Manage your conversations with verified founders</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden", display: "grid", gridTemplateColumns: "320px 1fr", flex: 1, minHeight: 0 }}>
        {/* Contact List */}
        <div style={{ borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "var(--bg-soft)" }}>
          <div style={{ padding: "20px 16px", background: "#fff", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input className="input-field" placeholder="Search conversations..." style={{ paddingLeft: 40, height: 40, fontSize: 13, background: "var(--bg-soft)" }} />
            </div>
          </div>
          
          <div style={{ overflowY: "auto", flex: 1 }}>
            {conversations.map(conv => (
              <div 
                key={conv.id} 
                onClick={() => setSelected(conv)} 
                className={`msg-row ${selected.id === conv.id ? "active" : ""}`}
                style={{ 
                  padding: "16px", 
                  borderBottom: "1px solid var(--border)", 
                  cursor: "pointer", 
                  background: selected.id === conv.id ? "#fff" : "transparent",
                  borderLeft: selected.id === conv.id ? "4px solid var(--primary)" : "4px solid transparent",
                  transition: "all 0.2s",
                  display: "flex",
                  gap: 12,
                  borderRadius: 0
                }}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div className="avatar" style={{ width: 44, height: 44, fontSize: 14 }}>{conv.avatar}</div>
                  <div style={{ 
                    position: "absolute", 
                    bottom: 2, 
                    right: 2, 
                    width: 10, 
                    height: 10, 
                    background: conv.status === "online" ? "#22c55e" : "#94a3b8", 
                    borderRadius: "50%", 
                    border: "2px solid #fff" 
                  }} />
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conv.name}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{conv.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, marginBottom: 4 }}>{conv.company}</div>
                  <div style={{ 
                    fontSize: 13, 
                    color: conv.unread > 0 ? "var(--text)" : "var(--text-muted)", 
                    fontWeight: conv.unread > 0 ? 600 : 400,
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  }}>
                    {!conv.unlocked && <Lock size={12} />}
                    {conv.lastMsg}
                  </div>
                </div>
                
                {conv.unread > 0 && (
                  <div style={{ 
                    background: "var(--primary)", 
                    color: "white", 
                    borderRadius: 10, 
                    minWidth: 20, 
                    height: 20, 
                    padding: "0 6px",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: 11, 
                    fontWeight: 700, 
                    flexShrink: 0,
                    marginTop: 4
                  }}>
                    {conv.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ display: "flex", flexDirection: "column", background: "#fff", minWidth: 0 }}>
          {/* Header */}
          <div style={{ 
            padding: "16px 24px", 
            borderBottom: "1px solid var(--border)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            zIndex: 1,
            flexShrink: 0
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ position: "relative" }}>
                <div className="avatar" style={{ width: 48, height: 48, fontSize: 16 }}>{selected.avatar}</div>
                <div style={{ 
                  position: "absolute", 
                  bottom: 2, 
                  right: 2, 
                  width: 12, 
                  height: 12, 
                  background: selected.status === "online" ? "#22c55e" : "#94a3b8", 
                  borderRadius: "50%", 
                  border: "2px solid #fff" 
                }} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", fontFamily: "'Syne', sans-serif" }}>{selected.name}</span>
                  <span className={`badge-plan ${selected.plan === "$500" ? "badge-500" : "badge-200"}`} style={{ fontSize: 10 }}>{selected.plan} Plan</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 1 }}>{selected.company} · {selected.status === "online" ? "Active now" : "Last seen recently"}</div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ghost" style={{ padding: "10px", borderRadius: "12px" }}><Phone size={18} /></button>
              <button className="btn-ghost" style={{ padding: "10px", borderRadius: "12px" }}><Video size={18} /></button>
              <button className="btn-ghost" style={{ padding: "10px", borderRadius: "12px" }}><Info size={18} /></button>
              <button className="btn-ghost" style={{ padding: "10px", borderRadius: "12px" }}><MoreVertical size={18} /></button>
            </div>
          </div>

          {selected.unlocked ? (
            <>
              {/* Messages Body */}
              <div style={{ 
                flex: 1, 
                overflowY: "auto", 
                padding: "24px", 
                display: "flex", 
                flexDirection: "column", 
                gap: 20,
                background: "#f9fafb" 
              }}>
                {selected.messages.map((msg, i) => (
                  <div key={i} style={{ 
                    display: "flex", 
                    flexDirection: "column",
                    alignItems: msg.from === "me" ? "flex-end" : "flex-start",
                    gap: 6
                  }}>
                    <div style={{ 
                      maxWidth: "70%", 
                      padding: "12px 18px", 
                      borderRadius: msg.from === "me" ? "20px 20px 4px 20px" : "20px 20px 20px 4px", 
                      background: msg.from === "me" ? "var(--primary)" : "#fff", 
                      border: msg.from === "me" ? "none" : "1px solid var(--border)", 
                      fontSize: 14, 
                      color: msg.from === "me" ? "white" : "var(--text)", 
                      lineHeight: 1.6,
                      boxShadow: msg.from === "me" ? "0 4px 12px rgba(15,110,86,0.15)" : "0 2px 4px rgba(0,0,0,0.03)"
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 6,
                      fontSize: 11, 
                      color: "var(--text-muted)",
                      padding: "0 4px"
                    }}>
                      {msg.time}
                      {msg.from === "me" && (
                        <CheckCheck size={14} color={msg.seen ? "var(--primary)" : "var(--text-muted)"} />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border)", display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
                <button className="btn-ghost" style={{ padding: "10px", borderRadius: "12px", border: "none" }}><Paperclip size={20} /></button>
                <div style={{ flex: 1, position: "relative" }}>
                  <input 
                    className="input-field" 
                    placeholder="Type your message here..." 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    style={{ 
                      height: 50, 
                      paddingRight: 50, 
                      background: "var(--bg-soft)", 
                      border: "none",
                      borderRadius: "14px"
                    }} 
                  />
                  <button 
                    className="btn-primary" 
                    style={{ 
                      position: "absolute", 
                      right: 6, 
                      top: 6, 
                      bottom: 6, 
                      padding: "0 14px", 
                      borderRadius: "10px" 
                    }}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 60, background: "#f9fafb" }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                background: "var(--primary-xlight)", 
                borderRadius: "24px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(15,110,86,0.1)"
              }}>
                <Lock size={32} color="var(--primary)" />
              </div>
              <div style={{ textAlign: "center", maxWidth: 360 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 12, fontFamily: "'Syne', sans-serif" }}>Unlock Messaging</div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>You need to be on the <strong style={{ color: "var(--primary)" }}>$500 Connect Plan</strong> to start direct conversations with founders and request priority meetings.</div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn-outline" style={{ padding: "12px 24px" }}>View Plans</button>
                <button className="btn-primary" style={{ padding: "12px 24px" }}>Upgrade Now</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
