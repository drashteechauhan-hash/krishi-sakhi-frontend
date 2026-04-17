<<<<<<< HEAD
import React, { useState, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";

=======
import React from "react";

import ex1 from "../../assets/ex1.jpg";
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
import ex2 from "../../assets/ex2.jpg";
import ex3 from "../../assets/ex3.jpg";
import ex4 from "../../assets/ex4.jpg";
import beforeImg from "../../assets/before.jpg";
import afterImg from "../../assets/after.jpg";
<<<<<<< HEAD
import heroVideo from "../../assets/about-krishi.mp4";

const TEXT = {
  en: {
    eyebrow: "🌿 About Krishi Sakhi",
    h1a: "Your AI Farming",
    h1b: "Companion",
    subh1: "About Krishi Sakhi",
    p1: "Krishi Sakhi is an AI-driven personal farming assistant designed to support smallholder farmers in Kerala. It provides personalized guidance based on your crops, soil type, irrigation, and local weather conditions.",
    videoBadge: "🎬 Krishi Sakhi Story",
    videoTitle: "Farmer Welfare Schemes Explained",
    videoSub: "Learn about PM-Kisan, crop insurance & more",
    stats: [
      { number: "24/7", label: "AI Support" },
      { number: "2", label: "Languages" },
      { number: "100%", label: "Free to Use" },
      { number: "🌱", label: "Just Getting Started" },
    ],
    featuresEyebrow: "✦ What We Offer",
    featuresTitle: "Core Features",
    features: [
      { title: "Farmer & Farm Profiling", desc: "Capture details like location, crop, soil, and irrigation for personalized advice." },
      { title: "Digital Farm Diary", desc: "Log daily activities like sowing, irrigation, and pest management easily." },
      { title: "AI-Powered Advisory", desc: "Get context-aware recommendations for crops, weather, pests and market prices." },
    ],
    baEyebrow: "✦ Transformation",
    baTitle: "Before & After",
    beforeLabel: "❌ Before Krishi Sakhi",
    afterLabel: "✅ After Krishi Sakhi",
    impactEyebrow: "✦ Why It Matters",
    impactTitle: "Our Impact",
    impacts: [
      "Empowers farmers with personalized, on-demand support.",
      "Bridges the knowledge gap for smallholder farmers.",
      "Promotes sustainable farming practices.",
      "Acts as a digital companion throughout the crop cycle.",
    ],
    ctaH: "🌾 Ready to grow smarter?",
    ctaSub: "Be among the first Kerala farmers to use Krishi Sakhi.",
    ctaBtn: "Get Started Free →",
  },
  hi: {
    eyebrow: "🌿 कृषि सखी के बारे में",
    h1a: "आपका AI कृषि",
    h1b: "साथी",
    subh1: "कृषि सखी के बारे में",
    p1: "कृषि सखी एक AI-संचालित व्यक्तिगत कृषि सहायक है जो केरल के छोटे किसानों को समर्थन देने के लिए डिज़ाइन किया गया है। यह आपकी फसल, मिट्टी के प्रकार, सिंचाई और स्थानीय मौसम के आधार पर व्यक्तिगत मार्गदर्शन प्रदान करता है।",
    videoBadge: "🎬 कृषि सखी की कहानी",
    videoTitle: "किसान कल्याण योजनाएं समझाई गईं",
    videoSub: "PM-किसान, फसल बीमा और अधिक जानें",
    stats: [
      { number: "24/7", label: "AI सहायता" },
      { number: "2", label: "भाषाएं" },
      { number: "100%", label: "मुफ्त उपयोग" },
      { number: "🌱", label: "अभी शुरू हो रहे हैं" },
    ],
    featuresEyebrow: "✦ हम क्या प्रदान करते हैं",
    featuresTitle: "मुख्य विशेषताएं",
    features: [
      { title: "किसान प्रोफाइलिंग", desc: "स्थान, फसल, मिट्टी और सिंचाई जैसी जानकारी दर्ज करें।" },
      { title: "डिजिटल खेत डायरी", desc: "बुवाई, सिंचाई और कीट नियंत्रण जैसी दैनिक गतिविधियां दर्ज करें।" },
      { title: "AI सलाह", desc: "फसल, मौसम, कीटों और बाज़ार की कीमतों पर संदर्भ-आधारित सिफारिशें पाएं।" },
    ],
    baEyebrow: "✦ बदलाव",
    baTitle: "पहले और बाद में",
    beforeLabel: "❌ कृषि सखी से पहले",
    afterLabel: "✅ कृषि सखी के बाद",
    impactEyebrow: "✦ यह क्यों मायने रखता है",
    impactTitle: "हमारा प्रभाव",
    impacts: [
      "किसानों को व्यक्तिगत, मांग पर सहायता से सशक्त बनाता है।",
      "छोटे किसानों के लिए ज्ञान की खाई पाटता है।",
      "टिकाऊ खेती प्रथाओं को बढ़ावा देता है।",
      "पूरे फसल चक्र में डिजिटल साथी के रूप में कार्य करता है।",
    ],
    ctaH: "🌾 क्या आप स्मार्ट तरीके से खेती करने के लिए तैयार हैं?",
    ctaSub: "कृषि सखी का उपयोग करने वाले पहले किसानों में शामिल हों।",
    ctaBtn: "मुफ्त में शुरू करें →",
  },
  ml: {
    eyebrow: "🌿 കൃഷി സഖിയെക്കുറിച്ച്",
    h1a: "നിങ്ങളുടെ AI കൃഷി",
    h1b: "സഹായി",
    subh1: "കൃഷി സഹകാരിയെക്കുറിച്ച്",
    p1: "കൃഷി സഖി കേരളത്തിലെ ചെറുകിട കർഷകരെ പിന്തുണയ്ക്കുന്നതിനായി രൂപകൽപ്പന ചെയ്ത AI-അധിഷ്ഠിത വ്യക്തിഗത കൃഷി സഹായിയാണ്. നിങ്ങളുടെ വിള, മണ്ണ്, ജലസേചനം, പ്രാദേശിക കാലാവസ്ഥ എന്നിവ അടിസ്ഥാനമാക്കി വ്യക്തിഗത മാർഗ്ഗനിർദ്ദേശം നൽകുന്നു.",
    videoBadge: "🎬 കൃഷി സഖി കഥ",
    videoTitle: "കർഷക ക്ഷേമ പദ്ധതികൾ വിശദീകരിച്ചു",
    videoSub: "PM-കിസാൻ, വിള ഇൻഷുറൻസ് & കൂടുതൽ",
    stats: [
      { number: "24/7", label: "AI പിന്തുണ" },
      { number: "2", label: "ഭാഷകൾ" },
      { number: "100%", label: "സൗജന്യം" },
      { number: "🌱", label: "തുടക്കം കുറിക്കുന്നു" },
    ],
    featuresEyebrow: "✦ ഞങ്ങൾ നൽകുന്നത്",
    featuresTitle: "പ്രധാന സവിശേഷതകൾ",
    features: [
      { title: "കർഷക-ഫാം പ്രൊഫൈലിംഗ്", desc: "സ്ഥാനം, വിള, മണ്ണ്, വെള്ളസേചനം എന്നിവ രേഖപ്പെടുത്തുക." },
      { title: "ഡിജിറ്റൽ ഡയറി", desc: "ദൈനംദിന കൃഷി പ്രവർത്തനങ്ങൾ എളുപ്പത്തിൽ രേഖപ്പെടുത്തുക." },
      { title: "AI ഉപദേശം", desc: "വിളകൾ, കാലാവസ്ഥ, കീടങ്ങൾ, വിപണി വിലകൾ അടിസ്ഥാനത്തിൽ ഉപദേശം." },
    ],
    baEyebrow: "✦ മാറ്റം",
    baTitle: "മുമ്പും ശേഷവും",
    beforeLabel: "❌ കൃഷി സഖിക്ക് മുമ്പ്",
    afterLabel: "✅ കൃഷി സഖിക്ക് ശേഷം",
    impactEyebrow: "✦ ഇത് പ്രധാനം എന്തുകൊണ്ട്",
    impactTitle: "നമ്മുടെ സ്വാധീനം",
    impacts: [
      "കർഷകർക്ക് വ്യക്തിഗത, ആവശ്യാനുസരണം പിന്തുണ.",
      "ചെറിയ കർഷകർക്ക് വിജ്ഞാനത്തിലേക്ക് പ്രവേശനം.",
      "സുസ്ഥിര കൃഷി രീതികൾ പ്രോത്സാഹിപ്പിക്കുന്നു.",
      "വിള ചക്രത്തിലെ ഡിജിറ്റൽ കൂട്ടുകാരൻ.",
    ],
    ctaH: "🌾 ബുദ്ധിപൂർവ്വം കൃഷി ചെയ്യാൻ തയ്യാറാണോ?",
    ctaSub: "കൃഷി സഖി ഉപയോഗിക്കുന്ന ആദ്യ കർഷകരിൽ ഒരാളാകൂ.",
    ctaBtn: "സൗജന്യമായി ആരംഭിക്കൂ →",
  },
};

const FEAT_IMGS = [ex2, ex3, ex4];

function About() {
  const { lang } = useLanguage();
  const t = TEXT[lang] || TEXT.en;

  const [videoError, setVideoError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setPlaying(true); }
    else { videoRef.current.pause(); setPlaying(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .ab-wrap { max-width:1100px; margin:0 auto; padding:40px 20px 80px; font-family:'DM Sans',Arial,sans-serif; color:#333; }
        .ab-hero { display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center; margin-bottom:64px; }
        @media(max-width:768px){.ab-hero{grid-template-columns:1fr}}
        .ab-hero-eyebrow { font-size:11px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:#2e7d32; margin-bottom:12px; }
        .ab-hero-h1 { font-size:clamp(1.8rem,4vw,2.6rem); font-weight:700; color:#1b5e20; line-height:1.15; margin-bottom:8px; }
        .ab-hero-h1 span { color:#2e7d32; }
        .ab-hero-h1-ml { font-size:clamp(1.1rem,2.5vw,1.5rem); font-weight:600; color:#388e3c; margin-bottom:20px; line-height:1.3; }
        .ab-hero-p { font-size:15px; line-height:1.75; color:#555; margin-bottom:12px; }
        .ab-video-wrap { position:relative; border-radius:16px; overflow:hidden; box-shadow:0 12px 48px rgba(46,125,50,0.18); background:#000; aspect-ratio:16/9; }
        .ab-video-wrap video { width:100%; height:100%; object-fit:cover; display:block; }
        .ab-video-overlay { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.12); cursor:pointer; transition:background 0.2s; }
        .ab-video-overlay:hover { background:rgba(0,0,0,0.22); }
        .ab-play-btn { width:62px; height:62px; border-radius:50%; background:rgba(255,255,255,0.95); display:flex; align-items:center; justify-content:center; font-size:22px; box-shadow:0 4px 20px rgba(0,0,0,0.25); transition:transform 0.2s; color:#2e7d32; font-weight:700; }
        .ab-video-overlay:hover .ab-play-btn { transform:scale(1.1); }
        .ab-video-badge { position:absolute; bottom:12px; left:12px; background:rgba(46,125,50,0.9); color:white; font-size:11px; font-weight:600; padding:4px 12px; border-radius:20px; }
        .ab-video-error { width:100%; aspect-ratio:16/9; background:#f1f8e9; border:2px dashed #a5d6a7; border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; color:#555; font-size:14px; text-align:center; padding:20px; }
        .ab-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:#e8f5e9; border:1px solid #c8e6c9; border-radius:14px; overflow:hidden; margin-bottom:64px; }
        @media(max-width:600px){.ab-stats{grid-template-columns:repeat(2,1fr)}}
        .ab-stat { padding:24px 16px; text-align:center; background:#fff; transition:background 0.2s; }
        .ab-stat:hover { background:#f1f8e9; }
        .ab-stat-num { font-size:2rem; font-weight:700; color:#2e7d32; line-height:1; margin-bottom:6px; }
        .ab-stat-label { font-size:12px; color:#777; font-weight:600; }
        .ab-section-eyebrow { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#81c784; margin-bottom:6px; }
        .ab-section-h { font-size:clamp(1.3rem,3vw,1.9rem); font-weight:700; color:#2e7d32; margin-bottom:28px; line-height:1.2; }
        .ab-features { margin-bottom:64px; }
        .ab-features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        @media(max-width:768px){.ab-features-grid{grid-template-columns:1fr}}
        .ab-feat-card { border:1px solid #e8f5e9; border-radius:14px; padding:24px 20px; text-align:center; transition:transform 0.25s,box-shadow 0.25s,border-color 0.25s; background:#fff; }
        .ab-feat-card:hover { transform:translateY(-6px); box-shadow:0 12px 36px rgba(46,125,50,0.12); border-color:#a5d6a7; }
        .ab-feat-img-wrap { width:72px; height:72px; border-radius:12px; overflow:hidden; margin:0 auto 16px; border:2px solid #e8f5e9; }
        .ab-feat-img-wrap img { width:100%; height:100%; object-fit:cover; }
        .ab-feat-title { font-size:15px; font-weight:700; color:#1b5e20; margin-bottom:12px; }
        .ab-feat-desc { font-size:13px; color:#666; line-height:1.6; }
        .ab-ba { margin-bottom:64px; }
        .ab-ba-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; align-items:start; }
        @media(max-width:600px){.ab-ba-grid{grid-template-columns:1fr}}
        .ab-ba-card { border-radius:14px; overflow:hidden; border:1px solid #e8f5e9; transition:box-shadow 0.25s; }
        .ab-ba-card:hover { box-shadow:0 8px 28px rgba(46,125,50,0.12); }
        .ab-ba-card img { width:100%; aspect-ratio:3/2; object-fit:cover; display:block; }
        .ab-ba-label { padding:14px 16px; background:#fff; font-size:13.5px; font-weight:600; color:#2e7d32; }
        .ab-impact { margin-bottom:48px; }
        .ab-impact-list { display:flex; flex-direction:column; gap:12px; margin-bottom:28px; }
        .ab-impact-item { display:flex; gap:12px; align-items:flex-start; padding:14px 16px; background:#f9fbe7; border:1px solid #e8f5e9; border-radius:10px; border-left:3px solid #4caf50; transition:background 0.2s; }
        .ab-impact-item:hover { background:#f1f8e9; }
        .ab-impact-dot { width:8px; height:8px; border-radius:50%; background:#4caf50; flex-shrink:0; margin-top:5px; }
        .ab-impact-en { font-size:14px; font-weight:600; color:#333; }
        .ab-cta { text-align:center; padding:40px 32px; background:linear-gradient(135deg,#e8f5e9,#f1f8e9); border:1px solid #c8e6c9; border-radius:18px; }
        .ab-cta-h { font-size:1.3rem; font-weight:700; color:#1b5e20; margin-bottom:8px; }
        .ab-cta-sub { font-size:14px; color:#666; margin-bottom:24px; }
        .ab-cta-btn { display:inline-block; padding:13px 36px; background:#2e7d32; color:#fff; border-radius:12px; font-size:15px; font-weight:700; text-decoration:none; transition:all 0.22s; border:none; cursor:pointer; box-shadow:0 6px 20px rgba(46,125,50,0.25); }
        .ab-cta-btn:hover { background:#1b5e20; transform:translateY(-2px); }
      `}</style>

      <div className="ab-wrap">
        {/* Hero — two column */}
        <section className="ab-hero">
          <div>
            <div className="ab-hero-eyebrow">{t.eyebrow}</div>
            <h1 className="ab-hero-h1">{t.h1a}<br /><span>{t.h1b}</span></h1>
            {/* subh1 only shown when it differs meaningfully from the h1 (ml/hi) */}
            {lang !== "en" && (
              <div className="ab-hero-h1-ml">{t.subh1}</div>
            )}
            <p className="ab-hero-p">{t.p1}</p>
          </div>

          <div>
            {videoError ? (
              <div className="ab-video-error">
                <div style={{fontSize:36}}>🎬</div>
                <div><strong>Video not found</strong><br />Place <code>about-krishi.mp4</code> in <code>src/assets/</code></div>
              </div>
            ) : (
              <div className="ab-video-wrap">
                <video
                  ref={videoRef}
                  src={heroVideo}
                  poster={ex2}
                  onError={() => setVideoError(true)}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={() => setPlaying(false)}
                  style={{width:"100%",height:"100%",objectFit:"cover"}}
                  playsInline
                />
                {!playing && (
                  <div className="ab-video-overlay" onClick={togglePlay}>
                    <div className="ab-play-btn">▶</div>
                  </div>
                )}
                {playing && (
                  <div className="ab-video-overlay" onClick={togglePlay} style={{background:"transparent"}}>
                    <div className="ab-play-btn" style={{opacity:0}}>⏸</div>
                  </div>
                )}
                <div className="ab-video-badge">{t.videoBadge}</div>
              </div>
            )}
          </div>
        </section>

        {/* Stats bar */}
        <div className="ab-stats">
          {t.stats.map(s => (
            <div key={s.label} className="ab-stat">
              <div className="ab-stat-num">{s.number}</div>
              <div className="ab-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <section className="ab-features">
          <div className="ab-section-eyebrow">{t.featuresEyebrow}</div>
          <h2 className="ab-section-h">{t.featuresTitle}</h2>
          <div className="ab-features-grid">
            {t.features.map((f, i) => (
              <div key={f.title} className="ab-feat-card">
                <div className="ab-feat-img-wrap"><img src={FEAT_IMGS[i]} alt={f.title} /></div>
                <div className="ab-feat-title">{f.title}</div>
                <p className="ab-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Before / After */}
        <section className="ab-ba">
          <div className="ab-section-eyebrow">{t.baEyebrow}</div>
          <h2 className="ab-section-h">{t.baTitle}</h2>
          <div className="ab-ba-grid">
            <div className="ab-ba-card">
              <img src={beforeImg} alt="Before" />
              <div className="ab-ba-label">{t.beforeLabel}</div>
            </div>
            <div className="ab-ba-card">
              <img src={afterImg} alt="After" />
              <div className="ab-ba-label">{t.afterLabel}</div>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="ab-impact">
          <div className="ab-section-eyebrow">{t.impactEyebrow}</div>
          <h2 className="ab-section-h">{t.impactTitle}</h2>
          <div className="ab-impact-list">
            {t.impacts.map((item, i) => (
              <div key={i} className="ab-impact-item">
                <div className="ab-impact-dot" />
                <div className="ab-impact-en">{item}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="ab-cta">
          <div className="ab-cta-h">{t.ctaH}</div>
          <p className="ab-cta-sub">{t.ctaSub}</p>
          <a href="/onboarding" className="ab-cta-btn">{t.ctaBtn}</a>
        </div>
      </div>
    </>
  );
}

export default About;
=======
function About() {
  const heroImgStyle = { width: "300px", height: "200px", objectFit: "cover", borderRadius: "10px" };
  const featureImgStyle = { width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px" };
  const beforeAfterImgStyle = { width: "300px", height: "200px", objectFit: "cover", borderRadius: "10px" };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      
    {/* Hero Section */}
<section
  style={{
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "20px",
    marginBottom: "50px",
    justifyContent: "space-between",
  }}
>
  {/* Text */}
  <div style={{ flex: "1 1 400px", minWidth: "300px" }}>
    {/* Heading: English + Malayalam */}
    <h2 style={{ fontSize: "24px", color: "#2e7d32", marginBottom: "20px" }}>
      About Krishi Sakhi
      <br />
      കൃഷി സഹകാരിയെക്കുറിച്ച്
    </h2>

    {/* English Content */}
    <div style={{ marginBottom: "20px" }}>
      <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.6" }}>
        Your AI-powered personal farming companion for Kerala farmers.
      </p>
      <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.6" }}>
        Krishi Sakhi is an AI-driven personal farming assistant designed to support smallholder farmers in Kerala. 
        It provides personalized guidance based on your crops, soil type, irrigation, and local weather conditions. 
        Our goal is to empower farmers to make informed decisions, increase productivity, and reduce risks—all through a simple, bilingual interface.
      </p>
    </div>

    {/* Malayalam Content */}
    <div>
      <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.6" }}>
        കേരളത്തിലെ കർഷകർക്ക് വേണ്ടി നിങ്ങളുടെ എഐ അടിസ്ഥാനത്തിലുള്ള വ്യക്തിഗത കൃഷി സഹായി.
      </p>
      <p style={{ fontSize: "16px", color: "#555", lineHeight: "1.6" }}>
        കൃഷി സഹകാരി കേരളത്തിലെ ചെറിയ കർഷകരെ പിന്തുണയ്ക്കുന്നതിനായി രൂപകൽപ്പന ചെയ്ത എഐ-അധിഷ്ഠിത വ്യക്തിഗത കൃഷി സഹായിയാണ്. 
        ഇത് നിങ്ങളുടെ വിളകൾ, മണ്ണിന്റെ തരം, വെള്ളസേചനം, പ്രാദേശിക കാലാവസ്ഥാ നില എന്നിവയുടെ അടിസ്ഥാനത്തിൽ വ്യക്തിഗത ഉപദേശം നൽകുന്നു. 
        നമ്മുടെ ലക്ഷ്യം കർഷകർക്ക് ബോധ്യമായ തീരുമാനങ്ങൾ എടുക്കാൻ, ഉത്പാദനക്ഷമത വർദ്ധിപ്പിക്കാൻ, അപകടങ്ങൾ കുറയ്ക്കാൻ സാധിക്കണമെന്നതാണ്—എല്ലാം ഒരു ലളിതമായ, ബൈലിംഗ്വൽ ഇന്റർഫേസിലൂടെ.
      </p>
    </div>
  </div>

  {/* Image */}
  <div style={{ flex: "1 1 300px", minWidth: "250px", textAlign: "center" }}>
    <img 
      src={ex1} 
      alt="Farmer with mobile" 
      style={{ width: "100%", maxWidth: "350px", height: "auto", borderRadius: "10px" }} 
    />
    {/* Caption removed */}
  </div>
</section>


      {/* Overview Section */}
      <section style={{ marginBottom: "50px" }}>
        <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#333", marginBottom: "15px" }}>
          Krishi Sakhi is an AI-driven personal farming assistant designed to support smallholder farmers in Kerala. 
          It provides personalized guidance based on your crops, soil type, irrigation, and local weather conditions. 
          Our goal is to empower farmers to make informed decisions, increase productivity, and reduce risks—all through a simple, bilingual interface.
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#333", marginBottom: "30px" }}>
          കൃഷി സഹകാരി കേരളത്തിലെ ചെറിയ കർഷകരെ പിന്തുണയ്ക്കുന്നതിനായി രൂപകൽപ്പന ചെയ്ത എഐ-അധിഷ്ഠിത വ്യക്തിഗത കൃഷി സഹായിയാണ്. 
          ഇത് നിങ്ങളുടെ വിളകൾ, മണ്ണിന്റെ തരം, വെള്ളസേചനം, പ്രാദേശിക കാലാവസ്ഥാ നില എന്നിവയുടെ അടിസ്ഥാനത്തിൽ വ്യക്തിഗത ഉപദേശം നൽകുന്നു. 
          നമ്മുടെ ലക്ഷ്യം കർഷകർക്ക് ബോധ്യമായ തീരുമാനങ്ങൾ എടുക്കാൻ, ഉത്പാദനക്ഷമത വർദ്ധിപ്പിക്കാൻ, അപകടങ്ങൾ കുറയ്ക്കാൻ സാധിക്കണമെന്നതാണ്—എല്ലാം ഒരു ലളിതമായ, ബൈലിംഗ്വൽ ഇന്റർഫേസിലൂടെ.
        </p>
      </section>

      {/* Features Section */}
      <section style={{ marginBottom: "50px" }}>
        <h3 style={{ fontSize: "22px", color: "#2e7d32", marginBottom: "20px" }}>
          Core Features / പ്രധാന സവിശേഷതകൾ
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ flex: "1 1 250px", textAlign: "center", border: "1px solid #ddd", borderRadius: "10px", padding: "15px" }}>
            <img src={ex2} alt="Farmer Profile" style={featureImgStyle} />
            <h4 style={{ marginBottom: "10px" }}>Farmer & Farm Profiling / കർഷക-ഫാം പ്രൊഫൈലിംഗ്</h4>
            <p style={{ marginBottom: "15px" }}>
              Capture details like location, crop, soil, and irrigation.
            </p>
            <p style={{ marginBottom: "0px" }}>
              സ്ഥാനം, വിള, മണ്ണ്, വെള്ളസേചനം എന്നിവ രേഖപ്പെടുത്തുക.
            </p>
          </div>
          <div style={{ flex: "1 1 250px", textAlign: "center", border: "1px solid #ddd", borderRadius: "10px", padding: "15px" }}>
            <img src={ex3} alt="Digital Diary" style={featureImgStyle} />
            <h4 style={{ marginBottom: "10px" }}>Digital Diary / ഡിജിറ്റൽ ഡയറി</h4>
            <p style={{ marginBottom: "15px" }}>
              Log daily activities like sowing, irrigation, and pest management.
            </p>
            <p style={{ marginBottom: "0px" }}>
              സെയിംഗ്, വെള്ളസേചനം, കീടനിയന്ത്രണം തുടങ്ങിയ ദിനചര്യ പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്തുക.
            </p>
          </div>
          <div style={{ flex: "1 1 250px", textAlign: "center", border: "1px solid #ddd", borderRadius: "10px", padding: "15px" }}>
            <img src={ex4} alt="AI Advisory" style={featureImgStyle} />
            <h4 style={{ marginBottom: "10px" }}>AI-Powered Advisory / എഐ-അധിഷ്ഠിത ഉപദേശം</h4>
            <p style={{ marginBottom: "15px" }}>
              Get context-aware recommendations for crops, weather, and pests.
            </p>
            <p style={{ marginBottom: "0px" }}>
              വിളകൾ, കാലാവസ്ഥ, കീടങ്ങൾ എന്നിവയുടെ അടിസ്ഥാനത്തിൽ അനുയോജ്യമായ ഉപദേശം ലഭിക്കുക.
            </p>
          </div>
        </div>
      </section>

      {/* Before & After Section */}
      <section style={{ textAlign: "center", marginBottom: "50px" }}>
        <h3 style={{ fontSize: "22px", color: "#2e7d32", marginBottom: "20px" }}>
          Before & After Using Krishi Sakhi / കൃഷി സഹകാരി ഉപയോഗിക്കുന്നതിന് മുമ്പും ശേഷവും
        </h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <img src={beforeImg} alt="Before Krishi Sakhi" style={beforeAfterImgStyle} />
            <p style={{ marginTop: "10px" }}>Before using Krishi Sakhi / മുമ്പ്</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <img src={afterImg} alt="After Krishi Sakhi" style={beforeAfterImgStyle} />
            <p style={{ marginTop: "10px" }}>After using Krishi Sakhi / ശേഷം</p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section style={{ marginBottom: "50px" }}>
        <h3 style={{ fontSize: "22px", color: "#2e7d32", marginBottom: "15px" }}>Our Impact / നമ്മുടെ സ്വാധീനം</h3>
        <ul style={{ listStyleType: "disc", paddingLeft: "20px", fontSize: "16px", lineHeight: "1.5", color: "#333", marginBottom: "15px" }}>
          <li>Empowers farmers with personalized, on-demand support.   കർഷകർക്ക് വ്യക്തിഗത, ആവശ്യാനുസരണം പിന്തുണ നൽകുന്നു.</li>
          <li>Bridges the knowledge gap for smallholder farmers.   ചെറിയ കർഷകർക്ക് വിജ്ഞാനതാൽപര്യം പാലിക്കുന്നു.</li>
          <li>Promotes sustainable farming practices.    സുസ്ഥിര കൃഷി രീതികളെ പ്രോത്സാഹിപ്പിക്കുന്നു.</li>
          <li>Acts as a digital companion throughout the crop cycle.    വിള ചക്രത്തിനിടയിലെ ഡിജിറ്റൽ കൂട്ടുകാരനായി പ്രവർത്തിക്കുന്നു.</li>
        </ul>
        <p style={{ fontWeight: "bold", color: "#1b5e20", fontSize: "18px" }}>
          Join Krishi Sakhi today and grow smarter with AI guidance!    ഇന്ന് കൃഷി സഹകാരിയിലേക്ക് ചേർന്നു എഐ ഉപദേശത്തോടെ ബുദ്ധിമുട്ടുകൾ കുറയ്ക്കുക!
        </p>
      </section>

    </div>
  );
}

export default About;

>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
