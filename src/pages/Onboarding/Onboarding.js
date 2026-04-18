import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext";

const FIELDS = [
  {
    name: "name",
    labels: { en: "Your Name", hi: "आपका नाम", ml: "നിങ്ങളുടെ പേര്" },
    guideText: {
      en: "Please tell me your name",
      hi: "कृपया अपना नाम बताएं",
      ml: "ദയവായി നിങ്ങളുടെ പേര് പറയൂ",
    },
    placeholder: { en: "e.g. Rajan Kumar", hi: "उदा. राजन कुमार", ml: "ഉദാ. രാജൻ കുമാർ" },
    icon: "👤",
    type: "text",
  },
  {
    name: "location",
    labels: { en: "Location / Village", hi: "स्थान / गाँव", ml: "സ്ഥലം / ഗ്രാമം" },
    guideText: {
      en: "Please tell me your location or village name",
      hi: "कृपया अपना स्थान या गांव का नाम बताएं",
      ml: "ദയവായി നിങ്ങളുടെ സ്ഥലം അല്ലെങ്കിൽ ഗ്രാമത്തിന്റെ പേര് പറയൂ",
    },
    placeholder: { en: "e.g. Thrissur, Kerala", hi: "उदा. थ्रिस्सूर, केरल", ml: "ഉദാ. തൃശ്ശൂർ, കേരളം" },
    icon: "📍",
    type: "text",
  },
  {
    name: "landSize",
    labels: { en: "Land Size (acres)", hi: "ज़मीन का आकार (एकड़)", ml: "ഭൂമിയുടെ വലിപ്പം (ഏക്കർ)" },
    guideText: {
      en: "Please tell me the size of your land in acres",
      hi: "कृपया अपनी जमीन का आकार एकड़ में बताएं",
      ml: "ദയവായി നിങ്ങളുടെ ഭൂമിയുടെ വലിപ്പം ഏക്കറിൽ പറയൂ",
    },
    placeholder: { en: "e.g. 2.5", hi: "उदा. 2.5", ml: "ഉദാ. 2.5" },
    icon: "🌾",
    type: "number",
  },
  {
    name: "crop",
    labels: { en: "Primary Crop", hi: "मुख्य फसल", ml: "പ്രധാന വിള" },
    guideText: {
      en: "What is your primary crop?",
      hi: "आपकी मुख्य फसल क्या है?",
      ml: "നിങ്ങളുടെ പ്രധാന വിള എന്താണ്?",
    },
    placeholder: { en: "e.g. Rice, Coconut, Banana", hi: "उदा. चावल, नारियल, केला", ml: "ഉദാ. നെല്ല്, തേങ്ങ, വാഴ" },
    icon: "🌱",
    type: "text",
  },
  {
    name: "soilType",
    labels: { en: "Soil Type", hi: "मिट्टी का प्रकार", ml: "മണ്ണിന്റെ തരം" },
    guideText: {
      en: "What type of soil is in your farm?",
      hi: "आपके खेत में किस प्रकार की मिट्टी है?",
      ml: "നിങ്ങളുടെ കൃഷിയിടത്തിൽ ഏത് തരം മണ്ണാണ്?",
    },
    placeholder: { en: "e.g. Loamy, Clay, Sandy", hi: "उदा. दोमट, चिकनी, बलुई", ml: "ഉദാ. ലോമി, കളിമണ്ണ്, മണൽ" },
    icon: "🪨",
    type: "text",
  },
  {
    name: "irrigationType",
    labels: { en: "Irrigation Method", hi: "सिंचाई का तरीका", ml: "ജലസേചന രീതി" },
    guideText: {
      en: "What irrigation method do you use?",
      hi: "आप कौन सी सिंचाई विधि उपयोग करते हैं?",
      ml: "നിങ്ങൾ ഏത് ജലസേചന രീതി ഉപയോഗിക്കുന്നു?",
    },
    placeholder: { en: "e.g. Drip, Flood, Rainfed", hi: "उदा. ड्रिप, बाढ़, वर्षा आधारित", ml: "ഉദാ. തുള്ളിനനയ്ക്കൽ, വെള്ളപ്പൊക്കം, മഴ" },
    icon: "💧",
    type: "text",
  },
];

const LANG_CODES = { en: "en-US", hi: "hi-IN", ml: "ml-IN" };
const LANG_NAMES = { en: "English", hi: "हिंदी", ml: "മലയാളം" };

const TEXT = {
  en: {
    tag: "🌿 Krishi Sakhi · Smart Farming AI",
    hero1: "Grow",
    hero1em: "smarter.",
    hero2: "Farm stronger.",
    sub: "Your intelligent farming companion for crops, weather, markets & schemes.",
    step: "Step 01 — Farmer Profile",
    formTitle: "Tell us about",
    formTitleEm: "your farm",
    voiceLabel: "🎤 Voice Language:",
    guideBtn: "🔊 Guide Me",
    stopBtn: "✕ Stop",
    speakingTxt: (l) => `🔊 Speaking in ${LANG_NAMES[l]}…`,
    listeningTxt: (l, t) => `🎙 Listening in ${LANG_NAMES[l]}… ${t ? `"${t}"` : "speak now"}`,
    saveBtn: "Save & Continue →",
    savingBtn: "Saving…",
    savedTitle: "Profile Saved!",
    savedSub: "Redirecting to your dashboard…",
    secureNote: "Your data is stored securely on our server",
  },
  hi: {
    tag: "🌿 कृषि सखी · स्मार्ट फार्मिंग AI",
    hero1: "स्मार्ट",
    hero1em: "खेती।",
    hero2: "मज़बूत किसान।",
    sub: "फसल, मौसम, बाज़ार और योजनाओं के लिए आपका AI साथी।",
    step: "चरण 01 — किसान प्रोफाइल",
    formTitle: "हमें बताएं",
    formTitleEm: "अपने खेत के बारे में",
    voiceLabel: "🎤 वॉइस भाषा:",
    guideBtn: "🔊 मार्गदर्शन करें",
    stopBtn: "✕ रोकें",
    speakingTxt: (l) => `🔊 ${LANG_NAMES[l]} में बोल रहा है…`,
    listeningTxt: (l, t) => `🎙 ${LANG_NAMES[l]} में सुन रहा है… ${t ? `"${t}"` : "अभी बोलें"}`,
    saveBtn: "सहेजें और जारी रखें →",
    savingBtn: "सहेज रहा है…",
    savedTitle: "प्रोफाइल सहेजी!",
    savedSub: "डैशबोर्ड पर जा रहे हैं…",
    secureNote: "आपका डेटा सुरक्षित रूप से सर्वर पर संग्रहीत है",
  },
  ml: {
    tag: "🌿 കൃഷി സഖി · സ്മാർട്ട് ഫാർമിംഗ് AI",
    hero1: "ബുദ്ധിപൂർവ്വം",
    hero1em: "കൃഷി ചെയ്യൂ.",
    hero2: "ശക്തമായി വളരൂ.",
    sub: "വിളകൾ, കാലാവസ്ഥ, വിപണി & പദ്ധതികൾക്കായുള്ള AI കൃഷി സഹായി.",
    step: "ഘട്ടം 01 — കർഷക പ്രൊഫൈൽ",
    formTitle: "ഞങ്ങൾക്ക് പറയൂ",
    formTitleEm: "നിങ്ങളുടെ കൃഷിയെക്കുറിച്ച്",
    voiceLabel: "🎤 വോയ്സ് ഭാഷ:",
    guideBtn: "🔊 വഴികാട്ടൂ",
    stopBtn: "✕ നിർത്തൂ",
    speakingTxt: (l) => `🔊 ${LANG_NAMES[l]}-ൽ സംസാരിക്കുന്നു…`,
    listeningTxt: (l, t) => `🎙 ${LANG_NAMES[l]}-ൽ കേൾക്കുന്നു… ${t ? `"${t}"` : "ഇപ്പോൾ സംസാരിക്കൂ"}`,
    saveBtn: "സംരക്ഷിച്ച് തുടരൂ →",
    savingBtn: "സംരക്ഷിക്കുന്നു…",
    savedTitle: "പ്രൊഫൈൽ സംരക്ഷിച്ചു!",
    savedSub: "ഡാഷ്ബോർഡിലേക്ക് പോകുന്നു…",
    secureNote: "നിങ്ങളുടെ ഡേറ്റ സുരക്ഷിതമായി സൂക്ഷിച്ചിരിക്കുന്നു",
  },
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = TEXT[lang] || TEXT.en;

  const [formData, setFormData] = useState({
    name: "", location: "", landSize: "", crop: "", soilType: "", irrigationType: "",
  });
  const [voiceLang, setVoiceLang] = useState(lang || "en");
  const [isListening, setIsListening] = useState(false);
  const [listeningFor, setListeningFor] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [activeField, setActiveField] = useState(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [guideActive, setGuideActive] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 5 + 2}px`,
      delay: `${Math.random() * 10}s`,
      dur: `${Math.random() * 15 + 10}s`,
      op: Math.random() * 0.4 + 0.1,
    }))
  );

  const recognitionRef = useRef(null);
  const guideTimeoutsRef = useRef([]);
  const formRef = useRef(null);

  // Sync voiceLang with global lang
  useEffect(() => { setVoiceLang(lang); }, [lang]);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 200);
    const t2 = setTimeout(() => setStep(2), 800);
    const t3 = setTimeout(() => setStep(3), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  const speakAsync = (text, l) => {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = LANG_CODES[l] || "en-US";
      u.rate = 0.88;
      u.pitch = 1.0;
      setIsSpeaking(true);
      u.onend = () => { setIsSpeaking(false); resolve(); };
      u.onerror = () => { setIsSpeaking(false); resolve(); };
      window.speechSynthesis.speak(u);
    });
  };

  const speakThenListen = async (fieldName, l) => {
    if (recognitionRef.current) recognitionRef.current.abort();
    window.speechSynthesis.cancel();
    const field = FIELDS.find(f => f.name === fieldName);
    if (!field) return;
    await speakAsync(field.guideText[l] || field.guideText.en, l);
    await new Promise(r => setTimeout(r, 400));
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported. Please use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = LANG_CODES[l];
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    setIsListening(true);
    setListeningFor(fieldName);
    setTranscript("");
    recognition.onresult = (e) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const tx = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += tx;
        else interim += tx;
      }
      setTranscript(final || interim);
      if (final) {
        setFormData(prev => ({ ...prev, [fieldName]: final.trim() }));
        setIsListening(false);
        setListeningFor(null);
        setTranscript("");
      }
    };
    recognition.onerror = () => { setIsListening(false); setListeningFor(null); setTranscript(""); };
    recognition.onend = () => { setIsListening(false); setListeningFor(null); };
    recognition.start();
  };

  const guideAll = async () => {
    if (guideActive) return;
    setGuideActive(true);
    for (const field of FIELDS) {
      if (!guideActive) break;
      await speakThenListen(field.name, voiceLang);
      await new Promise(r => setTimeout(r, 800));
    }
    setGuideActive(false);
  };

  const stopAll = () => {
    window.speechSynthesis.cancel();
    recognitionRef.current?.abort();
    setIsListening(false);
    setListeningFor(null);
    setIsSpeaking(false);
    setTranscript("");
    setGuideActive(false);
    guideTimeoutsRef.current.forEach(clearTimeout);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        location: formData.location,
        landSize: parseFloat(formData.landSize) || 0,
        crop: formData.crop,
        soilType: formData.soilType,
        irrigationType: formData.irrigationType,
      };
      await axios.post("https://krishi-sakhi-backend-6.onrender.com/api/farmers", payload);
      setSubmitted(true);
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (err) {
      console.error(err);
      alert("Error saving data. Please check the backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --c-bg:#060d08; --c-surface:#0c1a0e; --c-panel:rgba(255,255,255,0.025);
          --c-green:#1a4025; --c-sage:#2e6b3e; --c-leaf:#4caf65; --c-mint:#7dd99a;
          --c-gold:#c47f1a; --c-amber:#e8a832; --c-cream:#f0e8d5; --c-warm:#d4c4a0;
          --c-muted:rgba(240,232,213,0.4); --c-border:rgba(196,127,26,0.2);
          --c-glowG:rgba(76,175,101,0.12); --r:16px; --r-sm:10px;
        }
        .ob { font-family:'DM Sans',sans-serif; background:var(--c-bg); min-height:100vh; color:var(--c-cream); overflow-x:hidden; }
        .ob-hero { position:relative; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px 24px; overflow:hidden; }
        .ob-hero-bg { position:absolute; inset:0; z-index:0; background:radial-gradient(ellipse 60% 50% at 50% -10%,rgba(76,175,101,0.18) 0%,transparent 60%),radial-gradient(ellipse 40% 40% at 20% 80%,rgba(196,127,26,0.1) 0%,transparent 50%),linear-gradient(160deg,#060d08 0%,#0a1a0c 50%,#060d08 100%); }
        .ob-hero-grid { position:absolute; inset:0; z-index:1; background-image:linear-gradient(rgba(76,175,101,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(76,175,101,0.04) 1px,transparent 1px); background-size:60px 60px; mask-image:radial-gradient(ellipse at center,black 30%,transparent 70%); }
        .ob-particle { position:absolute; border-radius:50%; background:var(--c-leaf); z-index:2; animation:floatUp linear infinite; }
        @keyframes floatUp { 0%{transform:translateY(20px) scale(0);opacity:0} 20%{opacity:var(--op)} 80%{opacity:var(--op)} 100%{transform:translateY(-120px) scale(1);opacity:0} }
        .ob-hero-content { position:relative; z-index:3; display:flex; flex-direction:column; align-items:center; gap:24px; max-width:680px; }
        .ob-tag { display:inline-flex; align-items:center; gap:8px; padding:7px 20px; border-radius:40px; background:rgba(76,175,101,0.1); border:1px solid rgba(76,175,101,0.3); font-family:'Space Mono',monospace; font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:var(--c-mint); opacity:0; transform:translateY(20px); transition:opacity 0.7s ease,transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .ob-tag.show { opacity:1; transform:translateY(0); }
        .ob-h1 { font-family:'Cormorant Garamond',serif; font-size:clamp(3rem,7vw,5.5rem); font-weight:700; line-height:1.05; letter-spacing:-1.5px; color:var(--c-cream); opacity:0; transform:translateY(30px); transition:opacity 0.8s ease 0.15s,transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s; }
        .ob-h1.show { opacity:1; transform:translateY(0); }
        .ob-h1 em { font-style:italic; color:var(--c-leaf); }
        .ob-sub { font-size:clamp(0.9rem,2vw,1.05rem); color:var(--c-muted); font-weight:300; line-height:1.8; max-width:500px; opacity:0; transform:translateY(20px); transition:opacity 0.8s ease 0.3s,transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s; }
        .ob-sub.show { opacity:1; transform:translateY(0); }
        .ob-scroll { position:absolute; bottom:28px; left:50%; transform:translateX(-50%); z-index:3; display:flex; flex-direction:column; align-items:center; gap:6px; color:var(--c-muted); font-family:'Space Mono',monospace; font-size:9px; letter-spacing:2px; animation:bounce 2.5s ease-in-out infinite; }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        .ob-scroll-line { width:1px; height:44px; background:linear-gradient(to bottom,transparent,var(--c-gold)); }
        .ob-form-sec { position:relative; padding:100px 24px 80px; background:radial-gradient(ellipse at 0% 30%,rgba(26,64,37,0.35) 0%,transparent 55%),var(--c-surface); }
        .ob-form-sec::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--c-gold),transparent); }
        .ob-form-inner { max-width:680px; margin:0 auto; position:relative; z-index:2; }
        .ob-form-hd { text-align:center; margin-bottom:56px; }
        .ob-eyebrow { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--c-amber); margin-bottom:14px; }
        .ob-form-title { font-family:'Cormorant Garamond',serif; font-size:clamp(2.2rem,5vw,3.5rem); font-weight:700; color:var(--c-cream); line-height:1.1; }
        .ob-form-title em { font-style:italic; color:var(--c-leaf); }
        .ob-vbar { display:flex; align-items:center; gap:12px; flex-wrap:wrap; background:rgba(255,255,255,0.03); border:1px solid var(--c-border); border-radius:var(--r); padding:16px 20px; margin-bottom:40px; backdrop-filter:blur(8px); }
        .ob-vlabel { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--c-amber); white-space:nowrap; }
        .ob-lbtn { padding:6px 16px; border-radius:8px; border:1px solid transparent; font-size:12px; font-weight:500; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; background:rgba(255,255,255,0.05); color:var(--c-muted); }
        .ob-lbtn.active { background:rgba(76,175,101,0.15); color:var(--c-mint); border-color:rgba(76,175,101,0.3); }
        .ob-guide-btn { margin-left:auto; padding:9px 20px; border-radius:10px; background:linear-gradient(135deg,var(--c-gold),var(--c-amber)); color:#060d08; font-weight:700; font-size:12px; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; display:flex; align-items:center; gap:6px; transition:all 0.22s; white-space:nowrap; box-shadow:0 4px 20px rgba(196,127,26,0.35); }
        .ob-guide-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(196,127,26,0.45); }
        .ob-guide-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
        .ob-stop-all { padding:9px 16px; border-radius:10px; background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.25); color:#f87171; font-size:12px; cursor:pointer; font-family:'DM Sans',sans-serif; }
        .ob-status { display:flex; align-items:center; gap:12px; background:rgba(76,175,101,0.08); border:1px solid rgba(76,175,101,0.25); border-radius:12px; padding:12px 16px; margin-bottom:24px; animation:slideIn 0.3s ease; }
        @keyframes slideIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .ob-status-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; animation:pulse 0.9s infinite; }
        .ob-status-dot.speak { background:var(--c-amber); }
        .ob-status-dot.listen { background:var(--c-leaf); }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }
        .ob-status-txt { font-family:'Space Mono',monospace; font-size:11px; color:var(--c-mint); flex:1; }
        .ob-status-stop { padding:3px 10px; border-radius:6px; font-size:10px; cursor:pointer; background:rgba(248,113,113,0.15); border:1px solid rgba(248,113,113,0.3); color:#f87171; }
        .ob-field { margin-bottom:24px; }
        .ob-flabel { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
        .ob-ficon { width:28px; height:28px; border-radius:7px; background:rgba(196,127,26,0.1); border:1px solid rgba(196,127,26,0.2); display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
        .ob-fname { font-size:12px; font-weight:600; color:var(--c-warm); letter-spacing:0.2px; }
        .ob-fhint { margin-left:auto; font-family:'Space Mono',monospace; font-size:9px; color:rgba(240,232,213,0.2); }
        .ob-iw { position:relative; }
        .ob-input { width:100%; padding:13px 50px 13px 16px; background:rgba(255,255,255,0.03); border:1px solid rgba(196,127,26,0.18); border-radius:var(--r-sm); font-size:14px; color:var(--c-cream); font-family:'DM Sans',sans-serif; outline:none; transition:all 0.22s; }
        .ob-input::placeholder { color:rgba(240,232,213,0.2); }
        .ob-input:focus { border-color:rgba(76,175,101,0.45); background:rgba(26,64,37,0.2); box-shadow:0 0 0 3px rgba(76,175,101,0.07); }
        .ob-input.lit { border-color:rgba(76,175,101,0.5); background:rgba(26,64,37,0.25); }
        .ob-mic { position:absolute; right:10px; top:50%; transform:translateY(-50%); width:32px; height:32px; border-radius:8px; background:rgba(196,127,26,0.1); border:1px solid rgba(196,127,26,0.22); color:var(--c-amber); cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; transition:all 0.18s; }
        .ob-mic:hover { background:rgba(196,127,26,0.2); }
        .ob-mic.on { background:rgba(76,175,101,0.18); border-color:rgba(76,175,101,0.45); color:var(--c-leaf); animation:micGlow 0.9s infinite; }
        @keyframes micGlow { 0%,100%{box-shadow:0 0 0 0 rgba(76,175,101,0.3)} 50%{box-shadow:0 0 0 7px rgba(76,175,101,0)} }
        .ob-submit-wrap { margin-top:52px; text-align:center; }
        .ob-submit { padding:16px 56px; border-radius:14px; border:none; background:linear-gradient(135deg,var(--c-sage),var(--c-leaf)); color:white; font-size:15px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; letter-spacing:0.2px; box-shadow:0 8px 32px rgba(76,175,101,0.3); transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .ob-submit:hover { transform:translateY(-3px); box-shadow:0 16px 48px rgba(76,175,101,0.4); }
        .ob-submit:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
        .ob-submit-note { margin-top:12px; font-family:'Space Mono',monospace; font-size:9.5px; color:var(--c-muted); letter-spacing:0.5px; }
        .ob-success { text-align:center; padding:60px 24px; display:flex; flex-direction:column; align-items:center; gap:20px; }
        .ob-success-ic { width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg,var(--c-sage),var(--c-leaf)); display:flex; align-items:center; justify-content:center; font-size:34px; box-shadow:0 0 0 20px rgba(76,175,101,0.08); animation:pop 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes pop { from{transform:scale(0)} to{transform:scale(1)} }
        .ob-success-t { font-family:'Cormorant Garamond',serif; font-size:2.2rem; font-weight:700; }
      `}</style>

      <div className="ob">
        <section className="ob-hero">
          <div className="ob-hero-bg" />
          <div className="ob-hero-grid" />
          {particles.map(p => (
            <div key={p.id} className="ob-particle" style={{ left:p.left, top:p.top, width:p.size, height:p.size, animationDelay:p.delay, animationDuration:p.dur, '--op':p.op }} />
          ))}
          <div className="ob-hero-content">
            <div className={`ob-tag ${step >= 1 ? "show" : ""}`}>{t.tag}</div>
            <h1 className={`ob-h1 ${step >= 2 ? "show" : ""}`}>
              {t.hero1} <em>{t.hero1em}</em><br />{t.hero2}
            </h1>
            <p className={`ob-sub ${step >= 3 ? "show" : ""}`}>{t.sub}</p>
          </div>
          <div className="ob-scroll">
            <span>SCROLL</span>
            <div className="ob-scroll-line" />
          </div>
        </section>

        <section className="ob-form-sec" ref={formRef}>
          <div className="ob-form-inner">
            <div className="ob-form-hd">
              <div className="ob-eyebrow">{t.step}</div>
              <h2 className="ob-form-title">{t.formTitle}<br /><em>{t.formTitleEm}</em></h2>
            </div>

            <div className="ob-vbar">
              <span className="ob-vlabel">{t.voiceLabel}</span>
              {["en", "hi", "ml"].map(l => (
                <button key={l} className={`ob-lbtn ${voiceLang === l ? "active" : ""}`} onClick={() => setVoiceLang(l)}>
                  {LANG_NAMES[l]}
                </button>
              ))}
              <button className="ob-guide-btn" onClick={guideAll} disabled={guideActive || isSpeaking || isListening}>
                {t.guideBtn}
              </button>
              {(guideActive || isSpeaking || isListening) && (
                <button className="ob-stop-all" onClick={stopAll}>{t.stopBtn}</button>
              )}
            </div>

            {(isSpeaking || isListening) && (
              <div className="ob-status">
                <div className={`ob-status-dot ${isSpeaking ? "speak" : "listen"}`} />
                <span className="ob-status-txt">
                  {isSpeaking ? t.speakingTxt(voiceLang) : t.listeningTxt(voiceLang, transcript)}
                </span>
                <button className="ob-status-stop" onClick={stopAll}>{t.stopBtn}</button>
              </div>
            )}

            {submitted ? (
              <div className="ob-success">
                <div className="ob-success-ic">✓</div>
                <h3 className="ob-success-t">{t.savedTitle}</h3>
                <p style={{ color:"var(--c-muted)", fontSize:"14px" }}>{t.savedSub}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {FIELDS.map((field, idx) => (
                  <div key={field.name} className="ob-field" style={{ animationDelay:`${idx * 0.07}s` }}>
                    <div className="ob-flabel">
                      <div className="ob-ficon">{field.icon}</div>
                      <span className="ob-fname">{field.labels[lang] || field.labels.en}</span>
                      <span className="ob-fhint">{field.labels.en}</span>
                    </div>
                    <div className="ob-iw">
                      <input
                        className={`ob-input ${activeField === field.name ? "lit" : ""}`}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder[lang] || field.placeholder.en}
                        value={formData[field.name]}
                        onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                        onFocus={() => setActiveField(field.name)}
                        onBlur={() => setActiveField(null)}
                        required
                        step={field.type === "number" ? "0.01" : undefined}
                        min={field.type === "number" ? "0" : undefined}
                      />
                      <button
                        type="button"
                        className={`ob-mic ${listeningFor === field.name ? "on" : ""}`}
                        onClick={() => listeningFor === field.name ? stopAll() : speakThenListen(field.name, voiceLang)}
                        title={`Voice input for ${field.labels.en}`}
                      >
                        {listeningFor === field.name ? "⏹" : "🎙"}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="ob-submit-wrap">
                  <button type="submit" className="ob-submit" disabled={submitting}>
                    {submitting ? t.savingBtn : t.saveBtn}
                  </button>
                  <p className="ob-submit-note">{t.secureNote}</p>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
