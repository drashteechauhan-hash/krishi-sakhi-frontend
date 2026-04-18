import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import "./Home.css";
import Login from "../../pages/Login/Login";
import ImageSlider from "../../components/ImageSlider/ImageSlider";
import FeaturesSection from "../../components/FeaturesSection/FeaturesSection";

const TEXT = {
  en: {
    tag: "AI-Powered Farming Assistant",
    title1: "Smart Farming",
    title2: "Starts Here",
    titleEm: "🌾",
    desc: "AI-powered insights, real-time guidance, and smarter decisions for every farmer.",
    btn: "Get Started →",
    stats: [
      { value: "24/7", label: "AI Support" },
      { value: "3", label: "Languages" },
      { value: "100%", label: "Free" },
      { value: "Live", label: "Weather" },
    ],
    scroll: "SCROLL DOWN",
  },
  hi: {
    tag: "AI-संचालित कृषि सहायक",
    title1: "स्मार्ट खेती",
    title2: "यहाँ शुरू होती है",
    titleEm: "🌾",
    desc: "हर किसान के लिए AI-आधारित जानकारी, रियल-टाइम मार्गदर्शन।",
    btn: "शुरू करें →",
    stats: [
      { value: "24/7", label: "AI सहायता" },
      { value: "3", label: "भाषाएं" },
      { value: "100%", label: "मुफ्त" },
      { value: "Live", label: "मौसम" },
    ],
    scroll: "नीचे स्क्रॉल करें",
  },
  ml: {
    tag: "AI കൃഷി സഹായി",
    title1: "സ്മാർട്ട് കൃഷി",
    title2: "ഇവിടെ തുടങ്ങുന്നു",
    titleEm: "🌾",
    desc: "AI അടിസ്ഥാനത്തിലുള്ള നിർദ്ദേശങ്ങൾ, തത്സമയ മാർഗ്ഗനിർദേശം, ഓരോ കർഷകനും.",
    btn: "തുടക്കം കുറിക്കൂ →",
    stats: [
      { value: "24/7", label: "AI പിന്തുണ" },
      { value: "3", label: "ഭാഷകൾ" },
      { value: "100%", label: "സൗജന്യം" },
      { value: "Live", label: "കാലാവസ്ഥ" },
    ],
    scroll: "താഴേക്ക് സ്ക്രോൾ",
  },
};

function Particle({ style }) {
  return <div className="home-particle" style={style} />;
}

function Home({ showLogin, setShowLogin }) {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const t = TEXT[lang] || TEXT.en;

  const [particles] = useState(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 2}px`,
      delay: `${Math.random() * 8}s`,
      dur: `${Math.random() * 12 + 10}s`,
      opacity: Math.random() * 0.25 + 0.06,
    }))
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

        .home-wrap {
          position: relative;
          min-height: 100vh;
          /* Warmer, earthier — deep forest soil tones instead of pure black */
          background:
            radial-gradient(ellipse 60% 45% at 50% 0%, rgba(99,153,34,0.15) 0%, transparent 55%),
            radial-gradient(ellipse 35% 35% at 88% 75%, rgba(186,117,23,0.12) 0%, transparent 50%),
            linear-gradient(165deg, #0d1a08 0%, #111e09 45%, #0d1a08 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          color: #ede8da;
        }

        /* Subtle texture grid — finer, more organic */
        .home-grid {
          position: absolute;
          inset: 0;
          z-index: 0;
          background-image:
            linear-gradient(rgba(99,153,34,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,153,34,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at center, black 25%, transparent 68%);
          pointer-events: none;
        }

        /* Floating soil/leaf particles */
        .home-particle {
          position: absolute;
          border-radius: 50%;
          background: #97c459;
          pointer-events: none;
          z-index: 1;
          animation: homeFloat linear infinite;
        }
        @keyframes homeFloat {
          0%   { transform: translateY(20px) scale(0); opacity: 0; }
          15%  { opacity: var(--op, 0.15); }
          85%  { opacity: var(--op, 0.15); }
          100% { transform: translateY(-110px) scale(1.1); opacity: 0; }
        }

        /* Warm glow orbs */
        .home-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
        }
        .home-orb-1 {
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(99,153,34,0.10), transparent 70%);
          top: -100px; left: -140px;
        }
        .home-orb-2 {
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(186,117,23,0.09), transparent 70%);
          bottom: -60px; right: -80px;
        }

        /* Hero */
        .home-hero {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 26px;
          padding: 120px 24px 60px;
          max-width: 760px;
        }

        /* Tag — more editorial, less techy */
        .home-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 20px;
          border-radius: 40px;
          background: rgba(99,153,34,0.08);
          border: 1px solid rgba(99,153,34,0.22);
          font-family: 'Space Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #97c459;
        }
        .home-tag-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #97c459;
          animation: tagPulse 1.8s ease-in-out infinite;
        }
        @keyframes tagPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Headline — serif for warmth, not cold sans */
        .home-h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: -1.5px;
          color: #ede8da;
          margin: 0;
        }
        .home-h1 em {
          font-style: italic;
          color: #97c459;
        }
        .home-h1-line2 {
          display: block;
          color: #c9c0a8;
        }

        /* Description */
        .home-desc {
          font-size: clamp(0.95rem, 1.8vw, 1.1rem);
          color: rgba(237,232,218,0.5);
          font-weight: 300;
          line-height: 1.9;
          max-width: 500px;
          margin: 0;
        }

        /* CTA — earthy warm green, not neon */
        .home-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 42px;
          border-radius: 50px;
          background: linear-gradient(135deg, #3b6d11, #639922);
          color: #f7faf0;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          letter-spacing: 0.2px;
          box-shadow: 0 6px 32px rgba(99,153,34,0.28);
          transition: all 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .home-cta:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 14px 44px rgba(99,153,34,0.38);
          background: linear-gradient(135deg, #27500a, #3b6d11);
        }
        .home-cta:active { transform: translateY(-1px) scale(0.99); }

        /* Stats — warmer amber border */
        .home-stats {
          display: flex;
          align-items: center;
          gap: 0;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(186,117,23,0.15);
          border-radius: 16px;
          overflow: hidden;
        }
        .home-stat {
          padding: 18px 26px;
          text-align: center;
          border-right: 1px solid rgba(186,117,23,0.1);
          transition: background 0.2s;
          cursor: default;
        }
        .home-stat:last-child { border-right: none; }
        .home-stat:hover { background: rgba(99,153,34,0.05); }
        .home-stat-v {
          font-family: 'Playfair Display', serif;
          font-size: 1.65rem;
          font-weight: 700;
          color: #97c459;
          line-height: 1;
          margin-bottom: 5px;
        }
        .home-stat-l {
          font-family: 'Space Mono', monospace;
          font-size: 8.5px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: rgba(237,232,218,0.3);
        }

        /* Scroll indicator */
        .home-scroll {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(237,232,218,0.2);
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          animation: scrollBounce 2.5s ease-in-out infinite;
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }
        .home-scroll-line {
          width: 1px;
          height: 44px;
          background: linear-gradient(to bottom, transparent, rgba(186,117,23,0.4), transparent);
        }

        .home-sections {
          position: relative;
          z-index: 2;
          width: 100%;
        }

        @media (max-width: 600px) {
          .home-stats { flex-wrap: wrap; border-radius: 14px; }
          .home-stat { flex: 1 1 45%; border-right: none; border-bottom: 1px solid rgba(186,117,23,0.08); }
          .home-stat:nth-child(odd) { border-right: 1px solid rgba(186,117,23,0.08); }
          .home-cta { padding: 13px 30px; font-size: 14px; }
        }
      `}</style>

      <div className="home-wrap">
        <div className="home-grid" />
        <div className="home-orb home-orb-1" />
        <div className="home-orb home-orb-2" />

        {particles.map(p => (
          <Particle key={p.id} style={{
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            animationDelay: p.delay,
            animationDuration: p.dur,
            "--op": p.opacity,
          }} />
        ))}

        <div className="home-hero">
          <motion.div
            className="home-tag"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="home-tag-dot" />
            {t.tag}
          </motion.div>

          <motion.h1
            className="home-h1"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15 }}
          >
            <em>{t.title1}</em>
            <span className="home-h1-line2">{t.title2} {t.titleEm}</span>
          </motion.h1>

          <motion.p
            className="home-desc"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t.desc}
          </motion.p>

          <motion.button
            className="home-cta"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            onClick={() => navigate("/onboarding")}
          >
            {t.btn}
          </motion.button>

          <motion.div
            className="home-stats"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t.stats.map(s => (
              <div key={s.label} className="home-stat">
                <div className="home-stat-v">{s.value}</div>
                <div className="home-stat-l">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="home-scroll">
          <span>{t.scroll}</span>
          <div className="home-scroll-line" />
        </div>

        <div className="home-sections">
          {showLogin && <Login onClose={() => setShowLogin(false)} />}
          <ImageSlider />
          <FeaturesSection />
        </div>
      </div>
    </>
  );
}

export default Home;
