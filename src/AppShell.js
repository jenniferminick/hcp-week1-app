import { useState } from "react";
import Week1 from "./App";
import Week2 from "./Week2";

const SH_NAVY   = "#00182b";
const SH_YELLOW = "#FEB705";
const SH_WHITE  = "#FFFFFF";
const SH_GRAY   = "#94A3B8";
const SH_BG     = "#F1F5F9";
const RAIL_W    = 60;

const MODULES = [
  {
    id:       "w1",
    emoji:    "📘",
    label:    "Week 1",
    sublabel: "Facebook Organic",
    color:    "#002942",
    accent:   "#FEB705",
    status:   "active",
  },
  {
    id:       "w2",
    emoji:    "📗",
    label:    "Week 2",
    sublabel: "Nextdoor Organic",
    color:    "#0A2443",
    accent:   "#00B246",
    status:   "active",
  },
  // WEEK 3 — uncomment this when ready:
  // {
  //   id:       "w3",
  //   emoji:    "📙",
  //   label:    "Week 3",
  //   sublabel: "Google Reviews",
  //   color:    "#1a3a1a",
  //   accent:   "#4ade80",
  //   status:   "active",
  // },
];

function LandingPage({ onEnter }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: SH_BG,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: "'Inter',-apple-system,sans-serif",
    }}>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{
          background: SH_NAVY,
          borderRadius: 14,
          padding: "10px 24px",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}>
          <div style={{
            background: SH_YELLOW,
            borderRadius: 8,
            width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, color: SH_NAVY, fontSize: 16,
          }}>H</div>
          <span style={{ color: SH_WHITE, fontWeight: 700, fontSize: 15 }}>
            Business Coaching
          </span>
        </div>
        <h1 style={{ color: SH_NAVY, fontSize: 26, fontWeight: 900, margin:"0 0 8px" }}>
          Your Coaching Program
        </h1>
        <p style={{ color: SH_GRAY, fontSize: 14, margin: 0 }}>
          Pick a module to continue where you left off.
        </p>
      </div>

      <div style={{ display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center", maxWidth:640 }}>
        {MODULES.map(mod => {
          const isComingSoon = mod.status === "coming-soon";
          const isLocked     = mod.status === "locked";
          const disabled     = isComingSoon || isLocked;
          return (
            <button
              key={mod.id}
              onClick={() => !disabled && onEnter(mod.id)}
              style={{
                background:   disabled ? "#e2e8f0" : mod.color,
                border:       "none",
                borderRadius: 20,
                padding:      "28px 24px",
                cursor:       disabled ? "default" : "pointer",
                textAlign:    "left",
                width:        220,
                boxShadow:    disabled ? "none" : "0 8px 32px rgba(0,0,0,0.18)",
                opacity:      isLocked ? 0.5 : 1,
                transition:   "transform 0.15s",
              }}
              onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ fontSize:40, marginBottom:12 }}>{mod.emoji}</div>
              <div style={{
                fontWeight: 900, fontSize: 18,
                color: disabled ? "#94a3b8" : mod.accent,
              }}>
                {mod.label}
              </div>
              <div style={{
                fontWeight: 600, fontSize: 12,
                color: disabled ? "#94a3b8" : "rgba(255,255,255,0.65)",
                marginTop: 4, marginBottom: 14,
              }}>
                {mod.sublabel}
              </div>
              <div style={{
                fontSize: 12, fontWeight: 700,
                color: disabled ? "#94a3b8" : mod.accent,
              }}>
                {isComingSoon ? "Coming Soon" : isLocked ? "🔒 Locked" : "Enter →"}
              </div>
            </button>
          );
        })}
      </div>
      <p style={{ marginTop:28, fontSize:11, color:"#CBD5E1" }}>
        More modules unlock as your program progresses.
      </p>
    </div>
  );
}

function ModuleRail({ activeModule, onNavigate }) {
  return (
    <div style={{
      position:  "fixed",
      top: 0, left: 0, bottom: 0,
      width:     RAIL_W,
      background: SH_NAVY,
      zIndex:    500,
      display:   "flex",
      flexDirection: "column",
      alignItems:    "center",
      paddingTop:    12,
      gap:           6,
      boxShadow:     "2px 0 10px rgba(0,0,0,0.3)",
    }}>
      <button
        onClick={() => onNavigate("home")}
        title="All Modules"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "none", borderRadius: 10,
          width: 42, height: 42,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, color: SH_WHITE,
          marginBottom: 8,
        }}
      >⌂</button>

      <div style={{ width:30, height:1, background:"rgba(255,255,255,0.15)" }}/>

      {MODULES.map(mod => {
        const isActive = mod.id === activeModule;
        const isLocked = mod.status === "locked";
        return (
          <button
            key={mod.id}
            onClick={() => !isLocked && onNavigate(mod.id)}
            title={mod.label}
            style={{
              background:   isActive ? "rgba(255,255,255,0.14)" : "transparent",
              border:       isActive ? `2px solid ${mod.accent}` : "2px solid transparent",
              borderRadius: 10,
              width: 42, height: 42,
              cursor:   isLocked ? "default" : "pointer",
              display:  "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
              marginTop: 4,
              transition: "all 0.15s",
              opacity: isLocked ? 0.35 : 1,
            }}
          >
            {mod.emoji}
          </button>
        );
      })}
    </div>
  );
}

function renderModule(moduleId, onGoHome) {
  switch (moduleId) {
    case "w1": return <Week1 onGoHome={onGoHome} />;
    case "w2": return <Week2 onGoHome={onGoHome} />;
    // WEEK 3 — uncomment this when ready:
    // case "w3": return <Week3 onGoHome={onGoHome} />;
    default:   return null;
  }
}

export default function AppShell() {
  const [active, setActive] = useState(() => {
    try   { return localStorage.getItem("hbc_active_module") || "home"; }
    catch { return "home"; }
  });

  function navigate(dest) {
    setActive(dest);
    try { localStorage.setItem("hbc_active_module", dest); } catch {}
  }

  const inModule = active !== "home";

  return (
    <div style={{
      marginLeft:  inModule ? RAIL_W : 0,
      transition:  "margin-left 0.2s ease",
      minHeight:   "100vh",
    }}>
      {inModule && <ModuleRail activeModule={active} onNavigate={navigate} />}
      {active === "home"
        ? <LandingPage onEnter={navigate} />
        : renderModule(active, () => navigate("home"))
      }
    </div>
  );
}