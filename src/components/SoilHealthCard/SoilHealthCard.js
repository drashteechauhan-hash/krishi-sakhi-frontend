import React, { useState, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";
const soilVideo = "https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486748/Soil_health_card_jnst9g.mp4";// ─── CONSTANTS ────────────────────────────────────────────────────────────────

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

const LABELS = {
  en: {
    appName:"Krishi Sakhi", appSub:"Smart Soil Health Card",
    step1:"Select Your Crop", step1sub:"Tap the crop you want to grow",
    step2:"Enter Soil Values", step2sub:"From soil test report — or keep defaults",
    step3:"AI Result", analyze:"Analyze with AI",
    loading:"Analyzing your soil...",
    listen:"Listen to Results", stop:"Stop Speaking",
    newTest:"Start New Test",
    why:"Why this crop?", fert:"Fertilizer Suggestion",
    soilHealth:"Soil Health", overall:"Overall",
    confidence:"AI Confidence", also:"Also suitable for",
    infoTitle:"What you entered",
    videoTitle:"Watch: How it Works",
    videoSub:"Learn before you begin — 2 min guide",
    videoBadge:"VIDEO GUIDE",
    videoTip:"Tap to watch how to use Krishi Sakhi",
    videoClose:"Close Video",
  },
  ml: {
    appName:"കൃഷി സഖി", appSub:"സ്മാർട്ട് മണ്ണ് ആരോഗ്യ കാർഡ്",
    step1:"വിള തിരഞ്ഞെടുക്കുക", step1sub:"ഏത് വിള കൃഷി ചെയ്യണം?",
    step2:"മണ്ണ് മൂല്യങ്ങൾ നൽകുക", step2sub:"Soil test report-ൽ നിന്ന് — അല്ലെങ്കിൽ default ഉപയോഗിക്കുക",
    step3:"AI ഫലം", analyze:"AI ഉപയോഗിച്ച് വിശകലനം ചെയ്യുക",
    loading:"മണ്ണ് വിശകലനം ചെയ്യുന്നു...",
    listen:"ഫലം ഉറക്കെ കേൾക്കുക", stop:"നിർത്തുക",
    newTest:"പുതിയ പരിശോധന",
    why:"ഈ വിള എന്തുകൊണ്ട്?", fert:"വളം നിർദ്ദേശം",
    soilHealth:"മണ്ണ് ആരോഗ്യം", overall:"മൊത്തം",
    confidence:"AI ആത്മവിശ്വാസം", also:"ഇവയ്ക്കും യോജ്യം",
    infoTitle:"നൽകിയ വിവരങ്ങൾ",
    videoTitle:"കാണുക: എങ്ങനെ ഉപയോഗിക്കാം",
    videoSub:"തുടങ്ങുന്നതിന് മുമ്പ് കാണുക — 2 മിനിറ്റ്",
    videoBadge:"വീഡിയോ ഗൈഡ്",
    videoTip:"കൃഷി സഖി എങ്ങനെ ഉപയോഗിക്കാം എന്ന് കാണാൻ ടാപ്പ് ചെയ്യുക",
    videoClose:"അടയ്ക്കുക",
  },
  hi: {
    appName:"कृषि सखी", appSub:"स्मार्ट मिट्टी स्वास्थ्य कार्ड",
    step1:"अपनी फसल चुनें", step1sub:"आप कौन सी फसल उगाना चाहते हैं?",
    step2:"मिट्टी की जानकारी भरें", step2sub:"Soil test report से — या default रखें",
    step3:"AI सुझाव", analyze:"AI से जाँच करें",
    loading:"मिट्टी का विश्लेषण हो रहा है...",
    listen:"परिणाम सुनें", stop:"बंद करें",
    newTest:"नई जाँच",
    why:"यह फसल क्यों?", fert:"खाद सुझाव",
    soilHealth:"मिट्टी स्वास्थ्य", overall:"कुल",
    confidence:"AI भरोसा", also:"ये भी उग सकते हैं",
    infoTitle:"आपने जो भरा",
    videoTitle:"देखें: कैसे करें उपयोग",
    videoSub:"शुरू करने से पहले देखें — 2 मिनट",
    videoBadge:"वीडियो गाइड",
    videoTip:"कृषि सखी कैसे इस्तेमाल करें — टैप करें",
    videoClose:"बंद करें",
  },
};

const HEALTH_STYLE = {
  Good:   { bg:"#f0fff4", color:"#166534", label:"Good ✅"   },
  Medium: { bg:"#fffbeb", color:"#92400e", label:"Medium ⚠️" },
  Poor:   { bg:"#fff1f2", color:"#9f1239", label:"Poor 🔴"   },
};

function buildSpeechText(lang, crop, result) {
  if (!result) return "";
  const c = result.recommended_crop;
  const conf = result.confidence;
  const health = result.soil_health?.overall;
  const fert = result.fertilizer_tip;
  const expl = result.explanation;
  const texts = {
    ml: `AI ഫലം. ${c} കൃഷിക്ക് ഏറ്റവും അനുയോജ്യം. AI ആത്മവിശ്വാസം ${Math.round(conf)} ശതമാനം. മണ്ണ് ആരോഗ്യം ${health === "Good" ? "നല്ലതാണ്" : health === "Medium" ? "ശരാശരിയാണ്" : "ദയനീയമാണ്"}. ${expl}. വളം നിർദ്ദേശം: ${fert}`,
    hi: `AI सिफारिश। ${c} की खेती सबसे उपयुक्त है। AI का भरोसा ${Math.round(conf)} प्रतिशत है। मिट्टी की सेहत ${health === "Good" ? "अच्छी है" : health === "Medium" ? "ठीक है" : "खराब है"}। ${expl}। खाद की सलाह: ${fert}`,
    en: `AI recommendation. ${c} is most suitable. AI confidence ${Math.round(conf)} percent. Soil health is ${health}. ${expl}. Fertilizer suggestion: ${fert}`,
  };
  return texts[lang] || texts.en;
}

// ─── VIDEO GUIDE CARD ─────────────────────────────────────────────────────────
function VideoGuideCard({ lang, t }) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef(null);

  const handleToggle = () => {
    if (open) {
      videoRef.current?.pause();
    }
    setOpen(v => !v);
  };

  return (
    <div className="shc2-video-card">
      {/* Thumbnail / Banner row — always visible */}
      <div className="shc2-video-banner" onClick={handleToggle}>
        {/* Left: animated play icon area */}
        <div className="shc2-video-play-wrap">
          <div className={`shc2-video-play-ring ${open ? "open" : ""}`}>
            <span className="shc2-video-play-icon">{open ? "⏸" : "▶"}</span>
          </div>
        </div>

        {/* Middle: text */}
        <div className="shc2-video-banner-text">
          <div className="shc2-video-badge">{t.videoBadge}</div>
          <div className="shc2-video-title">{t.videoTitle}</div>
          <div className="shc2-video-sub">{t.videoSub}</div>
        </div>

        {/* Right: chevron */}
        <div className={`shc2-video-chev ${open ? "open" : ""}`}>›</div>
      </div>

      {/* Expandable video */}
      <div className={`shc2-video-body ${open ? "open" : ""}`}>
        <div className="shc2-video-player-wrap">
          <video
            ref={videoRef}
            src={soilVideo}
            controls
            preload="metadata"
            className="shc2-video-player"
          />
        </div>
        <div className="shc2-video-footer">
          <span className="shc2-video-footer-dot" />
          <span className="shc2-video-footer-txt">{t.videoTip}</span>
          <button className="shc2-video-close-btn" onClick={handleToggle}>
            {t.videoClose} ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SoilHealthCardAI() {
const { lang } = useLanguage();
  const [step, setStep]       = useState(1);
  const [crop, setCrop]       = useState(null);
  const [values, setValues]   = useState({});
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [openTip, setOpenTip] = useState(null);

  const t = LABELS[lang];

  const handleCropSelect = (c) => {
    setCrop(c);
    setValues({ ...c.defaults });
    setStep(2);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/predict", {
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

  const handleVoice = () => {
    if (!window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = buildSpeechText(lang, crop, result);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "ml" ? "ml-IN" : lang === "hi" ? "hi-IN" : "en-IN";
    u.rate = 0.82;
    u.pitch = 1;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const healthStyle = (s) => HEALTH_STYLE[s] || HEALTH_STYLE.Good;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');
        .shc2 * { box-sizing:border-box; margin:0; padding:0; }
        .shc2 { font-family:'Noto Sans Malayalam','Noto Sans Devanagari','Segoe UI',sans-serif; background:#f4f1eb; min-height:100vh; color:#111; }
        .shc2-bar { background:linear-gradient(135deg,#1a5c38,#2d8653); padding:14px 18px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:50; }
        .shc2-logo { display:flex; align-items:center; gap:10px; }
        .shc2-logo-icon { width:40px; height:40px; background:rgba(255,255,255,0.18); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; }
        .shc2-logo-text { color:white; font-size:16px; font-weight:700; line-height:1.1; }
        .shc2-logo-sub { color:rgba(255,255,255,0.7); font-size:11px; }
        .shc2-langs { display:flex; gap:3px; background:rgba(0,0,0,0.2); padding:3px; border-radius:20px; }
        .shc2-lb { border:none; background:transparent; color:rgba(255,255,255,0.6); font-size:12px; font-weight:700; padding:5px 11px; border-radius:16px; cursor:pointer; font-family:inherit; transition:all .2s; }
        .shc2-lb.active { background:white; color:#1a5c38; }
        .shc2-body { max-width:660px; margin:0 auto; padding:16px 14px 60px; }
        .shc2-steps { display:flex; gap:6px; margin-bottom:16px; flex-wrap:wrap; }
        .shc2-sp { font-size:12px; font-weight:700; padding:5px 14px; border-radius:20px; border:1.5px solid #e5e7eb; color:#9ca3af; background:white; }
        .shc2-sp.done { background:#1a5c38; color:white; border-color:#1a5c38; }
        .shc2-sp.active { background:#fef3c7; color:#92400e; border-color:#f59e0b; }
        .shc2-card { background:white; border-radius:18px; padding:18px; margin-bottom:14px; border:1.5px solid #d4edda; }
        .shc2-card-title { font-size:16px; font-weight:700; color:#1a5c38; margin-bottom:3px; }
        .shc2-card-sub { font-size:12px; color:#6b7280; margin-bottom:14px; }
        .shc2-crop-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:9px; }
        @media(max-width:380px){ .shc2-crop-grid { grid-template-columns:repeat(2,1fr); } }
        .shc2-cb { display:flex; flex-direction:column; align-items:center; gap:3px; padding:12px 6px; border-radius:12px; border:2px solid #e5e7eb; background:white; cursor:pointer; font-family:inherit; transition:all .2s; }
        .shc2-cb.active { border-color:#1a5c38; background:#f0fff4; }
        .shc2-cb:active { transform:scale(0.93); }
        .shc2-ci { font-size:26px; }
        .shc2-cn { font-size:11px; font-weight:700; color:#374151; margin-top:2px; }
        .shc2-cb.active .shc2-cn { color:#1a5c38; }
        .shc2-field { margin-bottom:20px; }
        .shc2-field-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:7px; }
        .shc2-flabel { font-size:15px; font-weight:700; display:flex; align-items:center; gap:7px; }
        .shc2-fhint { font-size:11px; color:#9ca3af; margin-top:1px; }
        .shc2-fval { font-size:22px; font-weight:800; color:#1a5c38; white-space:nowrap; }
        .shc2-funit { font-size:11px; color:#9ca3af; margin-left:2px; font-weight:400; }
        .shc2-tip-btn { width:18px; height:18px; border-radius:50%; background:#e5e7eb; border:none; cursor:pointer; font-size:10px; font-weight:700; color:#6b7280; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
        .shc2-tip-box { background:#1f2937; color:#f0fdf4; font-size:13px; padding:11px 14px; border-radius:10px; margin-bottom:10px; line-height:1.55; }
        input[type=range].shc2-slider { width:100%; height:8px; appearance:none; border-radius:8px; outline:none; cursor:pointer; }
        input[type=range].shc2-slider::-webkit-slider-thumb { appearance:none; width:26px; height:26px; border-radius:50%; background:white; border:3px solid #1a5c38; box-shadow:0 2px 6px rgba(0,0,0,0.15); cursor:pointer; }
        .shc2-voice-bar { display:flex; align-items:center; gap:12px; background:#f0fff4; border:1.5px solid #bbf7d0; border-radius:14px; padding:14px 16px; margin-bottom:14px; }
        .shc2-vbtn { width:48px; height:48px; border-radius:50%; border:none; display:flex; align-items:center; justify-content:center; font-size:22px; cursor:pointer; flex-shrink:0; transition:all .2s; }
        .shc2-vbtn.play { background:#1a5c38; }
        .shc2-vbtn.stop { background:#dc2626; }
        .shc2-vtext { flex:1; }
        .shc2-vlabel { font-size:14px; font-weight:700; color:#166534; }
        .shc2-vsub { font-size:11px; color:#4ade80; margin-top:2px; }
        .shc2-dots { display:flex; gap:3px; margin-top:4px; }
        .shc2-dot { width:6px; height:6px; border-radius:50%; background:#1a5c38; animation:shc2bounce 1s infinite; }
        .shc2-dot:nth-child(2){ animation-delay:.15s; }
        .shc2-dot:nth-child(3){ animation-delay:.3s; }
        @keyframes shc2bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .shc2-result-hero { background:#f0fff4; border:2px solid #1a5c38; border-radius:18px; padding:20px; margin-bottom:12px; display:flex; gap:16px; align-items:center; }
        .shc2-result-big-icon { font-size:58px; flex-shrink:0; }
        .shc2-result-crop { font-size:26px; font-weight:800; color:#166534; text-transform:capitalize; }
        .shc2-conf-bar-wrap { background:#e2e8f0; border-radius:8px; height:8px; margin:8px 0 3px; overflow:hidden; }
        .shc2-conf-bar { height:100%; border-radius:8px; background:#1a5c38; transition:width 1.2s ease; }
        .shc2-alt-chips { display:flex; gap:6px; flex-wrap:wrap; margin-top:8px; }
        .shc2-chip { font-size:11px; font-weight:700; padding:3px 11px; border-radius:20px; background:#e8f5e9; color:#1a5c38; text-transform:capitalize; }
        .shc2-health-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-top:12px; }
        .shc2-hcell { padding:14px; border-radius:14px; text-align:center; }
        .shc2-hcell-icon { font-size:22px; margin-bottom:4px; }
        .shc2-hcell-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; margin-bottom:3px; }
        .shc2-hcell-status { font-size:16px; font-weight:800; }
        .shc2-explain { background:#fffbeb; border-radius:12px; padding:14px; border-left:4px solid #f59e0b; font-size:14px; color:#78350f; line-height:1.6; margin-bottom:12px; border-radius:0 12px 12px 0; }
        .shc2-fert { background:#eff6ff; border-radius:12px; padding:14px; border-left:4px solid #2563eb; margin-bottom:12px; border-radius:0 12px 12px 0; }
        .shc2-fert-title { font-size:14px; font-weight:700; color:#1d4ed8; margin-bottom:5px; }
        .shc2-fert-body { font-size:14px; color:#1e3a8a; line-height:1.6; }
        .shc2-info-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; }
        .shc2-info-cell { background:#f9fafb; border-radius:10px; padding:10px; }
        .shc2-info-key { font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:.5px; }
        .shc2-info-val { font-size:18px; font-weight:700; color:#1a5c38; margin:2px 0 1px; }
        .shc2-info-desc { font-size:11px; color:#6b7280; }
        .shc2-btn-primary { width:100%; padding:16px; border-radius:14px; border:none; background:linear-gradient(135deg,#1a5c38,#2d8653); color:white; font-size:17px; font-weight:700; font-family:inherit; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:9px; margin-top:16px; transition:all .2s; }
        .shc2-btn-primary:active { transform:scale(0.97); }
        .shc2-btn-primary:disabled { opacity:.6; cursor:not-allowed; }
        .shc2-btn-reset { width:100%; padding:13px; border-radius:12px; border:1.5px solid #e5e7eb; background:white; color:#6b7280; font-size:14px; font-weight:700; font-family:inherit; cursor:pointer; margin-top:10px; transition:all .2s; }
        .shc2-error { padding:14px; background:#fff1f2; border-radius:12px; color:#9f1239; font-size:14px; font-weight:600; margin-bottom:12px; text-align:center; border:1.5px solid #fecdd3; }

        /* ── VIDEO CARD STYLES ──────────────────────────────────────── */
        .shc2-video-card {
          border-radius:18px;
          overflow:hidden;
          margin-bottom:14px;
          border:1.5px solid #a7f3d0;
          background:white;
        }
        .shc2-video-banner {
          display:flex;
          align-items:center;
          gap:14px;
          padding:14px 16px;
          cursor:pointer;
          background:linear-gradient(135deg,#064e3b,#065f46,#047857);
          user-select:none;
          transition:opacity .15s;
        }
        .shc2-video-banner:active { opacity:0.88; }

        .shc2-video-play-wrap {
          flex-shrink:0;
        }
        .shc2-video-play-ring {
          width:46px;
          height:46px;
          border-radius:50%;
          border:2.5px solid rgba(255,255,255,0.5);
          display:flex;
          align-items:center;
          justify-content:center;
          background:rgba(255,255,255,0.12);
          transition:all .25s;
        }
        .shc2-video-play-ring.open {
          background:rgba(255,255,255,0.22);
          border-color:rgba(255,255,255,0.8);
        }
        .shc2-video-play-icon {
          font-size:18px;
          color:white;
          margin-left:2px;
        }
        .shc2-video-play-ring.open .shc2-video-play-icon {
          margin-left:0;
        }

        .shc2-video-banner-text {
          flex:1;
          min-width:0;
        }
        .shc2-video-badge {
          display:inline-block;
          background:rgba(255,255,255,0.18);
          color:rgba(255,255,255,0.9);
          font-size:9px;
          font-weight:800;
          letter-spacing:1.2px;
          padding:2px 8px;
          border-radius:20px;
          margin-bottom:5px;
          border:1px solid rgba(255,255,255,0.25);
        }
        .shc2-video-title {
          color:white;
          font-size:15px;
          font-weight:700;
          line-height:1.2;
          margin-bottom:3px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        .shc2-video-sub {
          color:rgba(255,255,255,0.65);
          font-size:11px;
        }

        .shc2-video-chev {
          color:rgba(255,255,255,0.7);
          font-size:26px;
          font-weight:300;
          flex-shrink:0;
          transition:transform .3s ease;
          line-height:1;
        }
        .shc2-video-chev.open {
          transform:rotate(90deg);
        }

        .shc2-video-body {
          max-height:0;
          overflow:hidden;
          transition:max-height .45s cubic-bezier(.4,0,.2,1);
        }
        .shc2-video-body.open {
          max-height:520px;
        }

        .shc2-video-player-wrap {
          background:#000;
          line-height:0;
        }
        .shc2-video-player {
          width:100%;
          max-height:280px;
          object-fit:contain;
          display:block;
          background:#000;
        }

        .shc2-video-footer {
          display:flex;
          align-items:center;
          gap:8px;
          padding:10px 14px;
          background:#ecfdf5;
          border-top:1px solid #d1fae5;
        }
        .shc2-video-footer-dot {
          width:7px;
          height:7px;
          border-radius:50%;
          background:#10b981;
          flex-shrink:0;
          animation:shc2pulse 1.8s infinite;
        }
        @keyframes shc2pulse {
          0%,100%{ opacity:1; transform:scale(1); }
          50%{ opacity:0.5; transform:scale(0.8); }
        }
        .shc2-video-footer-txt {
          flex:1;
          font-size:12px;
          color:#065f46;
          font-weight:600;
        }
        .shc2-video-close-btn {
          border:none;
          background:#d1fae5;
          color:#065f46;
          font-size:11px;
          font-weight:700;
          padding:5px 10px;
          border-radius:20px;
          cursor:pointer;
          font-family:inherit;
          flex-shrink:0;
          transition:background .2s;
        }
        .shc2-video-close-btn:active { background:#a7f3d0; }
      `}</style>

      <div className="shc2">
        {/* TOP BAR */}
        <div className="shc2-bar">
          <div className="shc2-logo">
            <div className="shc2-logo-icon">🌱</div>
            <div>
              <div className="shc2-logo-text">{t.appName}</div>
              <div className="shc2-logo-sub">{t.appSub}</div>
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

          {/* ── VIDEO GUIDE — shown above step 1 ── */}
          <VideoGuideCard lang={lang} t={t} />

          {/* ── STEP 1: CROP ── */}
          <div className="shc2-card">
            <div className="shc2-card-title">1️⃣ {t.step1}</div>
            <div className="shc2-card-sub">{t.step1sub}</div>
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

          {/* ── STEP 2: SOIL VALUES ── */}
          {step >= 2 && crop && (
            <div className="shc2-card">
              <div className="shc2-card-title">2️⃣ {t.step2}</div>
              <div className="shc2-card-sub">{t.step2sub}</div>

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
                {loading ? `⏳ ${t.loading}` : `🔬 ${t.analyze}`}
              </button>
            </div>
          )}

          {/* ── STEP 3: RESULTS ── */}
          {step >= 3 && result && (
            <>
              <div className="shc2-voice-bar">
                <button className={`shc2-vbtn ${speaking ? "stop" : "play"}`}
                  onClick={handleVoice}
                  title={speaking ? t.stop : t.listen}>
                  {speaking ? "🛑" : "🔊"}
                </button>
                <div className="shc2-vtext">
                  <div className="shc2-vlabel">
                    {speaking ? (
                      lang==="ml"?"🔊 കേൾക്കുന്നു...":lang==="hi"?"🔊 बोल रहे हैं...":"🔊 Speaking now..."
                    ) : t.listen}
                  </div>
                  <div className="shc2-vsub">
                    {speaking
                      ? (lang==="ml"?"🛑 ചുവന്ന ബട്ടൺ അമർത്തിയാൽ നിർത്തും":lang==="hi"?"🛑 लाल बटन दबाएँ — बंद होगा":"🛑 Tap red button to stop")
                      : (lang==="ml"?"ഒരു ടാപ്പ് — AI ഫലം ഉറക്കെ കേൾക്കാം":lang==="hi"?"एक tap — AI परिणाम सुनें":"One tap — hear AI results aloud")}
                  </div>
                </div>
                {speaking && (
                  <div className="shc2-dots">
                    <div className="shc2-dot"/><div className="shc2-dot"/><div className="shc2-dot"/>
                  </div>
                )}
              </div>

              <div className="shc2-result-hero">
                <div className="shc2-result-big-icon">{result.crop_icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",color:"#9ca3af",letterSpacing:1,marginBottom:4 }}>
                    {t.step3}
                  </div>
                  <div className="shc2-result-crop">{result.recommended_crop}</div>
                  <div style={{ fontSize:13,color:"#6b7280",marginTop:2 }}>
                    {t.confidence}: <b style={{color:"#1a5c38"}}>{result.confidence}%</b>
                  </div>
                  <div className="shc2-conf-bar-wrap">
                    <div className="shc2-conf-bar" style={{ width:`${result.confidence}%` }}/>
                  </div>
                  {result.alternatives?.length > 0 && (
                    <>
                      <div style={{ fontSize:11,color:"#9ca3af",margin:"6px 0 4px" }}>{t.also}:</div>
                      <div className="shc2-alt-chips">
                        {result.alternatives.map(a => (
                          <span key={a} className="shc2-chip">
                            {CROPS.find(c=>c.name.toLowerCase()===a)?.icon||"🌱"} {a}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="shc2-explain">
                💡 <b>{t.why}</b><br/>{result.explanation}
              </div>

              <div className="shc2-fert">
                <div className="shc2-fert-title">🌿 {t.fert}</div>
                <div className="shc2-fert-body">{result.fertilizer_tip}</div>
              </div>

              <div className="shc2-card">
                <div className="shc2-card-title">📊 {t.soilHealth}</div>
                <div className="shc2-health-grid">
                  {[
                    { key:"overall",    icon:"🌍", label:t.overall },
                    { key:"ph",         icon:"🧪", label:"pH" },
                    { key:"nitrogen",   icon:"🌿", label:lang==="ml"?"നൈട്രജൻ":lang==="hi"?"नाइट्रोजन":"Nitrogen" },
                    { key:"phosphorus", icon:"🌱", label:lang==="ml"?"ഫോസ്ഫറസ്":lang==="hi"?"फास्फोरस":"Phosphorus" },
                    { key:"potassium",  icon:"💪", label:lang==="ml"?"പൊട്ടാഷ്":lang==="hi"?"पोटाश":"Potassium" },
                  ].map(item => {
                    const s = result.soil_health?.[item.key];
                    const hs = healthStyle(s);
                    return (
                      <div key={item.key} className="shc2-hcell"
                        style={{ background:hs.bg, color:hs.color }}>
                        <div className="shc2-hcell-icon">{item.icon}</div>
                        <div className="shc2-hcell-label" style={{color:hs.color}}>{item.label}</div>
                        <div className="shc2-hcell-status">{s}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="shc2-card">
                <div className="shc2-card-title">📋 {t.infoTitle}</div>
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

              <div className="shc2-voice-bar" style={{marginBottom:0}}>
                <button className={`shc2-vbtn ${speaking ? "stop" : "play"}`}
                  onClick={handleVoice}>
                  {speaking ? "🛑" : "🔊"}
                </button>
                <div className="shc2-vtext">
                  <div className="shc2-vlabel">{speaking ? (lang==="ml"?"കേൾക്കുന്നു...":lang==="hi"?"बोल रहे हैं...":"Speaking...") : t.listen}</div>
                  <div className="shc2-vsub">{speaking?(lang==="ml"?"നിർത്താൻ ടാപ്പ് ചെയ്യുക":lang==="hi"?"रोकने के लिए टैप करें":"Tap to stop"):(lang==="ml"?"ഒരിക്കൽ കൂടി കേൾക്കാൻ":lang==="hi"?"दोबारा सुनने के लिए":"Tap to hear again")}</div>
                </div>
              </div>

              <button className="shc2-btn-reset"
                onClick={() => {
                  setStep(1); setCrop(null); setResult(null);
                  setError(""); setSpeaking(false);
                  window.speechSynthesis?.cancel();
                  window.scrollTo({top:0, behavior:"smooth"});
                }}>
                🔄 {t.newTest}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}