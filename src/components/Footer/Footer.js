import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";

function Footer() {
  const { t } = useLanguage();

  const links = [
    { label: t("footer_terms"),         path: "/terms" },
    { label: t("footer_disclaimer"),    path: "/disclaimer" },
    { label: t("footer_links"),         path: "/links" },
    { label: t("footer_policy"),        path: "/policy" },
    { label: t("footer_help"),          path: "/help" },
    { label: t("footer_accessibility"), path: "/accessibility" },
    { label: t("footer_privacy"),       path: "/privacy" },
  ];

  return (
    <>
      <style>{`
        .ks-footer {
          background: linear-gradient(180deg, #050e09 0%, #030a05 100%);
          border-top: 1px solid rgba(74,222,128,0.08);
          padding: 48px 32px 28px;
          font-family: 'DM Sans', sans-serif;
          color: rgba(240,232,213,0.5);
        }
        .ks-footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .ks-footer-top {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 40px;
        }
        @media(max-width: 768px) {
          .ks-footer-top { grid-template-columns: 1fr; gap: 28px; }
        }
        .ks-footer-brand { display: flex; flex-direction: column; gap: 12px; }
        .ks-footer-logo {
          display: flex; align-items: center; gap: 10px;
        }
        .ks-footer-logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #1a4025, #2d8653);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; border: 1px solid rgba(74,222,128,0.2);
        }
        .ks-footer-logo-name {
          font-size: 16px; font-weight: 700;
          color: rgba(240,232,213,0.85);
          letter-spacing: -0.3px;
        }
        .ks-footer-desc {
          font-size: 13px; line-height: 1.75;
          color: rgba(240,232,213,0.38);
          max-width: 320px;
        }
        .ks-footer-badges {
          display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px;
        }
        .ks-footer-badge {
          font-size: 10px; font-weight: 600;
          padding: 3px 10px; border-radius: 20px;
          background: rgba(74,222,128,0.07);
          border: 1px solid rgba(74,222,128,0.15);
          color: rgba(74,222,128,0.6);
          letter-spacing: 0.3px;
        }
        .ks-footer-col-title {
          font-size: 10px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(240,232,213,0.3);
          margin-bottom: 14px;
          font-family: 'Space Mono', monospace;
        }
        .ks-footer-nav {
          display: flex; flex-direction: column; gap: 10px;
        }
        .ks-footer-nav a {
          font-size: 13px; color: rgba(240,232,213,0.45);
          text-decoration: none; transition: color 0.15s;
          display: flex; align-items: center; gap: 6px;
        }
        .ks-footer-nav a::before {
          content: '›'; color: rgba(74,222,128,0.3); font-size: 14px;
        }
        .ks-footer-nav a:hover { color: rgba(74,222,128,0.8); }
        .ks-footer-contact { display: flex; flex-direction: column; gap: 10px; }
        .ks-footer-contact-item {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; color: rgba(240,232,213,0.4);
          line-height: 1.5;
        }
        .ks-footer-contact-ic { font-size: 15px; flex-shrink: 0; margin-top: 1px; }
        .ks-footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(74,222,128,0.08), rgba(196,127,26,0.06), transparent);
        }
        .ks-footer-bottom {
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 12px;
        }
        .ks-footer-copy {
          font-size: 11px; color: rgba(240,232,213,0.25);
          font-family: 'Space Mono', monospace; letter-spacing: 0.3px;
        }
        .ks-footer-links-row {
          display: flex; gap: 16px; flex-wrap: wrap;
        }
        .ks-footer-links-row a {
          font-size: 11px; color: rgba(240,232,213,0.25);
          text-decoration: none; transition: color 0.15s;
        }
        .ks-footer-links-row a:hover { color: rgba(74,222,128,0.6); }
        .ks-footer-gov {
          font-size: 11px; color: rgba(240,232,213,0.2);
          text-align: center; font-style: italic;
        }
      `}</style>

      <footer className="ks-footer">
        <div className="ks-footer-inner">
          <div className="ks-footer-top">

            {/* Brand */}
            <div className="ks-footer-brand">
              <div className="ks-footer-logo">
                <div className="ks-footer-logo-icon">🌾</div>
                <span className="ks-footer-logo-name">Krishi Sakhi</span>
              </div>
              <p className="ks-footer-desc">{t("footer_desc")}</p>
              <div className="ks-footer-badges">
                <span className="ks-footer-badge">🤖 AI Powered</span>
                <span className="ks-footer-badge">🗣 22 Languages</span>
                <span className="ks-footer-badge">🇮🇳 Made in India</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="ks-footer-col-title">Quick Links</div>
              <nav className="ks-footer-nav">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/schemes">Schemes</Link>
                <Link to="/soil-health">Soil Health</Link>
                <Link to="/activity">Activity Diary</Link>
                <Link to="/dashboard">Dashboard</Link>
              </nav>
            </div>

            {/* Contact / Info */}
            <div>
              <div className="ks-footer-col-title">Support</div>
              <div className="ks-footer-contact">
                <div className="ks-footer-contact-item">
                  <span className="ks-footer-contact-ic">📞</span>
                  <span>Kisan Call Centre<br />1800-180-1551 (Free)</span>
                </div>
                <div className="ks-footer-contact-item">
                  <span className="ks-footer-contact-ic">🌐</span>
                  <span>mkisan.gov.in</span>
                </div>
                <div className="ks-footer-contact-item">
                  <span className="ks-footer-contact-ic">🏛️</span>
                  <span>Agriculture Ministry<br />Govt. of India</span>
                </div>
                <div className="ks-footer-contact-item">
                  <span className="ks-footer-contact-ic">🤖</span>
                  <span>24/7 AI Chat Support<br />Available in 22 languages</span>
                </div>
              </div>
            </div>

          </div>

          <div className="ks-footer-divider" />

          <div className="ks-footer-bottom">
            <div className="ks-footer-copy">{t("footer_copyright")}</div>
            <div className="ks-footer-links-row">
              {links.map(l => (
                <Link key={l.path} to={l.path}>{l.label}</Link>
              ))}
            </div>
          </div>

          <div className="ks-footer-gov">
            {t("footer_support")} &nbsp;|&nbsp; {t("footer_dev")}
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;