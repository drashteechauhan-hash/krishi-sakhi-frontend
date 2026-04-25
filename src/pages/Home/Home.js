import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";

import bgImg      from "../../assets/bg.jpg";
import ex2        from "../../assets/ex2.jpg";
import ex3        from "../../assets/ex3.jpg";
import img1       from "../../assets/img1.jpg";
import leftImage  from "../../assets/leftImage.jpg";
import rightImage from "../../assets/rightImage.jpg";
import farmTractor from "../../assets/Farm Agriculture Tractor PNG.jpg";

const HERO_IMAGES = [bgImg, leftImage, ex2, rightImage];

const FEATURES_DATA = [
  { icon: "🤖", titleKey: "feat_1_title", descKey: "feat_1_desc", color: "#4ade80" },
  { icon: "📊", titleKey: "feat_2_title", descKey: "feat_2_desc", color: "#60a5fa" },
  { icon: "🏛️", titleKey: "feat_3_title", descKey: "feat_3_desc", color: "#fbbf24" },
  { icon: "🎙", titleKey: "feat_4_title", descKey: "feat_4_desc", color: "#f472b6" },
  { icon: "🌱", titleKey: "feat_5_title", descKey: "feat_5_desc", color: "#34d399" },
  { icon: "🌦", titleKey: "feat_6_title", descKey: "feat_6_desc", color: "#a78bfa" },
];

const STATS = [
  { display: "22",   suffix: "",    labelKey: "home_stat_lang_l" },
  { display: "50",   suffix: "+",   labelKey: "home_stat_schemes_l" },
  { display: "24",   suffix: "/7",  labelKey: "home_stat_support_l" },
  { display: "Free", suffix: "",    labelKey: "home_stat_cost_l" },
];

const PROBLEM_FACT_NUMS = ["46%", "86%", "22", "₹6,000"];
const PROBLEM_FACT_KEYS = [
  "home_fact_1_lbl",
  "home_fact_2_lbl",
  "home_fact_3_lbl",
  "home_fact_4_lbl",
];

const WHY_DATA = [
  { icon: "🗣️", titleKey: "home_why_1_title", descKey: "home_why_1_desc" },
  { icon: "🌐", titleKey: "home_why_2_title", descKey: "home_why_2_desc" },
  { icon: "📵", titleKey: "home_why_3_title", descKey: "home_why_3_desc" },
  { icon: "🏛️", titleKey: "home_why_4_title", descKey: "home_why_4_desc" },
];

const STEPS_DATA = [
  { n: "01", titleKey: "home_step1_title", descKey: "home_step1_desc" },
  { n: "02", titleKey: "home_step2_title", descKey: "home_step2_desc" },
  { n: "03", titleKey: "home_step3_title", descKey: "home_step3_desc" },
  { n: "04", titleKey: "home_step4_title", descKey: "home_step4_desc" },
];

function CountUp({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = Date.now();
        const endVal = parseFloat(end);
        const timer = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * endVal));
          if (progress >= 1) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(i => (i + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .hm { font-family:'DM Sans',sans-serif; background:#050e09; color:#f0e8d5; overflow-x:hidden; }

        /* ── HERO ── */
        .hm-hero {
          position:relative; height:100vh; min-height:680px;
          display:flex; align-items:center; justify-content:center; overflow:hidden;
        }
        .hm-hero-slide {
          position:absolute; inset:0; z-index:0;
          background-size:cover; background-position:center;
          transition:opacity 1.6s cubic-bezier(0.4,0,0.2,1);
        }
        .hm-hero-slide.active { opacity:1; }
        .hm-hero-slide.hidden { opacity:0; }
        .hm-hero-shade {
          position:absolute; inset:0; z-index:1;
          background:linear-gradient(180deg,rgba(3,8,4,0.5) 0%,rgba(3,8,4,0.25) 45%,rgba(3,8,4,0.75) 100%);
        }
        .hm-hero-glow {
          position:absolute; inset:0; z-index:1;
          background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(74,222,128,0.14) 0%,transparent 60%);
        }
        .hm-hero-content {
          position:relative; z-index:2; text-align:center;
          padding:0 24px; max-width:860px;
          display:flex; flex-direction:column; align-items:center; gap:26px;
        }
        .hm-eyebrow {
          display:inline-flex; align-items:center; gap:9px; padding:7px 22px;
          border-radius:40px; background:rgba(74,222,128,0.1);
          border:1px solid rgba(74,222,128,0.3);
          font-family:'Space Mono',monospace; font-size:10px;
          letter-spacing:2.5px; text-transform:uppercase; color:#4ade80;
        }
        .hm-eyebrow-dot {
          width:6px; height:6px; border-radius:50%;
          background:#4ade80; animation:eyePulse 1.8s ease-in-out infinite;
        }
        @keyframes eyePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.2;transform:scale(0.7)} }
        .hm-h1 {
          font-family:'Playfair Display',serif;
          font-size:clamp(3rem,8vw,6.2rem); font-weight:700;
          line-height:1.05; letter-spacing:-2.5px; color:#f0e8d5; margin:0;
          text-shadow:0 4px 40px rgba(0,0,0,0.45);
        }
        .hm-h1 em { font-style:italic; color:#4ade80; }
        .hm-h1-line2 { display:block; color:rgba(240,232,213,0.8); }
        .hm-sub {
          font-size:clamp(1rem,1.8vw,1.15rem); color:rgba(240,232,213,0.6);
          font-weight:300; line-height:1.9; max-width:520px;
          text-shadow:0 2px 16px rgba(0,0,0,0.5);
        }
        .hm-hero-btns { display:flex; gap:14px; flex-wrap:wrap; justify-content:center; }
        .hm-btn-p {
          padding:15px 44px; border-radius:50px;
          background:linear-gradient(135deg,#166534,#22c55e);
          color:#fff; font-size:15px; font-weight:600; border:none;
          cursor:pointer; font-family:'DM Sans',sans-serif;
          box-shadow:0 8px 32px rgba(34,197,94,0.35);
          transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .hm-btn-p:hover { transform:translateY(-3px) scale(1.03); box-shadow:0 16px 48px rgba(34,197,94,0.45); }
        .hm-btn-s {
          padding:14px 32px; border-radius:50px;
          background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.2);
          color:rgba(240,232,213,0.8); font-size:15px; font-weight:500;
          cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s;
        }
        .hm-btn-s:hover { background:rgba(255,255,255,0.12); border-color:rgba(255,255,255,0.35); }

        .hm-dots {
          position:absolute; bottom:36px; left:50%;
          transform:translateX(-50%); z-index:3; display:flex; gap:8px;
        }
        .hm-dot {
          width:8px; height:8px; border-radius:50%; border:none;
          cursor:pointer; background:rgba(255,255,255,0.28); transition:all 0.25s; padding:0;
        }
        .hm-dot.on { background:#4ade80; width:26px; border-radius:4px; }
        .hm-scroll {
          position:absolute; bottom:40px; right:44px; z-index:3;
          display:flex; flex-direction:column; align-items:center; gap:8px;
          color:rgba(240,232,213,0.25); font-family:'Space Mono',monospace;
          font-size:8px; letter-spacing:2.5px; text-transform:uppercase;
          animation:scrollBob 2.5s ease-in-out infinite;
        }
        @keyframes scrollBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(9px)} }
        .hm-scroll-line { width:1px; height:48px; background:linear-gradient(to bottom,transparent,rgba(196,127,26,0.5)); }

        /* ── STATS BAR ── */
        .hm-stats-bar {
          background:linear-gradient(135deg,#081510,#0c1f10);
          border-top:1px solid rgba(74,222,128,0.08);
          border-bottom:1px solid rgba(74,222,128,0.08);
        }
        .hm-stats {
          max-width:1100px; margin:0 auto;
          display:grid; grid-template-columns:repeat(4,1fr);
        }
        @media(max-width:640px){ .hm-stats{grid-template-columns:repeat(2,1fr);} }
        .hm-stat {
          padding:34px 24px; text-align:center;
          border-right:1px solid rgba(74,222,128,0.07); transition:background 0.2s;
        }
        .hm-stat:last-child { border-right:none; }
        .hm-stat:hover { background:rgba(74,222,128,0.04); }
        .hm-stat-v {
          font-family:'Playfair Display',serif; font-size:2.6rem;
          font-weight:700; color:#4ade80; line-height:1; margin-bottom:9px;
        }
        .hm-stat-l {
          font-family:'Space Mono',monospace; font-size:9px;
          letter-spacing:1.5px; text-transform:uppercase; color:rgba(240,232,213,0.28);
        }

        /* ── PROBLEM STRIP ── */
        .hm-problem-strip {
          background:linear-gradient(135deg,#0a1f12,#061309);
          border-top:1px solid rgba(74,222,128,0.06);
          border-bottom:1px solid rgba(74,222,128,0.06);
          padding:88px 24px;
        }
        .hm-problem-inner { max-width:920px; margin:0 auto; text-align:center; }
        .hm-problem-tag {
          font-family:'Space Mono',monospace; font-size:9px;
          letter-spacing:3px; text-transform:uppercase;
          color:rgba(251,191,36,0.6); margin-bottom:20px; display:block;
        }
        .hm-problem-h {
          font-family:'Playfair Display',serif;
          font-size:clamp(1.7rem,3.8vw,2.8rem); font-weight:700;
          color:#f0e8d5; line-height:1.35; margin-bottom:22px;
        }
        .hm-problem-p {
          font-size:15px; color:rgba(240,232,213,0.42);
          line-height:1.9; max-width:660px; margin:0 auto 56px;
        }
        .hm-problem-facts {
          display:grid; grid-template-columns:repeat(4,1fr); gap:0;
          border:1px solid rgba(251,191,36,0.1); border-radius:16px; overflow:hidden;
        }
        @media(max-width:700px){ .hm-problem-facts{grid-template-columns:repeat(2,1fr);} }
        .hm-problem-fact {
          padding:32px 20px; text-align:center;
          border-right:1px solid rgba(251,191,36,0.08);
          background:rgba(251,191,36,0.02);
        }
        .hm-problem-fact:last-child { border-right:none; }
        .hm-problem-fact-num {
          font-family:'Playfair Display',serif; font-size:2rem;
          font-weight:700; color:#fbbf24; margin-bottom:10px;
        }
        .hm-problem-fact-lbl {
          font-size:11.5px; color:rgba(240,232,213,0.32);
          line-height:1.6; text-align:center;
        }
        .hm-problem-source {
          margin-top:20px; text-align:center;
          font-family:'Space Mono',monospace; font-size:9px;
          letter-spacing:1px; color:rgba(240,232,213,0.15);
        }

        /* ── HOW IT WORKS ── */
        .hm-sec { padding:96px 24px; }
        .hm-sec-inner { max-width:1100px; margin:0 auto; }
        .hm-sec-eye {
          font-family:'Space Mono',monospace; font-size:9px;
          letter-spacing:3px; text-transform:uppercase;
          color:rgba(74,222,128,0.55); margin-bottom:12px;
        }
        .hm-sec-h {
          font-family:'Playfair Display',serif;
          font-size:clamp(2rem,4vw,3rem); font-weight:700;
          color:#f0e8d5; line-height:1.15; margin-bottom:14px;
        }
        .hm-sec-h em { font-style:italic; color:#4ade80; }
        .hm-sec-sub {
          font-size:15px; color:rgba(240,232,213,0.42);
          line-height:1.85; max-width:540px; margin-bottom:52px;
        }
        .hm-steps {
          display:grid; grid-template-columns:repeat(4,1fr); gap:0; position:relative;
        }
        @media(max-width:768px){ .hm-steps{grid-template-columns:repeat(2,1fr);} }
        @media(max-width:480px){ .hm-steps{grid-template-columns:1fr;} }
        .hm-steps::before {
          content:''; position:absolute; top:27px;
          left:12.5%; right:12.5%; height:1px;
          background:linear-gradient(90deg,transparent,rgba(74,222,128,0.2),transparent);
          pointer-events:none;
        }
        .hm-step {
          display:flex; flex-direction:column; align-items:center;
          text-align:center; padding:0 20px 36px; position:relative;
        }
        .hm-step-num {
          width:54px; height:54px; border-radius:50%;
          background:linear-gradient(135deg,#1a4025,#166534);
          border:1px solid rgba(74,222,128,0.25);
          display:flex; align-items:center; justify-content:center;
          font-family:'Space Mono',monospace; font-size:15px; font-weight:700;
          color:#4ade80; margin-bottom:20px; position:relative; z-index:1;
          box-shadow:0 0 0 8px rgba(74,222,128,0.05);
        }
        .hm-step-title { font-size:15px; font-weight:700; color:#f0e8d5; margin-bottom:8px; }
        .hm-step-desc { font-size:12.5px; color:rgba(240,232,213,0.38); line-height:1.7; }

        /* ── FARM BANNER ── */
        .hm-farm-banner {
          position:relative; height:460px; overflow:hidden; background:#0c2013;
        }
        .hm-farm-banner img {
          width:100%; height:100%; object-fit:cover;
          object-position:center 55%; transition:transform 0.6s ease;
          mix-blend-mode:luminosity; opacity:0.82;
        }
        .hm-farm-banner:hover img { transform:scale(1.02); }
        .hm-farm-overlay {
          position:absolute; inset:0; z-index:1;
          background:linear-gradient(180deg,rgba(5,14,9,0.58) 0%,rgba(5,14,9,0.18) 40%,rgba(5,14,9,0.85) 100%);
          display:flex; align-items:center; justify-content:center; flex-direction:column; gap:14px;
        }
        .hm-farm-tag {
          font-family:'Space Mono',monospace; font-size:9px;
          letter-spacing:3px; text-transform:uppercase; color:rgba(74,222,128,0.7);
        }
        .hm-farm-title {
          font-family:'Playfair Display',serif;
          font-size:clamp(2rem,5vw,3.8rem); font-weight:700;
          color:#f0e8d5; text-align:center; line-height:1.2;
          text-shadow:0 4px 36px rgba(0,0,0,0.55);
        }
        .hm-farm-title em { font-style:italic; color:#4ade80; }

        /* ── FEATURES ── */
        .hm-feat-grid {
          display:grid; grid-template-columns:repeat(3,1fr); gap:18px;
        }
        @media(max-width:900px){ .hm-feat-grid{grid-template-columns:repeat(2,1fr);} }
        @media(max-width:560px){ .hm-feat-grid{grid-template-columns:1fr;} }
        .hm-feat {
          background:rgba(255,255,255,0.025); border:1px solid rgba(74,222,128,0.07);
          border-radius:18px; padding:28px 24px; transition:all 0.25s; overflow:hidden;
        }
        .hm-feat:hover {
          transform:translateY(-5px); border-color:rgba(74,222,128,0.18);
          box-shadow:0 20px 60px rgba(0,0,0,0.3);
        }
        .hm-feat-icon {
          width:52px; height:52px; border-radius:14px;
          display:flex; align-items:center; justify-content:center;
          font-size:24px; margin-bottom:18px;
        }
        .hm-feat-title { font-size:16px; font-weight:700; color:#f0e8d5; margin-bottom:10px; }
        .hm-feat-desc { font-size:13.5px; color:rgba(240,232,213,0.42); line-height:1.72; }

        /* ── WHY SECTION ── */
        .hm-why-grid {
          display:grid; grid-template-columns:1fr 1fr; gap:20px;
        }
        @media(max-width:768px){ .hm-why-grid{grid-template-columns:1fr;} }
        .hm-why-card {
          background:rgba(255,255,255,0.02); border:1px solid rgba(74,222,128,0.08);
          border-radius:18px; padding:32px 28px;
          display:flex; gap:18px; align-items:flex-start; transition:all 0.25s;
        }
        .hm-why-card:hover { border-color:rgba(74,222,128,0.2); background:rgba(74,222,128,0.03); }
        .hm-why-icon { font-size:26px; flex-shrink:0; margin-top:2px; }
        .hm-why-title { font-size:16px; font-weight:700; color:#f0e8d5; margin-bottom:8px; }
        .hm-why-desc { font-size:13.5px; color:rgba(240,232,213,0.4); line-height:1.78; }

        /* ── PHOTO SPLIT ── */
        .hm-split { display:grid; grid-template-columns:1fr 1fr; }
        @media(max-width:768px){ .hm-split{grid-template-columns:1fr;} }
        .hm-split-panel { position:relative; overflow:hidden; min-height:420px; }
        .hm-split-panel img {
          width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.6s ease;
        }
        .hm-split-panel:hover img { transform:scale(1.05); }
        .hm-split-overlay {
          position:absolute; inset:0;
          background:linear-gradient(180deg,transparent 35%,rgba(3,8,4,0.88) 100%);
        }
        .hm-split-text { position:absolute; bottom:0; left:0; right:0; padding:28px 30px; }
        .hm-split-tag {
          font-family:'Space Mono',monospace; font-size:8px;
          letter-spacing:2px; text-transform:uppercase; color:#4ade80; margin-bottom:8px;
        }
        .hm-split-title {
          font-family:'Playfair Display',serif; font-size:1.45rem;
          font-weight:700; color:#f0e8d5; line-height:1.25;
        }

        /* ── CTA ── */
        .hm-cta-wrap { max-width:1100px; margin:0 auto 96px; padding:0 24px; }
        .hm-cta {
          background:linear-gradient(135deg,#0d2818,#0f3d1e);
          border:1px solid rgba(74,222,128,0.14); border-radius:24px;
          padding:68px 48px; text-align:center; position:relative; overflow:hidden;
        }
        .hm-cta::before {
          content:''; position:absolute; inset:0;
          background:radial-gradient(ellipse 60% 60% at 50% -20%,rgba(74,222,128,0.12) 0%,transparent 60%);
        }
        .hm-cta-inner { position:relative; z-index:1; }
        .hm-cta-h {
          font-family:'Playfair Display',serif;
          font-size:clamp(1.8rem,4vw,2.9rem); font-weight:700;
          color:#f0e8d5; margin-bottom:12px; line-height:1.25;
        }
        .hm-cta-h em { font-style:italic; color:#4ade80; }
        .hm-cta-sub {
          font-size:15px; color:rgba(240,232,213,0.45); margin-bottom:32px;
          line-height:1.75; max-width:520px; margin-left:auto; margin-right:auto;
        }
        .hm-cta-btns { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
        /* ── MOBILE RESPONSIVE ── */
@media(max-width:768px){
  .hm-hero{ min-height:100svh; }
  .hm-hero-content{ padding:0 16px; gap:16px; }
  .hm-h1{ font-size:clamp(1.9rem,8vw,2.8rem); letter-spacing:-0.5px; }
  .hm-sub{ font-size:14px; padding:0 4px; }
  .hm-hero-btns{ flex-direction:column; align-items:center; gap:10px; }
  .hm-btn-p,.hm-btn-s{ width:100%; max-width:280px; padding:13px 20px; }
  .hm-scroll{ display:none; }
  .hm-stats{ grid-template-columns:repeat(2,1fr); }
  .hm-stat{ padding:20px 12px; }
  .hm-stat-v{ font-size:2rem; }
  .hm-problem-strip{ padding:52px 16px; }
  .hm-problem-facts{ grid-template-columns:repeat(2,1fr); }
  .hm-problem-fact{ padding:20px 12px; }
  .hm-problem-fact-num{ font-size:1.5rem; }
  .hm-sec{ padding:52px 16px; }
  .hm-sec-h{ font-size:1.7rem; }
  .hm-steps{ grid-template-columns:repeat(2,1fr); }
  .hm-steps::before{ display:none; }
  .hm-farm-banner{ height:240px; }
  .hm-feat-grid{ grid-template-columns:1fr; gap:12px; }
  .hm-why-grid{ grid-template-columns:1fr; gap:12px; }
  .hm-why-card{ padding:20px 16px; }
  .hm-split{ grid-template-columns:1fr; }
  .hm-split-panel{ min-height:240px; }
  .hm-cta-wrap{ margin-bottom:52px; padding:0 16px; }
  .hm-cta{ padding:36px 20px; border-radius:16px; }
  .hm-cta-h{ font-size:1.7rem; }
  .hm-cta-btns{ flex-direction:column; align-items:center; }
  .hm-cta-btns .hm-btn-p,.hm-cta-btns .hm-btn-s{ width:100%; max-width:280px; }
}
@media(max-width:400px){
  .hm-h1{ font-size:1.8rem; }
  .hm-steps{ grid-template-columns:1fr; }
  .hm-problem-facts{ grid-template-columns:1fr; }
}
      `}</style>

      <div className="hm">

        {/* ── HERO ── */}
        <section className="hm-hero" ref={heroRef}>
          {HERO_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`hm-hero-slide ${i === heroIndex ? "active" : "hidden"}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="hm-hero-shade" />
          <div className="hm-hero-glow" />

          <motion.div className="hm-hero-content" style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              className="hm-eyebrow"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7 }}
            >
              <div className="hm-eyebrow-dot" />
              {t("home_tag")}
            </motion.div>

            <motion.h1
              className="hm-h1"
              initial={{ opacity:0, y:36 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.9, delay:0.15 }}
            >
              <em>{t("home_title1")}</em>
              <span className="hm-h1-line2">{t("home_title2")} 🌾</span>
            </motion.h1>

            <motion.p
              className="hm-sub"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.8, delay:0.3 }}
            >
              {t("home_desc")}
            </motion.p>

            <motion.div
              className="hm-hero-btns"
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.8, delay:0.45 }}
            >
              <button className="hm-btn-p" onClick={() => navigate("/onboarding")}>
                {t("home_btn")} →
              </button>
              <button className="hm-btn-s" onClick={() => navigate("/about")}>
                {t("home_learn_more")}
              </button>
            </motion.div>
          </motion.div>

          <div className="hm-dots">
            {HERO_IMAGES.map((_, i) => (
              <button key={i} className={`hm-dot ${i === heroIndex ? "on" : ""}`} onClick={() => setHeroIndex(i)} />
            ))}
          </div>

          <div className="hm-scroll">
            <span>{t("home_scroll")}</span>
            <div className="hm-scroll-line" />
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="hm-stats-bar">
          <div className="hm-stats">
            {STATS.map((s, i) => (
              <motion.div
                key={i} className="hm-stat"
                initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.6 }}
              >
                <div className="hm-stat-v">
                  {s.display === "Free" || s.display === "24"
                    ? <span>{s.display}{s.suffix}</span>
                    : <CountUp end={s.display} suffix={s.suffix} />
                  }
                </div>
                <div className="hm-stat-l">{t(s.labelKey)}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── PROBLEM STATEMENT ── */}
        <div className="hm-problem-strip">
          <div className="hm-problem-inner">
            <motion.span
              className="hm-problem-tag"
              initial={{ opacity:0 }} whileInView={{ opacity:1 }}
              viewport={{ once:true }} transition={{ duration:0.6 }}
            >
              {t("home_problem_tag")}
            </motion.span>
            <motion.h2
              className="hm-problem-h"
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.7, delay:0.1 }}
            >
              {t("home_problem_h")}
            </motion.h2>
            <motion.p
              className="hm-problem-p"
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.6, delay:0.2 }}
            >
              {t("home_problem_p")}
            </motion.p>
            <motion.div
              className="hm-problem-facts"
              initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.6, delay:0.3 }}
            >
              {PROBLEM_FACT_NUMS.map((num, i) => (
                <div className="hm-problem-fact" key={i}>
                  <div className="hm-problem-fact-num">{num}</div>
                  <div className="hm-problem-fact-lbl">{t(PROBLEM_FACT_KEYS[i])}</div>
                </div>
              ))}
            </motion.div>
            <div className="hm-problem-source">
              {t("home_problem_source")}
            </div>
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section className="hm-sec" style={{ background:"#050e09" }}>
          <div className="hm-sec-inner">
            <motion.div
              initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.6 }}
            >
              <div className="hm-sec-eye">{t("home_hiw_eye")}</div>
              <h2 className="hm-sec-h">
                {t("home_hiw_h")} <em>{t("home_hiw_h_em")}</em>
              </h2>
              <p className="hm-sec-sub">{t("home_hiw_sub")}</p>
            </motion.div>
            <div className="hm-steps">
              {STEPS_DATA.map((s, i) => (
                <motion.div
                  key={i} className="hm-step"
                  initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }} transition={{ delay:i*0.12, duration:0.6 }}
                >
                  <div className="hm-step-num">{s.n}</div>
                  <div className="hm-step-title">{t(s.titleKey)}</div>
                  <div className="hm-step-desc">{t(s.descKey)}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FARM BANNER ── */}
        <motion.div
          className="hm-farm-banner"
          initial={{ opacity:0 }} whileInView={{ opacity:1 }}
          viewport={{ once:true }} transition={{ duration:0.8 }}
        >
          <img src={farmTractor} alt="Indian farming" />
          <div className="hm-farm-overlay">
            <div className="hm-farm-tag">{t("home_farm_tag")}</div>
            <div className="hm-farm-title">
              {t("home_farm_title1")}<br />
              <em>{t("home_farm_title2")}</em>
            </div>
          </div>
        </motion.div>

        {/* ── FEATURES ── */}
        <section className="hm-sec" style={{ background:"linear-gradient(180deg,#081510,#050e09)" }}>
          <div className="hm-sec-inner">
            <motion.div
              initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.6 }}
            >
              <div className="hm-sec-eye">{t("about_feat_eyebrow")}</div>
              <h2 className="hm-sec-h">
                {t("home_feat_h")} <em>{t("home_feat_h_em")}</em>
              </h2>
              <p className="hm-sec-sub">{t("home_feat_sub")}</p>
            </motion.div>
            <div className="hm-feat-grid">
              {FEATURES_DATA.map((f, i) => (
                <motion.div
                  key={i} className="hm-feat"
                  initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }} transition={{ delay:i*0.08, duration:0.55 }}
                >
                  <div className="hm-feat-icon" style={{ background:`${f.color}14`, border:`1px solid ${f.color}22` }}>
                    {f.icon}
                  </div>
                  <div className="hm-feat-title">{t(f.titleKey)}</div>
                  <div className="hm-feat-desc">{t(f.descKey)}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY KRISHI SAKHI ── */}
        <section className="hm-sec" style={{ background:"#050e09", paddingTop:0 }}>
          <div className="hm-sec-inner">
            <motion.div
              initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.6 }}
            >
              <div className="hm-sec-eye">{t("home_why_eye")}</div>
              <h2 className="hm-sec-h">
                {t("home_why_h")} <em>{t("home_why_h_em")}</em>
              </h2>
              <p className="hm-sec-sub">{t("home_why_sub")}</p>
            </motion.div>
            <div className="hm-why-grid">
              {WHY_DATA.map((w, i) => (
                <motion.div
                  key={i} className="hm-why-card"
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.55 }}
                >
                  <div className="hm-why-icon">{w.icon}</div>
                  <div>
                    <div className="hm-why-title">{t(w.titleKey)}</div>
                    <div className="hm-why-desc">{t(w.descKey)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PHOTO SPLIT ── */}
        <div className="hm-split">
          <div className="hm-split-panel">
            <img src={img1} alt="Farmer with phone" />
            <div className="hm-split-overlay" />
            <div className="hm-split-text">
              <div className="hm-split-tag">{t("home_split_tag1")}</div>
              <div className="hm-split-title">{t("home_split_title1")}</div>
            </div>
          </div>
          <div className="hm-split-panel">
            <img src={ex3} alt="Green paddy field" />
            <div className="hm-split-overlay" />
            <div className="hm-split-text">
              <div className="hm-split-tag">{t("home_split_tag2")}</div>
              <div className="hm-split-title">{t("home_split_title2")}</div>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="hm-cta-wrap">
          <motion.div
            className="hm-cta"
            initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.7 }}
          >
            <div className="hm-cta-inner">
              <h2 className="hm-cta-h">
                {t("home_cta_h1")}<br /><em>{t("home_cta_h2")}</em>
              </h2>
              <p className="hm-cta-sub">{t("home_cta_sub")}</p>
              <div className="hm-cta-btns">
                <button className="hm-btn-p" onClick={() => navigate("/onboarding")}>
                  {t("home_btn")} →
                </button>
                <button className="hm-btn-s" onClick={() => navigate("/schemes")}>
                  {t("home_cta_btn2")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </>
  );
}