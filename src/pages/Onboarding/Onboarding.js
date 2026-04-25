import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext";

const FIELDS = [
  {
    name: "name",
    labels: { en:"Your Name", hi:"आपका नाम", ml:"നിങ്ങളുടെ പേര്", ta:"உங்கள் பெயர்", te:"మీ పేరు", kn:"ನಿಮ್ಮ ಹೆಸರು", bn:"আপনার নাম", mr:"तुमचे नाव", gu:"તમારું નામ", pa:"ਤੁਹਾਡਾ ਨਾਮ" },
    guideKey: "ob_field_name_guide",
    placeholderKey: "ob_field_name_placeholder",
    icon: "👤", type: "text",
  },
  {
    name: "location",
    labels: { en:"Location / Village", hi:"स्थान / गाँव", ml:"സ്ഥലം / ഗ്രാമം", ta:"இடம் / கிராமம்", te:"స్థానం / గ్రామం", kn:"ಸ್ಥಳ / ಗ್ರಾಮ", bn:"অবস্থান / গ্রাম", mr:"ठिकाण / गाव", gu:"સ્થળ / ગામ", pa:"ਸਥਾਨ / ਪਿੰਡ" },
    guideKey: "ob_field_location_guide",
    placeholderKey: "ob_field_location_placeholder",
    icon: "📍", type: "text",
  },
  {
    name: "landSize",
    labels: { en:"Land Size (acres)", hi:"ज़मीन (एकड़)", ml:"ഭൂമി (ഏക്കർ)", ta:"நில அளவு (ஏக்கர்)", te:"భూమి (ఎకరాలు)", kn:"ಭೂಮಿ (ಎಕರೆ)", bn:"জমির আয়তন (একর)", mr:"जमीन (एकर)", gu:"જમીન (એકર)", pa:"ਜ਼ਮੀਨ (ਏਕੜ)" },
    guideKey: "ob_field_land_guide",
    placeholderKey: "ob_field_land_placeholder",
    icon: "🌾", type: "number",
  },
  {
    name: "crop",
    labels: { en:"Primary Crop", hi:"मुख्य फसल", ml:"പ്രധാന വിള", ta:"முதன்மை பயிர்", te:"ప్రధాన పంట", kn:"ಮುಖ್ಯ ಬೆಳೆ", bn:"প্রধান ফসল", mr:"मुख्य पीक", gu:"મુખ્ય પાક", pa:"ਮੁੱਖ ਫਸਲ" },
    guideKey: "ob_field_crop_guide",
    placeholderKey: "ob_field_crop_placeholder",
    icon: "🌱", type: "text",
  },
  {
    name: "soilType",
    labels: { en:"Soil Type", hi:"मिट्टी का प्रकार", ml:"മണ്ണിന്റെ തരം", ta:"மண் வகை", te:"నేల రకం", kn:"ಮಣ್ಣಿನ ಪ್ರಕಾರ", bn:"মাটির ধরন", mr:"मातीचा प्रकार", gu:"જમીનનો પ્રકાર", pa:"ਮਿੱਟੀ ਦੀ ਕਿਸਮ" },
    guideKey: "ob_field_soil_guide",
    placeholderKey: "ob_field_soil_placeholder",
    icon: "🪨", type: "text",
  },
  {
    name: "irrigationType",
    labels: { en:"Irrigation Method", hi:"सिंचाई का तरीका", ml:"ജലസേചന രീതി", ta:"நீர்ப்பாசன முறை", te:"నీటిపారుదల పద్ధతి", kn:"ನೀರಾವರಿ ವಿಧಾನ", bn:"সেচের পদ্ধতি", mr:"सिंचनाची पद्धत", gu:"સિંચાઈ પદ્ધતિ", pa:"ਸਿੰਚਾਈ ਵਿਧੀ" },
    guideKey: "ob_field_irrigation_guide",
    placeholderKey: "ob_field_irrigation_placeholder",
    icon: "💧", type: "text",
  },
];

// All major Indian languages for voice
const LANG_CODES = {
  en:"en-US", hi:"hi-IN", ml:"ml-IN", ta:"ta-IN",
  te:"te-IN", kn:"kn-IN", bn:"bn-IN", mr:"mr-IN",
  gu:"gu-IN", pa:"pa-IN", ur:"ur-IN", or:"or-IN",
};

const LANG_NAMES = {
  en:"English",   hi:"हिंदी",   ml:"മലയാളം", ta:"தமிழ்",
  te:"తెలుగు",   kn:"ಕನ್ನಡ",   bn:"বাংলা",  mr:"मराठी",
  gu:"ગુજરાતી",  pa:"ਪੰਜਾਬੀ",  ur:"اردو",   or:"ଓଡ଼ିଆ",
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const [formData, setFormData] = useState({
    name:"", location:"", landSize:"", crop:"", soilType:"", irrigationType:"",
  });
  const [voiceLang,    setVoiceLang]    = useState(lang || "en");
  const [isListening,  setIsListening]  = useState(false);
  const [listeningFor, setListeningFor] = useState(null);
  const [isSpeaking,   setIsSpeaking]   = useState(false);
  const [transcript,   setTranscript]   = useState("");
  const [activeField,  setActiveField]  = useState(null);
  const [step,         setStep]         = useState(0);
  const [submitted,    setSubmitted]    = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [guideActive,  setGuideActive]  = useState(false);

  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i, left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
      size:`${Math.random()*5+2}px`, delay:`${Math.random()*10}s`,
      dur:`${Math.random()*15+10}s`, op: Math.random()*0.4+0.1,
    }))
  );

  const recognitionRef   = useRef(null);
  const guideActiveRef   = useRef(false);
  const formRef          = useRef(null);

  // Sync voiceLang with selected app language
  useEffect(() => { setVoiceLang(lang || "en"); }, [lang]);

  // Hero animation steps
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 200);
    const t2 = setTimeout(() => setStep(2), 800);
    const t3 = setTimeout(() => setStep(3), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Auto-scroll to form
  useEffect(() => {
    const timer = setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  // ── Speak a text and wait for it to finish ──
  const speakAsync = (text, l) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) { resolve(); return; }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang  = LANG_CODES[l] || "en-US";
      u.rate  = 0.88;
      u.pitch = 1.0;
      setIsSpeaking(true);
      u.onend   = () => { setIsSpeaking(false); resolve(); };
      u.onerror = () => { setIsSpeaking(false); resolve(); };
      window.speechSynthesis.speak(u);
    });
  };

  // ── Speak field prompt then start listening ──
  const speakThenListen = async (fieldName, l) => {
    if (recognitionRef.current) recognitionRef.current.abort();
    window.speechSynthesis?.cancel();

    const field = FIELDS.find(f => f.name === fieldName);
    if (!field) return;

    const guideText = t(field.guideKey);
    await speakAsync(guideText, l);
    await new Promise(r => setTimeout(r, 350));

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang            = LANG_CODES[l] || "en-US";
    recognition.interimResults  = true;
    recognition.maxAlternatives = 1;
    recognition.continuous      = false;
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
    recognition.onend   = () => { setIsListening(false); setListeningFor(null); };
    recognition.start();
  };

  // ── Guide all fields one by one ──
  const guideAll = async () => {
    if (guideActive) return;
    guideActiveRef.current = true;
    setGuideActive(true);
    for (const field of FIELDS) {
      if (!guideActiveRef.current) break;
      await speakThenListen(field.name, voiceLang);
      await new Promise(r => setTimeout(r, 700));
    }
    guideActiveRef.current = false;
    setGuideActive(false);
  };

  // ── Stop everything ──
  const stopAll = () => {
    window.speechSynthesis?.cancel();
    recognitionRef.current?.abort();
    guideActiveRef.current = false;
    setIsListening(false);
    setListeningFor(null);
    setIsSpeaking(false);
    setTranscript("");
    setGuideActive(false);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // ← YAHAN FIX KARO
      const userStr = localStorage.getItem("loggedInUser");
      const userEmail = userStr ? JSON.parse(userStr).email : null;

      const payload = {
        name:           formData.name,
        location:       formData.location,
        landSize:       parseFloat(formData.landSize) || 0,
        crop:           formData.crop,
        soilType:       formData.soilType,
        irrigationType: formData.irrigationType,
        email:          userEmail,  // ← CHANGED
      };

      await axios.post("https://krishi-sakhi-backend-6.onrender.com/api/farmers", payload);
      setSubmitted(true);
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (err) {
      console.error(err);
      alert("Error saving data. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const getFieldLabel = (field) => field.labels[lang] || field.labels.en;

  // Languages to show in voice bar — only those with SpeechRecognition support
  const voiceLangs = Object.entries(LANG_NAMES);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --c-bg:#060d08;--c-surface:#0c1a0e;--c-panel:rgba(255,255,255,0.025);
          --c-green:#1a4025;--c-sage:#2e6b3e;--c-leaf:#4caf65;--c-mint:#7dd99a;
          --c-gold:#c47f1a;--c-amber:#e8a832;--c-cream:#f0e8d5;--c-warm:#d4c4a0;
          --c-muted:rgba(240,232,213,0.4);--c-border:rgba(196,127,26,0.2);
          --r:16px;--r-sm:10px;
        }
        .ob{font-family:'DM Sans',sans-serif;background:var(--c-bg);min-height:100vh;color:var(--c-cream);overflow-x:hidden;}

        /* ── HERO ── */
        .ob-hero{
          position:relative;height:100vh;display:flex;flex-direction:column;
          align-items:center;justify-content:center;text-align:center;
          padding:40px 24px;overflow:hidden;
        }
        .ob-hero-bg{
          position:absolute;inset:0;z-index:0;
          background:
            radial-gradient(ellipse 60% 50% at 50% -10%,rgba(76,175,101,0.18) 0%,transparent 60%),
            radial-gradient(ellipse 40% 40% at 20% 80%,rgba(196,127,26,0.1) 0%,transparent 50%),
            linear-gradient(160deg,#060d08 0%,#0a1a0c 50%,#060d08 100%);
        }
        .ob-hero-grid{
          position:absolute;inset:0;z-index:1;
          background-image:
            linear-gradient(rgba(76,175,101,0.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(76,175,101,0.04) 1px,transparent 1px);
          background-size:60px 60px;
          mask-image:radial-gradient(ellipse at center,black 30%,transparent 70%);
        }
        .ob-particle{
          position:absolute;border-radius:50%;background:var(--c-leaf);z-index:2;
          animation:floatUp linear infinite;
        }
        @keyframes floatUp{
          0%{transform:translateY(20px) scale(0);opacity:0}
          20%{opacity:var(--op)}80%{opacity:var(--op)}
          100%{transform:translateY(-120px) scale(1);opacity:0}
        }
        .ob-hero-content{
          position:relative;z-index:3;display:flex;flex-direction:column;
          align-items:center;gap:24px;max-width:700px;
        }
        .ob-tag{
          display:inline-flex;align-items:center;gap:8px;padding:7px 20px;border-radius:40px;
          background:rgba(76,175,101,0.1);border:1px solid rgba(76,175,101,0.3);
          font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2.5px;
          text-transform:uppercase;color:var(--c-mint);
          opacity:0;transform:translateY(20px);
          transition:opacity 0.7s ease,transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .ob-tag.show{opacity:1;transform:translateY(0);}
        .ob-h1{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(3rem,7vw,5.5rem);font-weight:700;
          line-height:1.05;letter-spacing:-1.5px;color:var(--c-cream);
          opacity:0;transform:translateY(30px);
          transition:opacity 0.8s ease 0.15s,transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s;
        }
        .ob-h1.show{opacity:1;transform:translateY(0);}
        .ob-h1 em{font-style:italic;color:var(--c-leaf);}
        .ob-sub{
          font-size:clamp(0.95rem,2vw,1.1rem);color:var(--c-muted);font-weight:300;
          line-height:1.8;max-width:500px;
          opacity:0;transform:translateY(20px);
          transition:opacity 0.8s ease 0.3s,transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s;
        }
        .ob-sub.show{opacity:1;transform:translateY(0);}
        .ob-scroll{
          position:absolute;bottom:28px;left:50%;transform:translateX(-50%);z-index:3;
          display:flex;flex-direction:column;align-items:center;gap:6px;
          color:var(--c-muted);font-family:'Space Mono',monospace;font-size:9px;
          letter-spacing:2px;animation:bounce 2.5s ease-in-out infinite;
        }
        @keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}
        .ob-scroll-line{width:1px;height:44px;background:linear-gradient(to bottom,transparent,var(--c-gold));}

        /* ── FORM SECTION ── */
        .ob-form-sec{
          position:relative;padding:100px 24px 80px;
          background:radial-gradient(ellipse at 0% 30%,rgba(26,64,37,0.35) 0%,transparent 55%),var(--c-surface);
        }
        .ob-form-sec::before{
          content:'';position:absolute;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,var(--c-gold),transparent);
        }
        .ob-form-inner{max-width:700px;margin:0 auto;position:relative;z-index:2;}
        .ob-form-hd{text-align:center;margin-bottom:52px;}
        .ob-eyebrow{
          font-family:'Space Mono',monospace;font-size:9px;letter-spacing:3px;
          text-transform:uppercase;color:var(--c-amber);margin-bottom:14px;
        }
        .ob-form-title{
          font-family:'Cormorant Garamond',serif;font-size:clamp(2.2rem,5vw,3.5rem);
          font-weight:700;color:var(--c-cream);line-height:1.1;
        }
        .ob-form-title em{font-style:italic;color:var(--c-leaf);}

        /* ── VOICE BAR ── */
        .ob-vbar{
          background:rgba(255,255,255,0.03);border:1px solid var(--c-border);
          border-radius:var(--r);padding:16px 20px;margin-bottom:36px;
          backdrop-filter:blur(8px);
        }
        .ob-vbar-top{
          display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;
        }
        .ob-vlabel{
          font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;
          text-transform:uppercase;color:var(--c-amber);white-space:nowrap;flex-shrink:0;
        }
        .ob-vbar-btns{
          display:flex;flex-wrap:wrap;gap:6px;flex:1;
        }
        .ob-lbtn{
          padding:5px 13px;border-radius:8px;border:1px solid transparent;
          font-size:12px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;
          transition:all 0.2s;background:rgba(255,255,255,0.05);color:var(--c-muted);
        }
        .ob-lbtn.active{
          background:rgba(76,175,101,0.15);color:var(--c-mint);border-color:rgba(76,175,101,0.3);
        }
        .ob-vbar-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
        .ob-guide-btn{
          padding:10px 22px;border-radius:10px;
          background:linear-gradient(135deg,var(--c-gold),var(--c-amber));
          color:#060d08;font-weight:700;font-size:12px;border:none;cursor:pointer;
          font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px;
          transition:all 0.22s;box-shadow:0 4px 20px rgba(196,127,26,0.35);
        }
        .ob-guide-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(196,127,26,0.45);}
        .ob-guide-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
        .ob-stop-btn{
          padding:9px 16px;border-radius:10px;
          background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.25);
          color:#f87171;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;
        }

        /* Status indicator */
        .ob-status{
          display:flex;align-items:center;gap:12px;
          background:rgba(76,175,101,0.08);border:1px solid rgba(76,175,101,0.25);
          border-radius:12px;padding:12px 16px;margin-bottom:24px;
          animation:slideInOb 0.3s ease;
        }
        @keyframes slideInOb{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .ob-status-dot{
          width:9px;height:9px;border-radius:50%;flex-shrink:0;animation:obPulse 0.9s infinite;
        }
        .ob-status-dot.speak{background:var(--c-amber);}
        .ob-status-dot.listen{background:var(--c-leaf);}
        @keyframes obPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(0.7)}}
        .ob-status-txt{font-family:'Space Mono',monospace;font-size:11px;color:var(--c-mint);flex:1;}
        .ob-status-stop{
          padding:3px 10px;border-radius:6px;font-size:10px;cursor:pointer;
          background:rgba(248,113,113,0.15);border:1px solid rgba(248,113,113,0.3);color:#f87171;
        }

        /* ── FIELDS ── */
        .ob-field{margin-bottom:26px;}
        .ob-flabel{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
        .ob-fnum{
          width:20px;height:20px;border-radius:50%;
          background:rgba(76,175,101,0.15);border:1px solid rgba(76,175,101,0.3);
          display:flex;align-items:center;justify-content:center;
          font-family:'Space Mono',monospace;font-size:9px;color:var(--c-mint);flex-shrink:0;
        }
        .ob-ficon{
          width:32px;height:32px;border-radius:9px;
          background:rgba(196,127,26,0.1);border:1px solid rgba(196,127,26,0.2);
          display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;
        }
        .ob-fname{font-size:13px;font-weight:600;color:var(--c-warm);letter-spacing:0.2px;}
        .ob-iw{position:relative;}
        .ob-input{
          width:100%;padding:14px 52px 14px 16px;
          background:rgba(255,255,255,0.03);border:1px solid rgba(196,127,26,0.18);
          border-radius:var(--r-sm);font-size:14px;color:var(--c-cream);
          font-family:'DM Sans',sans-serif;outline:none;transition:all 0.22s;
        }
        .ob-input::placeholder{color:rgba(240,232,213,0.22);}
        .ob-input:focus{border-color:rgba(76,175,101,0.45);background:rgba(26,64,37,0.2);box-shadow:0 0 0 3px rgba(76,175,101,0.07);}
        .ob-input.lit{border-color:rgba(76,175,101,0.5);background:rgba(26,64,37,0.25);}
        .ob-mic{
          position:absolute;right:10px;top:50%;transform:translateY(-50%);
          width:34px;height:34px;border-radius:9px;
          background:rgba(196,127,26,0.1);border:1px solid rgba(196,127,26,0.22);
          color:var(--c-amber);cursor:pointer;font-size:15px;
          display:flex;align-items:center;justify-content:center;transition:all 0.18s;
        }
        .ob-mic:hover{background:rgba(196,127,26,0.2);}
        .ob-mic.on{
          background:rgba(76,175,101,0.18);border-color:rgba(76,175,101,0.45);
          color:var(--c-leaf);animation:micGlow 0.9s infinite;
        }
        @keyframes micGlow{0%,100%{box-shadow:0 0 0 0 rgba(76,175,101,0.3)}50%{box-shadow:0 0 0 7px rgba(76,175,101,0)}}

        /* ── SUBMIT ── */
        .ob-submit-wrap{margin-top:52px;text-align:center;}
        .ob-submit{
          padding:16px 56px;border-radius:14px;border:none;
          background:linear-gradient(135deg,var(--c-sage),var(--c-leaf));
          color:white;font-size:15px;font-weight:600;font-family:'DM Sans',sans-serif;
          cursor:pointer;box-shadow:0 8px 32px rgba(76,175,101,0.3);
          transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .ob-submit:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(76,175,101,0.4);}
        .ob-submit:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
        .ob-submit-note{margin-top:12px;font-family:'Space Mono',monospace;font-size:9.5px;color:var(--c-muted);}

        /* ── SUCCESS ── */
        .ob-success{
          text-align:center;padding:60px 24px;
          display:flex;flex-direction:column;align-items:center;gap:20px;
        }
        .ob-success-ic{
          width:80px;height:80px;border-radius:50%;
          background:linear-gradient(135deg,var(--c-sage),var(--c-leaf));
          display:flex;align-items:center;justify-content:center;font-size:34px;
          box-shadow:0 0 0 20px rgba(76,175,101,0.08);
          animation:obPop 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes obPop{from{transform:scale(0)}to{transform:scale(1)}}
        .ob-success-t{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:700;}

        /* Progress bar */
        .ob-progress{
          position:fixed;top:0;left:0;right:0;height:3px;
          background:linear-gradient(90deg,var(--c-leaf),var(--c-amber));
          z-index:1000;transform-origin:left;
          animation:obProgressIn 2.5s ease forwards;
        }
        @keyframes obProgressIn{from{transform:scaleX(0)}to{transform:scaleX(1)}}
      `}</style>

      <div className="ob">
        <div className="ob-progress" />

        {/* ── HERO ── */}
        <section className="ob-hero">
          <div className="ob-hero-bg" />
          <div className="ob-hero-grid" />
          {particles.map(p => (
            <div
              key={p.id} className="ob-particle"
              style={{ left:p.left, top:p.top, width:p.size, height:p.size, animationDelay:p.delay, animationDuration:p.dur, "--op":p.op }}
            />
          ))}
          <div className="ob-hero-content">
            <div className={`ob-tag ${step >= 1 ? "show" : ""}`}>{t("ob_tag")}</div>
            <h1 className={`ob-h1 ${step >= 2 ? "show" : ""}`}>
              {t("ob_hero1")} <em>{t("ob_hero1em")}</em><br />{t("ob_hero2")}
            </h1>
            <p className={`ob-sub ${step >= 3 ? "show" : ""}`}>{t("ob_sub")}</p>
          </div>
          <div className="ob-scroll">
            <span>SCROLL</span>
            <div className="ob-scroll-line" />
          </div>
        </section>

        {/* ── FORM ── */}
        <section className="ob-form-sec" ref={formRef}>
          <div className="ob-form-inner">
            <div className="ob-form-hd">
              <div className="ob-eyebrow">{t("ob_step")}</div>
              <h2 className="ob-form-title">{t("ob_form_title")}<br /><em>{t("ob_form_title_em")}</em></h2>
            </div>

            {/* ── VOICE LANGUAGE BAR ── */}
            <div className="ob-vbar">
              <div className="ob-vbar-top">
                <span className="ob-vlabel">{t("ob_voice_label")}</span>
                <div className="ob-vbar-btns">
                  {voiceLangs.map(([code, name]) => (
                    <button
                      key={code}
                      className={`ob-lbtn ${voiceLang === code ? "active" : ""}`}
                      onClick={() => setVoiceLang(code)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ob-vbar-actions">
                <button
                  className="ob-guide-btn"
                  onClick={guideAll}
                  disabled={guideActive || isSpeaking || isListening}
                >
                  🎙 {t("ob_guide_btn")}
                </button>
                {(guideActive || isSpeaking || isListening) && (
                  <button className="ob-stop-btn" onClick={stopAll}>✕ {t("ob_stop_btn")}</button>
                )}
              </div>
            </div>

            {/* Status indicator */}
            {(isSpeaking || isListening) && (
              <div className="ob-status">
                <div className={`ob-status-dot ${isSpeaking ? "speak" : "listen"}`} />
                <span className="ob-status-txt">
                  {isSpeaking
                    ? `🔊 Speaking in ${LANG_NAMES[voiceLang] || voiceLang}…`
                    : `🎙 Listening in ${LANG_NAMES[voiceLang] || voiceLang}… ${transcript ? `"${transcript}"` : "speak now"}`
                  }
                </span>
                <button className="ob-status-stop" onClick={stopAll}>{t("ob_stop_btn")}</button>
              </div>
            )}

            {/* ── FORM FIELDS ── */}
            {submitted ? (
              <div className="ob-success">
                <div className="ob-success-ic">✓</div>
                <h3 className="ob-success-t">{t("ob_saved_title")}</h3>
                <p style={{ color:"var(--c-muted)", fontSize:"14px" }}>{t("ob_saved_sub")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {FIELDS.map((field, idx) => (
                  <div key={field.name} className="ob-field">
                    <div className="ob-flabel">
                      <div className="ob-fnum">{idx + 1}</div>
                      <div className="ob-ficon">{field.icon}</div>
                      <span className="ob-fname">{getFieldLabel(field)}</span>
                    </div>
                    <div className="ob-iw">
                      <input
                        className={`ob-input ${activeField === field.name ? "lit" : ""}`}
                        name={field.name}
                        type={field.type}
                        placeholder={t(field.placeholderKey)}
                        value={formData[field.name]}
                        onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                        onFocus={() => setActiveField(field.name)}
                        onBlur={() => setActiveField(null)}
                        required
                        step={field.type === "number" ? "0.01" : undefined}
                        min={field.type === "number" ? "0"    : undefined}
                      />
                      <button
                        type="button"
                        className={`ob-mic ${listeningFor === field.name ? "on" : ""}`}
                        onClick={() =>
                          listeningFor === field.name
                            ? stopAll()
                            : speakThenListen(field.name, voiceLang)
                        }
                        title={`Voice input for ${getFieldLabel(field)}`}
                      >
                        {listeningFor === field.name ? "⏹" : "🎙"}
                      </button>
                    </div>
                  </div>
                ))}

                <div className="ob-submit-wrap">
                  <button type="submit" className="ob-submit" disabled={submitting}>
                    {submitting ? `⏳ ${t("ob_saving_btn")}` : `✓ ${t("ob_save_btn")}`}
                  </button>
                  <p className="ob-submit-note">🔒 {t("ob_secure_note")}</p>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  );
}