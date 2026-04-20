import React, { useState, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";
import ex2 from "../../assets/ex2.jpg";
import ex3 from "../../assets/ex3.jpg";
import ex4 from "../../assets/ex4.jpg";
import beforeImg from "../../assets/before.jpg";
import afterImg  from "../../assets/after.jpg";

const heroVideo = "https://res.cloudinary.com/dnqwvrwyw/video/upload/v1776486779/about-krishi_jowxt1.mp4";
const FEAT_IMGS = [ex2, ex3, ex4];

// ── REAL DATA (all sourced & verifiable) ────────────────────────────────────
// 9.32 cr  → PM-KISAN 22nd installment, March 2026 (PIB official press release)
// 22       → 8th Schedule of the Constitution of India
// 50+      → Ministry of Agriculture & Farmers Welfare scheme portal count
// ₹3.46L cr→ PM-KISAN cumulative disbursement since 2019 (PIB, Oct 2024)
// 4.19 cr  → PMFBY farmers enrolled 2024-25 (PIB / IBEF)
// 78.4 cr  → PMFBY total farmer applications since inception 2016 (PIB)
// 86%      → NABARD NAFIS: small & marginal farmers share
// 46%      → PLFS 2022-23: agriculture share of workforce
// ────────────────────────────────────────────────────────────────────────────

const REAL_STATS = [
  {
    number: "9.32 Cr",
    label:  "Farmers receive PM-KISAN benefits (22nd installment, Mar 2026)",
    source: "PIB, March 2026",
  },
  {
    number: "22",
    label:  "Scheduled Indian languages supported (8th Schedule, Constitution)",
    source: "Constitution of India",
  },
  {
    number: "₹3.46L Cr",
    label:  "Total disbursed under PM-KISAN since 2019 (18 installments)",
    source: "PIB, Oct 2024",
  },
  {
    number: "4.19 Cr",
    label:  "Farmers enrolled under PMFBY crop insurance in 2024-25",
    source: "Ministry of Agriculture",
  },
];

const REAL_IMPACTS = [
  "9.32 crore farmer families received PM-KISAN 22nd installment in March 2026, with ₹18,640 crore disbursed directly to bank accounts (PIB, March 2026)",
  "78.4 crore farmer applications insured under PMFBY since 2016; 22.6 crore farmers received crop loss claims totalling ₹1.83 lakh crore (PIB, 2025)",
  "86% of India's farmers are small or marginal landholders (less than 2 hectares) — the primary target group for Krishi Sakhi's voice-first, no-literacy-required design (NABARD NAFIS)",
  "India has 22 scheduled languages (8th Schedule); most agri-tech serves only Hindi/English speakers — Krishi Sakhi supports all 22",
];

function About() {
  const { t, lang } = useLanguage();
  const [videoError, setVideoError] = useState(false);
  const [playing, setPlaying]       = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setPlaying(true); }
    else { videoRef.current.pause(); setPlaying(false); }
  };

  const features = [
    { title: t("about_feat_1_title"), desc: t("about_feat_1_desc") },
    { title: t("about_feat_2_title"), desc: t("about_feat_2_desc") },
    { title: t("about_feat_3_title"), desc: t("about_feat_3_desc") },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .ab-wrap { max-width:1100px; margin:0 auto; padding:40px 20px 80px; font-family:'DM Sans',Arial,sans-serif; color:#333; }

        /* ── HERO ── */
        .ab-hero { display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center; margin-bottom:64px; }
        @media(max-width:768px){.ab-hero{grid-template-columns:1fr}}
        .ab-hero-eyebrow { font-size:11px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:#2e7d32; margin-bottom:12px; }
        .ab-hero-h1 { font-size:clamp(1.8rem,4vw,2.6rem); font-weight:700; color:#1b5e20; line-height:1.15; margin-bottom:8px; }
        .ab-hero-h1 span { color:#2e7d32; }
        .ab-hero-p { font-size:15px; line-height:1.75; color:#555; margin-bottom:12px; }
        .ab-video-wrap { position:relative; border-radius:16px; overflow:hidden; box-shadow:0 12px 48px rgba(46,125,50,0.18); background:#000; aspect-ratio:16/9; }
        .ab-video-overlay { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.12); cursor:pointer; transition:background 0.2s; }
        .ab-video-overlay:hover { background:rgba(0,0,0,0.22); }
        .ab-play-btn { width:62px; height:62px; border-radius:50%; background:rgba(255,255,255,0.95); display:flex; align-items:center; justify-content:center; font-size:22px; box-shadow:0 4px 20px rgba(0,0,0,0.25); transition:transform 0.2s; color:#2e7d32; font-weight:700; }
        .ab-video-overlay:hover .ab-play-btn { transform:scale(1.1); }
        .ab-video-badge { position:absolute; bottom:12px; left:12px; background:rgba(46,125,50,0.9); color:white; font-size:11px; font-weight:600; padding:4px 12px; border-radius:20px; }
        .ab-video-error { width:100%; aspect-ratio:16/9; background:#f1f8e9; border:2px dashed #a5d6a7; border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; color:#555; font-size:14px; text-align:center; padding:20px; }

        /* ── REAL STATS ── */
        .ab-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:#e8f5e9; border:1px solid #c8e6c9; border-radius:14px; overflow:hidden; margin-bottom:12px; }
        @media(max-width:600px){.ab-stats{grid-template-columns:repeat(2,1fr)}}
        .ab-stat { padding:24px 16px; text-align:center; background:#fff; transition:background 0.2s; }
        .ab-stat:hover { background:#f1f8e9; }
        .ab-stat-num { font-size:1.55rem; font-weight:700; color:#2e7d32; line-height:1; margin-bottom:6px; }
        .ab-stat-label { font-size:11px; color:#555; font-weight:500; line-height:1.45; }
        .ab-stat-src { font-size:9px; color:#aaa; margin-top:4px; font-style:italic; }
        .ab-data-note {
          font-size:10px; color:#aaa; text-align:right; margin-bottom:52px;
          font-style:italic;
        }

        /* ── SECTION HEADINGS ── */
        .ab-section-eyebrow { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#81c784; margin-bottom:6px; }
        .ab-section-h { font-size:clamp(1.3rem,3vw,1.9rem); font-weight:700; color:#2e7d32; margin-bottom:28px; line-height:1.2; }

        /* ── FEATURES ── */
        .ab-features { margin-bottom:64px; }
        .ab-features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        @media(max-width:768px){.ab-features-grid{grid-template-columns:1fr}}
        .ab-feat-card { border:1px solid #e8f5e9; border-radius:14px; padding:24px 20px; text-align:center; transition:transform 0.25s,box-shadow 0.25s,border-color 0.25s; background:#fff; }
        .ab-feat-card:hover { transform:translateY(-6px); box-shadow:0 12px 36px rgba(46,125,50,0.12); border-color:#a5d6a7; }
        .ab-feat-img-wrap { width:72px; height:72px; border-radius:12px; overflow:hidden; margin:0 auto 16px; border:2px solid #e8f5e9; }
        .ab-feat-img-wrap img { width:100%; height:100%; object-fit:cover; }
        .ab-feat-title { font-size:15px; font-weight:700; color:#1b5e20; margin-bottom:12px; }
        .ab-feat-desc { font-size:13px; color:#666; line-height:1.6; }

        /* ── BEFORE / AFTER ── */
        .ab-ba { margin-bottom:64px; }
        .ab-ba-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        @media(max-width:600px){.ab-ba-grid{grid-template-columns:1fr}}
        .ab-ba-card { border-radius:14px; overflow:hidden; border:1px solid #e8f5e9; transition:box-shadow 0.25s; }
        .ab-ba-card:hover { box-shadow:0 8px 28px rgba(46,125,50,0.12); }
        .ab-ba-card img { width:100%; aspect-ratio:3/2; object-fit:cover; display:block; }
        .ab-ba-label { padding:14px 16px; background:#fff; font-size:13.5px; font-weight:600; color:#2e7d32; }

        /* ── IMPACT — real data ── */
        .ab-impact { margin-bottom:48px; }
        .ab-impact-list { display:flex; flex-direction:column; gap:12px; margin-bottom:16px; }
        .ab-impact-item { display:flex; gap:12px; align-items:flex-start; padding:14px 16px; background:#f9fbe7; border:1px solid #e8f5e9; border-radius:10px; border-left:3px solid #4caf50; }
        .ab-impact-dot { width:8px; height:8px; border-radius:50%; background:#4caf50; flex-shrink:0; margin-top:5px; }
        .ab-impact-text { font-size:14px; font-weight:500; color:#333; line-height:1.55; }
        .ab-impact-sources {
          font-size:10px; color:#aaa; font-style:italic; text-align:right;
          margin-bottom:28px;
        }

        /* ── CTA ── */
        .ab-cta { text-align:center; padding:40px 32px; background:linear-gradient(135deg,#e8f5e9,#f1f8e9); border:1px solid #c8e6c9; border-radius:18px; }
        .ab-cta-h { font-size:1.3rem; font-weight:700; color:#1b5e20; margin-bottom:8px; }
        .ab-cta-sub { font-size:14px; color:#666; margin-bottom:24px; }
        .ab-cta-btn { display:inline-block; padding:13px 36px; background:#2e7d32; color:#fff; border-radius:12px; font-size:15px; font-weight:700; text-decoration:none; transition:all 0.22s; border:none; cursor:pointer; box-shadow:0 6px 20px rgba(46,125,50,0.25); }
        .ab-cta-btn:hover { background:#1b5e20; transform:translateY(-2px); }
      `}</style>

      <div className="ab-wrap">

        {/* ── HERO ── */}
        <section className="ab-hero">
          <div>
            <div className="ab-hero-eyebrow">{t("about_eyebrow")}</div>
            <h1 className="ab-hero-h1">
              {t("about_h1a")}<br /><span>{t("about_h1b")}</span>
            </h1>
            <p className="ab-hero-p">{t("about_p1")}</p>
          </div>
          <div>
            {videoError ? (
              <div className="ab-video-error">
                <div style={{ fontSize: 36 }}>🎬</div>
                <div>Video unavailable</div>
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
                  style={{ width:"100%", height:"100%", objectFit:"cover" }}
                  playsInline
                />
                {!playing && (
                  <div className="ab-video-overlay" onClick={togglePlay}>
                    <div className="ab-play-btn">▶</div>
                  </div>
                )}
                {playing && (
                  <div className="ab-video-overlay" onClick={togglePlay} style={{ background:"transparent" }}>
                    <div className="ab-play-btn" style={{ opacity:0 }}>⏸</div>
                  </div>
                )}
                <div className="ab-video-badge">{t("about_video_badge")}</div>
              </div>
            )}
          </div>
        </section>

        {/* ── REAL STATS ── */}
        <div className="ab-stats">
          {REAL_STATS.map((s, i) => (
            <div key={i} className="ab-stat">
              <div className="ab-stat-num">{s.number}</div>
              <div className="ab-stat-label">{s.label}</div>
              <div className="ab-stat-src">Source: {s.source}</div>
            </div>
          ))}
        </div>
        <div className="ab-data-note">
          All figures are sourced from official Government of India publications (PIB, Ministry of Agriculture, NABARD, Constitution of India).
        </div>

        {/* ── FEATURES ── */}
        <section className="ab-features">
          <div className="ab-section-eyebrow">{t("about_feat_eyebrow")}</div>
          <h2 className="ab-section-h">{t("about_feat_title")}</h2>
          <div className="ab-features-grid">
            {features.map((f, i) => (
              <div key={i} className="ab-feat-card">
                <div className="ab-feat-img-wrap">
                  <img src={FEAT_IMGS[i]} alt={f.title} />
                </div>
                <div className="ab-feat-title">{f.title}</div>
                <p className="ab-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── BEFORE / AFTER ── */}
        <section className="ab-ba">
          <div className="ab-section-eyebrow">{t("about_ba_eyebrow")}</div>
          <h2 className="ab-section-h">{t("about_ba_title")}</h2>
          <div className="ab-ba-grid">
            <div className="ab-ba-card">
              <img src={beforeImg} alt="Before Krishi Sakhi" />
              <div className="ab-ba-label">{t("about_before_label")}</div>
            </div>
            <div className="ab-ba-card">
              <img src={afterImg} alt="After Krishi Sakhi" />
              <div className="ab-ba-label">{t("about_after_label")}</div>
            </div>
          </div>
        </section>

        {/* ── IMPACT — 100% real data ── */}
        <section className="ab-impact">
          <div className="ab-section-eyebrow">{t("about_impact_eyebrow")}</div>
          <h2 className="ab-section-h">{t("about_impact_title")}</h2>
          <div className="ab-impact-list">
            {REAL_IMPACTS.map((item, i) => (
              <div key={i} className="ab-impact-item">
                <div className="ab-impact-dot" />
                <div className="ab-impact-text">{item}</div>
              </div>
            ))}
          </div>
          <div className="ab-impact-sources">
            Sources: PIB (Press Information Bureau) · Ministry of Agriculture & Farmers Welfare ·
            NABARD All India Rural Financial Inclusion Survey · 8th Schedule, Constitution of India
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="ab-cta">
          <div className="ab-cta-h">{t("about_cta_h")}</div>
          <p className="ab-cta-sub">{t("about_cta_sub")}</p>
          <a href="/onboarding" className="ab-cta-btn">{t("about_cta_btn")}</a>
        </div>

      </div>
    </>
  );
}

export default About;