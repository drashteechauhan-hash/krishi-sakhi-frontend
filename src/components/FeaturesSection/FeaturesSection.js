// src/components/FeaturesSection/FeaturesSection.jsx
// ─────────────────────────────────────────────────────────────────────────────
// All card titles and descriptions now use t() so they translate automatically
// when the user switches language.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const FEATURE_KEYS = [
  { icon: "🌱", titleKey: "feat_1_title", descKey: "feat_1_desc", color: "#4caf65" },
  { icon: "📊", titleKey: "feat_2_title", descKey: "feat_2_desc", color: "#f59e0b" },
  { icon: "🏛️", titleKey: "feat_3_title", descKey: "feat_3_desc", color: "#3b82f6" },
  { icon: "🎙", titleKey: "feat_4_title", descKey: "feat_4_desc", color: "#8b5cf6" },
  { icon: "🪨", titleKey: "feat_5_title", descKey: "feat_5_desc", color: "#ec4899" },
  { icon: "🌤", titleKey: "feat_6_title", descKey: "feat_6_desc", color: "#06b6d4" },
];

export default function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <>
      <style>{`
        .fs-section {
          padding: 80px 24px 100px;
          background: radial-gradient(ellipse at 50% 0%, rgba(76,175,101,0.06) 0%, transparent 60%),
                      #060d08;
          position: relative;
        }
        .fs-section::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(196,127,26,0.3), transparent);
        }
        .fs-inner { max-width: 1100px; margin: 0 auto; }
        .fs-head  { text-align: center; margin-bottom: 56px; }
        .fs-eyebrow {
          font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 3px;
          text-transform: uppercase; color: #e8a832; margin-bottom: 14px;
        }
        .fs-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4.5vw, 3rem); font-weight: 700;
          color: #f0e8d5; line-height: 1.1; margin: 0;
        }
        .fs-title em { font-style: italic; color: #4caf65; }
        .fs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .fs-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(196,127,26,0.15);
          border-radius: 18px; padding: 28px 24px;
          transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
          position: relative; overflow: hidden;
        }
        .fs-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--card-color);
          opacity: 0; transition: opacity 0.2s;
        }
        .fs-card:hover { transform: translateY(-4px); border-color: rgba(196,127,26,0.3); background: rgba(255,255,255,0.04); }
        .fs-card:hover::before { opacity: 1; }
        .fs-icon {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .fs-card-title {
          font-size: 15px; font-weight: 700; color: #f0e8d5;
          margin: 0 0 8px; font-family: 'DM Sans', sans-serif;
        }
        .fs-card-desc {
          font-size: 13.5px; color: rgba(240,232,213,0.45);
          line-height: 1.7; margin: 0; font-family: 'DM Sans', sans-serif;
        }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      <section className="fs-section">
        <div className="fs-inner">
          <div className="fs-head">
            <div className="fs-eyebrow">FEATURES</div>
            <h2 className="fs-title">
              Everything you need,<br /><em>in your language</em>
            </h2>
          </div>
          <div className="fs-grid">
            {FEATURE_KEYS.map(f => (
              <div key={f.titleKey} className="fs-card" style={{ "--card-color": f.color }}>
                <div className="fs-icon">{f.icon}</div>
                <h3 className="fs-card-title">{t(f.titleKey)}</h3>
                <p  className="fs-card-desc">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}