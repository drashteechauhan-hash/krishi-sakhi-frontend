import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
const soilVideo = "https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486748/Soil_health_card_jnst9g.mp4";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const CROPS = [
  { name:"Rice",      nameML:"നെല്ല്",    nameHI:"धान",     icon:"🌾", defaults:{ N:80,  P:40, K:40, temperature:28, humidity:82, ph:6.5, rainfall:200 } },
  { name:"Wheat",     nameML:"ഗോതമ്പ്",   nameHI:"गेहूँ",   icon:"🌿", defaults:{ N:60,  P:50, K:40, temperature:22, humidity:65, ph:6.8, rainfall:100 } },
  { name:"Maize",     nameML:"ചോളം",      nameHI:"मक्का",   icon:"🌽", defaults:{ N:80,  P:40, K:40, temperature:24, humidity:65, ph:6.5, rainfall:80  } },
  { name:"Cotton",    nameML:"പരുത്തി",   nameHI:"कपास",    icon:"🌸", defaults:{ N:40,  P:30, K:20, temperature:32, humidity:55, ph:7.0, rainfall:70  } },
  { name:"Sugarcane", nameML:"കരിമ്പ്",   nameHI:"गन्ना",   icon:"🎋", defaults:{ N:120, P:50, K:80, temperature:28, humidity:75, ph:6.8, rainfall:180 } },
  { name:"Banana",    nameML:"വാഴ",       nameHI:"केला",    icon:"🍌", defaults:{ N:100, P:75, K:50, temperature:28, humidity:80, ph:6.0, rainfall:120 } },
  { name:"Mango",     nameML:"മാമ്പഴം",   nameHI:"आम",      icon:"🥭", defaults:{ N:40,  P:40, K:20, temperature:30, humidity:60, ph:6.5, rainfall:100 } },
  { name:"Tomato",    nameML:"തക്കാളി",   nameHI:"टमाटर",  icon:"🍅", defaults:{ N:80,  P:60, K:50, temperature:24, humidity:65, ph:6.2, rainfall:100 } },
];

const FIELDS = [
  {
    key:"N", min:0, max:200, step:1,
    en:{ label:"Nitrogen (N)", unit:"kg/ha", hint:"Leaf growth & greening",
         tip:"Nitrogen makes leaves green and helps the plant grow tall. Your soil test report shows this number." },
    ml:{ label:"നൈട്രജൻ (N)", unit:"kg/ha", hint:"ഇലകളുടെ വളർച്ചയ്ക്ക്",
         tip:"നൈട്രജൻ ഇലകളെ പച്ചയാക്കുകയും ചെടി നന്നായി വളരാൻ സഹായിക്കുകയും ചെയ്യുന്നു." },
    hi:{ label:"नाइट्रोजन (N)", unit:"kg/ha", hint:"पत्ती की वृद्धि के लिए",
         tip:"नाइट्रोजन से पत्तियाँ हरी होती हैं और पौधा अच्छे से बढ़ता है।" },
  },
  {
    key:"P", min:0, max:150, step:1,
    en:{ label:"Phosphorus (P)", unit:"kg/ha", hint:"Root strength & flowering",
         tip:"Phosphorus helps roots grow deep and the plant to flower and produce fruit." },
    ml:{ label:"ഫോസ്ഫറസ് (P)", unit:"kg/ha", hint:"വേരിന്റെ ഉറപ്പിന്",
         tip:"ഫോസ്ഫറസ് വേരുകൾ ആഴത്തിൽ വളരാൻ, പൂക്കൾ ഉണ്ടാകാൻ സഹായിക്കുന്നു." },
    hi:{ label:"फास्फोरस (P)", unit:"kg/ha", hint:"जड़ की मजबूती के लिए",
         tip:"फास्फोरस से जड़ें गहरी होती हैं और फूल व फल अच्छे आते हैं।" },
  },
  {
    key:"K", min:0, max:210, step:1,
    en:{ label:"Potassium (K)", unit:"kg/ha", hint:"Disease resistance & fruit size",
         tip:"Potassium (Potash) helps the plant fight diseases and makes fruit bigger and tastier." },
    ml:{ label:"പൊട്ടാഷ്യം (K)", unit:"kg/ha", hint:"രോഗ പ്രതിരോധത്തിന്",
         tip:"പൊട്ടാഷ്യം (Potash) ചെടിയെ രോഗങ്ങളിൽ നിന്ന് സംരക്ഷിക്കുകയും പഴങ്ങൾ വലുതാക്കുകയും ചെയ്യുന്നു." },
    hi:{ label:"पोटाश (K)", unit:"kg/ha", hint:"रोग प्रतिरोध के लिए",
         tip:"पोटाश से पौधा बीमारियों से बचता है और फल बड़े व स्वादिष्ट होते हैं।" },
  },
  {
    key:"temperature", min:5, max:50, step:0.5,
    en:{ label:"Temperature", unit:"°C", hint:"Average day temperature",
         tip:"Enter the average temperature in your area. If unsure, use the default — it's set for your region." },
    ml:{ label:"താപനില", unit:"°C", hint:"ശരാശരി ദിവസ താപനില",
         tip:"നിങ്ങളുടെ പ്രദേശത്തെ ശരാശരി ചൂട്. ഉറപ്പില്ലെങ്കിൽ default ഉപയോഗിക്കുക." },
    hi:{ label:"तापमान", unit:"°C", hint:"औसत दिन का तापमान",
         tip:"अपने क्षेत्र का औसत तापमान डालें। अगर पता नहीं है तो default रखें।" },
  },
  {
    key:"humidity", min:10, max:100, step:1,
    en:{ label:"Humidity", unit:"%", hint:"Air moisture %",
         tip:"How humid (moist) the air is. If unsure, leave the default value." },
    ml:{ label:"ഈർപ്പം", unit:"%", hint:"വായുവിലെ ഈർപ്പം %",
         tip:"വായുവിൽ എത്ര ഈർപ്പം ഉണ്ടെന്ന് %. ഉറപ്പില്ലെങ്കിൽ default ഉപയോഗിക്കുക." },
    hi:{ label:"नमी (Humidity)", unit:"%", hint:"हवा की नमी %",
         tip:"हवा में कितनी नमी है। अगर पता नहीं है तो default रखें।" },
  },
  {
    key:"ph", min:0, max:14, step:0.1,
    en:{ label:"Soil pH", unit:"", hint:"Acidity / Alkalinity (ideal: 6–7.5)",
         tip:"pH tells how acidic or alkaline your soil is. Perfect range is 6 to 7.5. Your soil test report will have this number." },
    ml:{ label:"pH അളവ്", unit:"", hint:"0–14 (6 മുതൽ 7.5 ഉത്തമം)",
         tip:"pH = മണ്ണ് എത്ര ആസിഡ് ആണോ ക്ഷാരം ആണോ. 6–7.5 ഏറ്റവും നല്ല range ആണ്. Soil test sheet-ൽ ഇത് ഉണ്ടാകും." },
    hi:{ label:"pH मान", unit:"", hint:"0–14 (6–7.5 सबसे अच्छा)",
         tip:"pH बताता है मिट्टी कितनी खट्टी या क्षारीय है। 6 से 7.5 सबसे अच्छा है। soil test report में यह नंबर होता है।" },
  },
  {
    key:"rainfall", min:10, max:3000, step:10,
    en:{ label:"Rainfall", unit:"mm/yr", hint:"Annual rainfall in your area",
         tip:"How much rain your area gets in a year. If unsure, your local agriculture office can tell you." },
    ml:{ label:"മഴ", unit:"mm/yr", hint:"വർഷ മഴ (mm)",
         tip:"ഒരു വർഷം നിങ്ങളുടെ ഗ്രാമത്തിൽ എത്ര mm മഴ ലഭിക്കുന്നു. കൃഷി ഓഫീസിൽ ചോദിക്കാം." },
    hi:{ label:"वर्षा", unit:"mm/yr", hint:"सालाना बारिश (mm)",
         tip:"आपके क्षेत्र में सालाना कितनी बारिश होती है। नहीं पता तो कृषि कार्यालय से पूछें।" },
  },
];

const HEALTH_STYLE = {
  Good:   { bg:"#f0fff4", color:"#166534", label:"Good ✅",   bar:"#22c55e" },
  Medium: { bg:"#fffbeb", color:"#92400e", label:"Medium ⚠️", bar:"#f59e0b" },
  Poor:   { bg:"#fff1f2", color:"#9f1239", label:"Poor 🔴",   bar:"#ef4444" },
};

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{val}</span>;
}

// ─── HEALTH BAR ───────────────────────────────────────────────────────────────
function HealthBar({ status, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const hs = HEALTH_STYLE[status] || HEALTH_STYLE.Good;
  const pct = status === "Good" ? 90 : status === "Medium" ? 55 : 25;
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay + 100);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{ background:"#e2e8f0", borderRadius:6, height:6, overflow:"hidden", marginTop:6 }}>
      <div style={{
        height:"100%", borderRadius:6, background:hs.bar,
        width:`${width}%`, transition:"width 1s cubic-bezier(.4,0,.2,1)"
      }}/>
    </div>
  );
}

// ─── FLOATING PARTICLE ────────────────────────────────────────────────────────
function Particles() {
  const particles = ["🌱","🍀","✨","🌿","💧","☀️"];
  return (
    <div style={{ position:"fixed", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position:"absolute",
          left:`${15 + i * 15}%`,
          fontSize: i % 2 === 0 ? 16 : 12,
          opacity: 0.08,
          animation: `shc2float ${4 + i}s ease-in-out infinite`,
          animationDelay: `${i * 0.7}s`,
          top: `${10 + i * 12}%`,
        }}>{p}</div>
      ))}
    </div>
  );
}

// ─── VIDEO GUIDE CARD ─────────────────────────────────────────────────────────
function VideoGuideCard() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const videoRef = useRef(null);
  const handleToggle = () => {
    if (open) { videoRef.current?.pause(); }
    setOpen(v => !v);
  };
  return (
    <div className="shc2-video-card">
      <div className="shc2-video-banner" onClick={handleToggle}>
        <div className="shc2-video-play-wrap">
          <div className={`shc2-video-play-ring ${open ? "open" : ""}`}>
            <span className="shc2-video-play-icon">{open ? "⏸" : "▶"}</span>
          </div>
        </div>
        <div className="shc2-video-banner-text">
          <div className="shc2-video-badge">{t("soil_video_badge")}</div>
          <div className="shc2-video-title">{t("soil_video_title")}</div>
          <div className="shc2-video-sub">{t("soil_video_sub")}</div>
        </div>
        <div className={`shc2-video-chev ${open ? "open" : ""}`}>›</div>
      </div>
      <div className={`shc2-video-body ${open ? "open" : ""}`}>
        <div className="shc2-video-player-wrap">
          <video ref={videoRef} src={soilVideo} controls preload="metadata" className="shc2-video-player" />
        </div>
        <div className="shc2-video-footer">
          <span className="shc2-video-footer-dot" />
          <span className="shc2-video-footer-txt">{t("soil_video_tip")}</span>
          <button className="shc2-video-close-btn" onClick={handleToggle}>{t("soil_video_close")} ✕</button>
        </div>
      </div>
    </div>
  );
}

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
function LoadingScreen({ lang }) {
  const msgs = {
    ml: ["🔬 AI വിശകലനം ചെയ്യുന്നു...", "🌱 മണ്ണ് മനസ്സിലാക്കുന്നു...", "📊 ഫലം തയ്യാറാക്കുന്നു..."],
    hi: ["🔬 AI विश्लेषण हो रहा है...", "🌱 मिट्टी समझ रहे हैं...", "📊 परिणाम तैयार हो रहा है..."],
    en: ["🔬 AI is analyzing...", "🌱 Understanding your soil...", "📊 Preparing results..."],
  };
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % 3), 900);
    return () => clearInterval(t);
  }, []);
  const list = msgs[lang] || msgs.en;
  return (
    <div className="shc2-loading-screen">
      <div className="shc2-loading-orb">
        <div className="shc2-loading-ring r1"/>
        <div className="shc2-loading-ring r2"/>
        <div className="shc2-loading-ring r3"/>
        <span className="shc2-loading-icon">🌱</span>
      </div>
      <div className="shc2-loading-msg">{list[idx]}</div>
      <div className="shc2-loading-dots">
        <span/><span/><span/>
      </div>
    </div>
  );
}

// ─── RESULT CARD ──────────────────────────────────────────────────────────────
function ResultCard({ result, values, lang, t, onReset }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const tm = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(tm);
  }, []);

  const healthStyle = (s) => HEALTH_STYLE[s] || HEALTH_STYLE.Good;

  return (
    <div className={`shc2-result-wrapper ${visible ? "in" : ""}`}>

      {/* ── HERO RESULT ── */}
      <div className="shc2-hero-card">
        <div className="shc2-hero-glow"/>
        <div className="shc2-hero-top">
          <div className="shc2-hero-badge">
            {lang==="ml"?"✅ AI ശുപാർശ":lang==="hi"?"✅ AI सिफारिश":"✅ AI Recommendation"}
          </div>
        </div>
        <div className="shc2-hero-body">
          <div className="shc2-hero-icon-wrap">
            <div className="shc2-hero-icon-ring">
              <span className="shc2-hero-icon">{result.crop_icon}</span>
            </div>
          </div>
          <div className="shc2-hero-info">
            <div className="shc2-hero-crop">{result.recommended_crop}</div>
            <div className="shc2-conf-row">
              <span className="shc2-conf-label">{t("soil_confidence")}</span>
              <span className="shc2-conf-val">
                <AnimatedNumber target={Math.round(result.confidence)} />%
              </span>
            </div>
            <div className="shc2-conf-track">
              <div className="shc2-conf-fill" style={{ width:`${result.confidence}%` }}/>
            </div>
            {result.alternatives?.length > 0 && (
              <div className="shc2-alt-row">
                <span className="shc2-alt-label">{t("soil_also")}:</span>
                {result.alternatives.map(a => (
                  <span key={a} className="shc2-chip">
                    {CROPS.find(c=>c.name.toLowerCase()===a)?.icon||"🌱"} {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── WHY THIS CROP ── */}
      <div className="shc2-info-panel shc2-panel-amber shc2-anim-slide" style={{animationDelay:"0.1s"}}>
        <div className="shc2-panel-icon">💡</div>
        <div>
          <div className="shc2-panel-title">{t("soil_why")}</div>
          <div className="shc2-panel-body">{result.explanation}</div>
        </div>
      </div>

      {/* ── FERTILIZER ── */}
      <div className="shc2-info-panel shc2-panel-blue shc2-anim-slide" style={{animationDelay:"0.18s"}}>
        <div className="shc2-panel-icon">🌿</div>
        <div>
          <div className="shc2-panel-title">{t("soil_fert")}</div>
          <div className="shc2-panel-body">{result.fertilizer_tip}</div>
        </div>
      </div>

      {/* ── SOIL HEALTH ── */}
      <div className="shc2-card shc2-anim-slide" style={{animationDelay:"0.26s"}}>
        <div className="shc2-card-title">📊 {t("soil_health")}</div>
        <div className="shc2-health-list">
          {[
            { key:"overall",    icon:"🌍", label:t("soil_overall") },
            { key:"ph",         icon:"🧪", label:"pH" },
            { key:"nitrogen",   icon:"🌿", label:lang==="ml"?"നൈട്രജൻ":lang==="hi"?"नाइट्रोजन":"Nitrogen" },
            { key:"phosphorus", icon:"🌱", label:lang==="ml"?"ഫോസ്ഫറസ്":lang==="hi"?"फास्फोरस":"Phosphorus" },
            { key:"potassium",  icon:"💪", label:lang==="ml"?"പൊട്ടാഷ്":lang==="hi"?"पोटाश":"Potassium" },
          ].map((item, i) => {
            const s = result.soil_health?.[item.key];
            const hs = healthStyle(s);
            return (
              <div key={item.key} className="shc2-health-row" style={{ background: hs.bg }}>
                <span className="shc2-health-row-icon">{item.icon}</span>
                <div style={{ flex:1 }}>
                  <div className="shc2-health-row-label" style={{ color: hs.color }}>{item.label}</div>
                  <HealthBar status={s} delay={i * 120} />
                </div>
                <span className="shc2-health-status" style={{ color: hs.color, background: hs.bg }}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── INPUT SUMMARY ── */}
      <div className="shc2-card shc2-anim-slide" style={{animationDelay:"0.34s"}}>
        <div className="shc2-card-title">📋 {t("soil_info_title")}</div>
        <div className="shc2-info-grid">
          {FIELDS.map(f => {
            const lf = f[lang] || f.en;
            const v = values[f.key];
            const displayVal = f.step < 1 ? Number(v).toFixed(1) : Math.round(v);
            return (
              <div key={f.key} className="shc2-info-cell">
                <div className="shc2-info-key">{lf.label}</div>
                <div className="shc2-info-val">{displayVal}<span style={{fontSize:10,color:"#9ca3af",marginLeft:2}}>{lf.unit}</span></div>
                <div className="shc2-info-desc">{lf.hint}</div>
              </div>
            );
          })}
        </div>
      </div>

      <button className="shc2-btn-reset shc2-anim-slide" style={{animationDelay:"0.42s"}} onClick={onReset}>
        🔄 {t("soil_new_test")}
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SoilHealthCardAI() {
  const { t, lang } = useLanguage();

  const [step, setStep]       = useState(1);
  const [crop, setCrop]       = useState(null);
  const [values, setValues]   = useState({});
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [openTip, setOpenTip] = useState(null);

  const handleCropSelect = (c) => {
    setCrop(c);
    setValues({ ...c.defaults });
    setStep(2);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://soil-prediction-api-1.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setResult(data);
      setStep(3);
    } catch {
      setError(
        lang === "ml" ? "❌ ബന്ധം ലഭ്യമല്ല. വീണ്ടും ശ്രമിക്കുക." :
        lang === "hi" ? "❌ सर्वर से जुड़ नहीं सका। फिर कोशिश करें।" :
        "❌ Could not reach the AI server. Please try again."
      );
    }
    setLoading(false);
  };

  const handleReset = () => {
    setStep(1); setCrop(null); setResult(null); setError("");
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');

        .shc2 * { box-sizing:border-box; margin:0; padding:0; }
        .shc2 {
          font-family:'Noto Sans Malayalam','Noto Sans Devanagari','Segoe UI',sans-serif;
          background:#f4f1eb;
          min-height:100vh;
          color:#111;
          position:relative;
        }

        /* ── TOP BAR ── */
        .shc2-bar {
          background:linear-gradient(135deg,#1a5c38,#2d8653);
          padding:14px 18px;
          display:flex; align-items:center; justify-content:space-between;
          position:sticky; top:0; z-index:50;
          box-shadow:0 4px 20px rgba(26,92,56,0.35);
        }
        .shc2-logo { display:flex; align-items:center; gap:10px; }
        .shc2-logo-icon {
          width:40px; height:40px;
          background:rgba(255,255,255,0.18);
          border-radius:12px;
          display:flex; align-items:center; justify-content:center;
          font-size:22px;
          animation:shc2breathe 3s ease-in-out infinite;
        }
        @keyframes shc2breathe {
          0%,100%{ transform:scale(1); }
          50%{ transform:scale(1.08); }
        }
        .shc2-logo-text { color:white; font-size:16px; font-weight:700; line-height:1.1; }
        .shc2-logo-sub  { color:rgba(255,255,255,0.7); font-size:11px; }
        .shc2-langs { display:flex; gap:3px; background:rgba(0,0,0,0.2); padding:3px; border-radius:20px; }
        .shc2-lb { border:none; background:transparent; color:rgba(255,255,255,0.6); font-size:12px; font-weight:700; padding:5px 11px; border-radius:16px; cursor:pointer; font-family:inherit; transition:all .2s; }
        .shc2-lb.active { background:white; color:#1a5c38; }

        /* ── BODY ── */
        .shc2-body { max-width:660px; margin:0 auto; padding:16px 14px 60px; position:relative; z-index:1; }

        /* ── STEP PILLS ── */
        .shc2-steps { display:flex; gap:6px; margin-bottom:16px; flex-wrap:wrap; }
        .shc2-sp {
          font-size:12px; font-weight:700;
          padding:5px 14px; border-radius:20px;
          border:1.5px solid #e5e7eb; color:#9ca3af; background:white;
          transition:all .35s cubic-bezier(.4,0,.2,1);
        }
        .shc2-sp.done { background:#1a5c38; color:white; border-color:#1a5c38; transform:scale(1.04); }
        .shc2-sp.active { background:#fef3c7; color:#92400e; border-color:#f59e0b; transform:scale(1.06); box-shadow:0 2px 12px rgba(245,158,11,0.25); }

        /* ── CARDS ── */
        .shc2-card {
          background:white;
          border-radius:18px; padding:18px;
          margin-bottom:14px;
          border:1.5px solid #d4edda;
          box-shadow:0 2px 12px rgba(26,92,56,0.06);
          transition:box-shadow .25s;
        }
        .shc2-card:hover { box-shadow:0 6px 24px rgba(26,92,56,0.11); }
        .shc2-card-title { font-size:16px; font-weight:700; color:#1a5c38; margin-bottom:3px; }
        .shc2-card-sub   { font-size:12px; color:#6b7280; margin-bottom:14px; }

        /* ── CROP GRID ── */
        .shc2-crop-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:9px; }
        @media(max-width:380px){ .shc2-crop-grid { grid-template-columns:repeat(2,1fr); } }
        .shc2-cb {
          display:flex; flex-direction:column; align-items:center; gap:3px;
          padding:12px 6px; border-radius:12px;
          border:2px solid #e5e7eb; background:white;
          cursor:pointer; font-family:inherit;
          transition:all .22s cubic-bezier(.4,0,.2,1);
          position:relative; overflow:hidden;
        }
        .shc2-cb::after {
          content:""; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(26,92,56,0.04),transparent);
          opacity:0; transition:opacity .2s;
        }
        .shc2-cb:hover { border-color:#2d8653; transform:translateY(-2px); box-shadow:0 4px 14px rgba(26,92,56,0.15); }
        .shc2-cb:hover::after { opacity:1; }
        .shc2-cb.active { border-color:#1a5c38; background:#f0fff4; box-shadow:0 4px 16px rgba(26,92,56,0.2); }
        .shc2-cb:active { transform:scale(0.93); }
        .shc2-ci { font-size:26px; transition:transform .2s; }
        .shc2-cb:hover .shc2-ci { transform:scale(1.15) rotate(-3deg); }
        .shc2-cb.active .shc2-ci { transform:scale(1.1); }
        .shc2-cn { font-size:11px; font-weight:700; color:#374151; margin-top:2px; }
        .shc2-cb.active .shc2-cn { color:#1a5c38; }

        /* ── FIELD / SLIDER ── */
        .shc2-field { margin-bottom:22px; }
        .shc2-field-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:7px; }
        .shc2-flabel { font-size:15px; font-weight:700; display:flex; align-items:center; gap:7px; }
        .shc2-fhint  { font-size:11px; color:#9ca3af; margin-top:1px; }
        .shc2-fval   { font-size:24px; font-weight:800; color:#1a5c38; white-space:nowrap; transition:transform .15s; }
        .shc2-funit  { font-size:11px; color:#9ca3af; margin-left:2px; font-weight:400; }
        .shc2-tip-btn {
          width:18px; height:18px; border-radius:50%;
          background:#e5e7eb; border:none; cursor:pointer;
          font-size:10px; font-weight:700; color:#6b7280;
          display:inline-flex; align-items:center; justify-content:center;
          flex-shrink:0; transition:all .2s;
        }
        .shc2-tip-btn:hover { background:#1a5c38; color:white; transform:scale(1.15); }
        .shc2-tip-box {
          background:#1f2937; color:#f0fdf4;
          font-size:13px; padding:11px 14px;
          border-radius:10px; margin-bottom:10px;
          line-height:1.55;
          animation:shc2tipIn .2s ease;
        }
        @keyframes shc2tipIn {
          from{ opacity:0; transform:translateY(-4px); }
          to{ opacity:1; transform:translateY(0); }
        }
        input[type=range].shc2-slider {
          width:100%; height:8px; appearance:none;
          border-radius:8px; outline:none; cursor:pointer;
          transition:height .15s;
        }
        input[type=range].shc2-slider:hover { height:10px; }
        input[type=range].shc2-slider::-webkit-slider-thumb {
          appearance:none; width:26px; height:26px;
          border-radius:50%; background:white;
          border:3px solid #1a5c38;
          box-shadow:0 2px 8px rgba(26,92,56,0.3);
          cursor:pointer; transition:transform .15s, box-shadow .15s;
        }
        input[type=range].shc2-slider::-webkit-slider-thumb:hover {
          transform:scale(1.2);
          box-shadow:0 4px 16px rgba(26,92,56,0.4);
        }

        /* ── LOADING ── */
        .shc2-loading-screen {
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; padding:48px 20px;
          gap:18px;
        }
        .shc2-loading-orb {
          position:relative; width:90px; height:90px;
          display:flex; align-items:center; justify-content:center;
        }
        .shc2-loading-ring {
          position:absolute; border-radius:50%;
          border:2px solid transparent;
          border-top-color:#1a5c38;
        }
        .r1 { width:90px; height:90px; animation:shc2spin 1.2s linear infinite; }
        .r2 { width:68px; height:68px; animation:shc2spin 1.8s linear infinite reverse; border-top-color:#2d8653; opacity:.6; }
        .r3 { width:48px; height:48px; animation:shc2spin 2.4s linear infinite; border-top-color:#4ade80; opacity:.4; }
        @keyframes shc2spin { to{ transform:rotate(360deg); } }
        .shc2-loading-icon { font-size:28px; animation:shc2breathe 1.5s ease-in-out infinite; }
        .shc2-loading-msg { font-size:15px; font-weight:600; color:#1a5c38; text-align:center; min-height:24px; }
        .shc2-loading-dots { display:flex; gap:6px; }
        .shc2-loading-dots span {
          width:8px; height:8px; border-radius:50%; background:#1a5c38;
          animation:shc2bounce 1s ease-in-out infinite;
        }
        .shc2-loading-dots span:nth-child(2){ animation-delay:.15s; opacity:.7; }
        .shc2-loading-dots span:nth-child(3){ animation-delay:.3s; opacity:.4; }
        @keyframes shc2bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

        /* ── BUTTONS ── */
        .shc2-btn-primary {
          width:100%; padding:16px;
          border-radius:14px; border:none;
          background:linear-gradient(135deg,#1a5c38,#2d8653);
          color:white; font-size:17px; font-weight:700;
          font-family:inherit; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:9px;
          margin-top:16px;
          transition:all .22s;
          box-shadow:0 4px 16px rgba(26,92,56,0.3);
          position:relative; overflow:hidden;
        }
        .shc2-btn-primary::after {
          content:""; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.12),transparent);
          opacity:0; transition:opacity .2s;
        }
        .shc2-btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(26,92,56,0.38); }
        .shc2-btn-primary:hover::after { opacity:1; }
        .shc2-btn-primary:active { transform:scale(0.97); }
        .shc2-btn-primary:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .shc2-btn-reset {
          width:100%; padding:13px;
          border-radius:12px; border:1.5px solid #e5e7eb;
          background:white; color:#6b7280;
          font-size:14px; font-weight:700;
          font-family:inherit; cursor:pointer;
          margin-top:10px; transition:all .2s;
        }
        .shc2-btn-reset:hover { border-color:#1a5c38; color:#1a5c38; background:#f0fff4; }
        .shc2-error {
          padding:14px; background:#fff1f2;
          border-radius:12px; color:#9f1239;
          font-size:14px; font-weight:600;
          margin-bottom:12px; text-align:center;
          border:1.5px solid #fecdd3;
          animation:shc2tipIn .25s ease;
        }

        /* ── VIDEO CARD ── */
        .shc2-video-card { border-radius:18px; overflow:hidden; margin-bottom:14px; border:1.5px solid #a7f3d0; background:white; }
        .shc2-video-banner { display:flex; align-items:center; gap:14px; padding:14px 16px; cursor:pointer; background:linear-gradient(135deg,#064e3b,#065f46,#047857); user-select:none; transition:opacity .15s; }
        .shc2-video-banner:active { opacity:.88; }
        .shc2-video-play-wrap { flex-shrink:0; }
        .shc2-video-play-ring { width:46px; height:46px; border-radius:50%; border:2.5px solid rgba(255,255,255,0.5); display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.12); transition:all .25s; }
        .shc2-video-play-ring.open { background:rgba(255,255,255,0.22); border-color:rgba(255,255,255,0.8); }
        .shc2-video-play-icon { font-size:18px; color:white; margin-left:2px; }
        .shc2-video-play-ring.open .shc2-video-play-icon { margin-left:0; }
        .shc2-video-banner-text { flex:1; min-width:0; }
        .shc2-video-badge { display:inline-block; background:rgba(255,255,255,0.18); color:rgba(255,255,255,0.9); font-size:9px; font-weight:800; letter-spacing:1.2px; padding:2px 8px; border-radius:20px; margin-bottom:5px; border:1px solid rgba(255,255,255,0.25); }
        .shc2-video-title { color:white; font-size:15px; font-weight:700; line-height:1.2; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .shc2-video-sub { color:rgba(255,255,255,0.65); font-size:11px; }
        .shc2-video-chev { color:rgba(255,255,255,0.7); font-size:26px; font-weight:300; flex-shrink:0; transition:transform .3s ease; line-height:1; }
        .shc2-video-chev.open { transform:rotate(90deg); }
        .shc2-video-body { max-height:0; overflow:hidden; transition:max-height .45s cubic-bezier(.4,0,.2,1); }
        .shc2-video-body.open { max-height:520px; }
        .shc2-video-player-wrap { background:#000; line-height:0; }
        .shc2-video-player { width:100%; max-height:280px; object-fit:contain; display:block; background:#000; }
        .shc2-video-footer { display:flex; align-items:center; gap:8px; padding:10px 14px; background:#ecfdf5; border-top:1px solid #d1fae5; }
        .shc2-video-footer-dot { width:7px; height:7px; border-radius:50%; background:#10b981; flex-shrink:0; animation:shc2pulse 1.8s infinite; }
        @keyframes shc2pulse { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:.5; transform:scale(0.8); } }
        .shc2-video-footer-txt { flex:1; font-size:12px; color:#065f46; font-weight:600; }
        .shc2-video-close-btn { border:none; background:#d1fae5; color:#065f46; font-size:11px; font-weight:700; padding:5px 10px; border-radius:20px; cursor:pointer; font-family:inherit; flex-shrink:0; transition:background .2s; }
        .shc2-video-close-btn:active { background:#a7f3d0; }

        /* ── RESULT WRAPPER ── */
        .shc2-result-wrapper { opacity:0; transform:translateY(16px); transition:all .45s cubic-bezier(.4,0,.2,1); }
        .shc2-result-wrapper.in { opacity:1; transform:translateY(0); }

        /* ── HERO CARD ── */
        .shc2-hero-card {
          background:linear-gradient(145deg,#1a5c38,#2d8653,#166534);
          border-radius:20px; padding:20px;
          margin-bottom:14px; position:relative; overflow:hidden;
          box-shadow:0 8px 32px rgba(26,92,56,0.38);
        }
        .shc2-hero-glow {
          position:absolute; top:-40px; right:-40px;
          width:140px; height:140px; border-radius:50%;
          background:rgba(255,255,255,0.08);
          pointer-events:none;
        }
        .shc2-hero-top { margin-bottom:16px; }
        .shc2-hero-badge {
          display:inline-flex; align-items:center;
          background:rgba(255,255,255,0.15);
          border:1px solid rgba(255,255,255,0.25);
          color:rgba(255,255,255,0.92);
          font-size:11px; font-weight:700;
          padding:4px 12px; border-radius:20px;
          letter-spacing:.5px;
        }
        .shc2-hero-body { display:flex; gap:16px; align-items:center; }
        .shc2-hero-icon-ring {
          width:78px; height:78px; border-radius:50%;
          background:rgba(255,255,255,0.14);
          border:2px solid rgba(255,255,255,0.3);
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0;
          animation:shc2breathe 3s ease-in-out infinite;
          box-shadow:0 0 0 6px rgba(255,255,255,0.05);
        }
        .shc2-hero-icon { font-size:40px; }
        .shc2-hero-info { flex:1; }
        .shc2-hero-crop { font-size:28px; font-weight:800; color:white; text-transform:capitalize; line-height:1.1; margin-bottom:6px; }
        .shc2-conf-row { display:flex; justify-content:space-between; align-items:center; }
        .shc2-conf-label { font-size:12px; color:rgba(255,255,255,0.7); }
        .shc2-conf-val { font-size:20px; font-weight:800; color:#4ade80; }
        .shc2-conf-track { background:rgba(255,255,255,0.2); border-radius:8px; height:8px; margin:6px 0 10px; overflow:hidden; }
        .shc2-conf-fill { height:100%; background:linear-gradient(90deg,#4ade80,#86efac); border-radius:8px; transition:width 1.4s cubic-bezier(.4,0,.2,1); }
        .shc2-alt-row { display:flex; align-items:center; flex-wrap:wrap; gap:5px; }
        .shc2-alt-label { font-size:11px; color:rgba(255,255,255,0.6); margin-right:2px; }
        .shc2-chip { font-size:11px; font-weight:700; padding:3px 11px; border-radius:20px; background:rgba(255,255,255,0.15); color:rgba(255,255,255,0.88); }

        /* ── INFO PANELS ── */
        .shc2-info-panel {
          display:flex; gap:12px; align-items:flex-start;
          border-radius:0 14px 14px 0; padding:14px 16px;
          margin-bottom:12px;
        }
        .shc2-panel-amber { background:#fffbeb; border-left:4px solid #f59e0b; }
        .shc2-panel-blue  { background:#eff6ff; border-left:4px solid #2563eb; }
        .shc2-panel-icon { font-size:22px; flex-shrink:0; margin-top:1px; }
        .shc2-panel-title { font-size:14px; font-weight:700; color:#78350f; margin-bottom:4px; }
        .shc2-panel-blue .shc2-panel-title { color:#1d4ed8; }
        .shc2-panel-body { font-size:14px; color:#78350f; line-height:1.6; }
        .shc2-panel-blue .shc2-panel-body { color:#1e3a8a; }

        /* ── HEALTH LIST ── */
        .shc2-health-list { display:flex; flex-direction:column; gap:8px; margin-top:12px; }
        .shc2-health-row {
          display:flex; align-items:center; gap:10px;
          padding:10px 14px; border-radius:12px;
          transition:transform .2s;
        }
        .shc2-health-row:hover { transform:translateX(4px); }
        .shc2-health-row-icon { font-size:20px; flex-shrink:0; }
        .shc2-health-row-label { font-size:13px; font-weight:700; }
        .shc2-health-status { font-size:12px; font-weight:700; padding:3px 10px; border-radius:20px; flex-shrink:0; border:1px solid currentColor; }

        /* ── INFO GRID ── */
        .shc2-info-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; margin-top:12px; }
        .shc2-info-cell { background:#f9fafb; border-radius:10px; padding:10px; transition:background .2s; }
        .shc2-info-cell:hover { background:#f0fff4; }
        .shc2-info-key { font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:.5px; }
        .shc2-info-val { font-size:18px; font-weight:700; color:#1a5c38; margin:2px 0 1px; }
        .shc2-info-desc { font-size:11px; color:#6b7280; }

        /* ── SLIDE IN ANIMATION ── */
        .shc2-anim-slide {
          animation:shc2slideUp .4s ease both;
        }
        @keyframes shc2slideUp {
          from{ opacity:0; transform:translateY(18px); }
          to{ opacity:1; transform:translateY(0); }
        }

        /* ── FLOATING PARTICLES ── */
        @keyframes shc2float {
          0%,100%{ transform:translateY(0) rotate(0deg); }
          33%{ transform:translateY(-18px) rotate(8deg); }
          66%{ transform:translateY(-8px) rotate(-5deg); }
        }
      `}</style>

      <div className="shc2">
        <Particles />

        {/* TOP BAR */}
        <div className="shc2-bar">
          <div className="shc2-logo">
            <div className="shc2-logo-icon">🌱</div>
            <div>
              <div className="shc2-logo-text">{t("soil_app_name")}</div>
              <div className="shc2-logo-sub">{t("soil_app_sub")}</div>
            </div>
          </div>
        </div>

        <div className="shc2-body">
          {/* STEP PILLS */}
          <div className="shc2-steps">
            <div className={`shc2-sp${step>1?" done":step===1?" active":""}`}>
              {step>1?"✓ ":""}{lang==="ml"?"വിള":lang==="hi"?"फसल":"Crop"}
            </div>
            <div className={`shc2-sp${step>2?" done":step===2?" active":""}`}>
              {step>2?"✓ ":""}{lang==="ml"?"മണ്ണ്":lang==="hi"?"मिट्टी":"Soil"}
            </div>
            <div className={`shc2-sp${step===3?" active":""}`}>
              {lang==="ml"?"ഫലം":lang==="hi"?"परिणाम":"Result"}
            </div>
          </div>

          {/* VIDEO GUIDE */}
          <VideoGuideCard />

          {/* STEP 1: CROP */}
          <div className="shc2-card">
            <div className="shc2-card-title">1️⃣ {t("soil_step1")}</div>
            <div className="shc2-card-sub">{t("soil_step1_sub")}</div>
            <div className="shc2-crop-grid">
              {CROPS.map(c => (
                <button key={c.name}
                  className={`shc2-cb${crop?.name===c.name?" active":""}`}
                  onClick={() => handleCropSelect(c)}>
                  <span className="shc2-ci">{c.icon}</span>
                  <span className="shc2-cn">
                    {lang==="ml"?c.nameML:lang==="hi"?c.nameHI:c.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: SOIL VALUES */}
          {step >= 2 && crop && !loading && !result && (
            <div className="shc2-card shc2-anim-slide">
              <div className="shc2-card-title">2️⃣ {t("soil_step2")}</div>
              <div className="shc2-card-sub">{t("soil_step2_sub")}</div>

              {FIELDS.map(f => {
                const lf = f[lang] || f.en;
                const v = values[f.key] ?? f.min;
                const pct = ((v - f.min) / (f.max - f.min)) * 100;
                const displayVal = f.step < 1 ? Number(v).toFixed(1) : Math.round(v);
                return (
                  <div key={f.key} className="shc2-field">
                    <div className="shc2-field-top">
                      <div>
                        <div className="shc2-flabel">
                          {lf.label}
                          <button className="shc2-tip-btn"
                            onClick={() => setOpenTip(openTip === f.key ? null : f.key)}
                            title="What is this?">?</button>
                        </div>
                        <div className="shc2-fhint">{lf.hint}</div>
                      </div>
                      <div className="shc2-fval">
                        {displayVal}<span className="shc2-funit">{lf.unit}</span>
                      </div>
                    </div>
                    {openTip === f.key && (
                      <div className="shc2-tip-box">💡 {lf.tip}</div>
                    )}
                    <input
                      type="range"
                      className="shc2-slider"
                      min={f.min} max={f.max} step={f.step}
                      value={v}
                      style={{ background:`linear-gradient(90deg,#1a5c38 0%,#1a5c38 ${pct}%,#e2e8f0 ${pct}%,#e2e8f0 100%)` }}
                      onChange={e => {
                        const nv = f.step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value);
                        setValues(prev => ({ ...prev, [f.key]: nv }));
                      }}
                    />
                  </div>
                );
              })}

              {error && <div className="shc2-error">{error}</div>}

              <button className="shc2-btn-primary" onClick={handleAnalyze} disabled={loading}>
                🔬 {t("soil_analyze")}
              </button>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="shc2-card shc2-anim-slide">
              <LoadingScreen lang={lang} />
            </div>
          )}

          {/* STEP 3: RESULTS */}
          {step >= 3 && result && !loading && (
            <ResultCard
              result={result}
              values={values}
              lang={lang}
              t={t}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </>
  );
}