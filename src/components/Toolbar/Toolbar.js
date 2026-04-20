// src/components/Toolbar/Toolbar.jsx
// ─────────────────────────────────────────────────────────────────────────────
// FULL CORRECTED FILE
// Fixes:
//  1. All nav link text now uses t() — translates with selected language
//  2. handleLogin/handleSignup explicitly saves to localStorage
//  3. storage event listener syncs user across tabs
//  4. Login/Signup button text translated
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import "./Toolbar.css";

import logo from "../../assets/logo.jpg";
import Login from "../../pages/Login/Login";
import SignUp from "../../pages/SignUp/SignUp";
import { useLanguage, SUPPORTED_LANGUAGES } from "../../context/LanguageContext";

const LANGS = SUPPORTED_LANGUAGES;

export default function Toolbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { lang, selectLanguage, t } = useLanguage();

  const [user, setUser]               = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogin, setShowLogin]     = useState(false);
  const [showSignUp, setShowSignUp]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langOpen, setLangOpen]       = useState(false);
  const [langSearch, setLangSearch]   = useState("");

  const userMenuRef  = useRef(null);
  const dropRef      = useRef(null);
  const langRef      = useRef(null);
  const langSearchRef = useRef(null);

  // ── Load user from localStorage + sync across tabs ──
  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem("loggedInUser");
      try { setUser(stored ? JSON.parse(stored) : null); } catch { setUser(null); }
    };
    load();
    // Sync if user logs in/out in another tab
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  // ── Close dropdowns on outside click ──
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (dropRef.current    && !dropRef.current.contains(e.target))     setDropdownOpen(false);
      if (langRef.current    && !langRef.current.contains(e.target))     { setLangOpen(false); setLangSearch(""); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Focus search input when language dropdown opens ──
  useEffect(() => {
    if (langOpen && langSearchRef.current) {
      setTimeout(() => langSearchRef.current?.focus(), 50);
    } else {
      setLangSearch("");
    }
  }, [langOpen]);

  // ── Auth handlers — always save to localStorage ──
  const handleLogin = (u) => {
    localStorage.setItem("loggedInUser", JSON.stringify(u)); // ← CRITICAL FIX
    setUser(u);
    setShowLogin(false);
  };

  const handleSignup = (u) => {
    localStorage.setItem("loggedInUser", JSON.stringify(u)); // ← CRITICAL FIX
    setUser(u);
    setShowSignUp(false);
    setTimeout(() => navigate("/onboarding"), 800);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("profileCompleted");
    setUser(null);
    setUserMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  const getActive = (path) => location.pathname === path ? "active" : "";

  const firstName = user?.name?.split(" ")[0] || "";
  const initials  = user?.name
    ? user.name.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const activeLang = LANGS.find(l => l.code === lang) || LANGS[0];

  const filteredLangs = langSearch.trim()
    ? LANGS.filter(l =>
        l.label.toLowerCase().includes(langSearch.toLowerCase()) ||
        l.native?.toLowerCase().includes(langSearch.toLowerCase()) ||
        l.code.toLowerCase().includes(langSearch.toLowerCase())
      )
    : LANGS;

  return (
    <>
      <style>{`
        .lang-switcher { position: relative; }
        .lang-trigger {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px 6px 10px; border-radius: 10px;
          background: rgba(76,175,101,0.07); border: 1px solid rgba(76,175,101,0.22);
          cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
        }
        .lang-trigger:hover { background: rgba(76,175,101,0.14); border-color: rgba(76,175,101,0.38); }
        .lang-trigger-flag  { font-size: 15px; line-height: 1; }
        .lang-trigger-label { font-size: 11px; font-weight: 700; color: #7dd99a; letter-spacing: 0.8px; font-family: 'Space Mono', monospace; }
        .lang-trigger-arrow { font-size: 9px; color: rgba(125,217,154,0.5); transition: transform 0.2s; line-height: 1; }
        .lang-trigger-arrow.open { transform: rotate(180deg); }

        .lang-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0; z-index: 9999;
          background: #0c1a0e; border: 1px solid rgba(196,127,26,0.22);
          border-radius: 14px; padding: 0; min-width: 210px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.55);
          animation: langDrop 0.18s cubic-bezier(0.22,1,0.36,1);
          overflow: hidden; display: flex; flex-direction: column;
        }
        @keyframes langDrop {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .lang-search-wrap {
          padding: 10px 10px 6px; border-bottom: 1px solid rgba(196,127,26,0.12); flex-shrink: 0;
        }
        .lang-search-input {
          width: 100%; padding: 7px 10px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(76,175,101,0.2); border-radius: 8px;
          color: #f0e8d5; font-size: 12px; font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.15s;
        }
        .lang-search-input::placeholder { color: rgba(240,232,213,0.3); }
        .lang-search-input:focus { border-color: rgba(76,175,101,0.45); }
        .lang-options-scroll {
          max-height: 280px; overflow-y: auto; padding: 6px;
          scrollbar-width: thin; scrollbar-color: rgba(76,175,101,0.3) transparent;
        }
        .lang-options-scroll::-webkit-scrollbar { width: 4px; }
        .lang-options-scroll::-webkit-scrollbar-thumb { background: rgba(76,175,101,0.3); border-radius: 4px; }
        .lang-option {
          display: flex; align-items: center; gap: 10px; padding: 9px 12px;
          border-radius: 9px; cursor: pointer; transition: background 0.15s; font-family: 'DM Sans', sans-serif;
        }
        .lang-option:hover  { background: rgba(76,175,101,0.1); }
        .lang-option.active { background: rgba(76,175,101,0.14); }
        .lang-option-flag  { font-size: 16px; flex-shrink: 0; }
        .lang-option-text  { display: flex; flex-direction: column; gap: 1px; }
        .lang-option-code  { font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700; color: #7dd99a; letter-spacing: 0.8px; }
        .lang-option-full  { font-size: 12px; color: rgba(240,232,213,0.55); }
        .lang-option-check { margin-left: auto; font-size: 11px; color: #4caf65; }
        .lang-no-result    { padding: 12px; text-align: center; font-size: 12px; color: rgba(240,232,213,0.3); font-family: 'DM Sans', sans-serif; }
        .lang-count-badge  {
          font-size: 9px; font-family: 'Space Mono', monospace; color: rgba(125,217,154,0.45);
          padding: 4px 10px 2px; border-bottom: 1px solid rgba(196,127,26,0.08);
          text-align: center; letter-spacing: 0.5px;
        }
      `}</style>

      <div className="toolbar">
        {/* ── LEFT ── */}
        <div className="toolbar-left">
          <img src={logo} alt="Krishi Sakhi" className="toolbar-logo" />
          <span className="site-name">Krishi Sakhi</span>
        </div>

        {/* ── CENTER — all text via t() so it translates ── */}
        <div className="toolbar-center">
          <Link className={getActive("/")} to="/">
            {t("nav_home")}
          </Link>
          <Link className={getActive("/about")} to="/about">
            {t("nav_about")}
          </Link>
          <Link className={getActive("/schemes")} to="/schemes">
            {t("nav_schemes")}
          </Link>
          <Link className={getActive("/soil-health")} to="/soil-health">
            {t("nav_soil")}
          </Link>
          {user ? (
            <Link className={getActive("/dashboard")} to="/dashboard">
              {t("nav_dashboard")}
            </Link>
          ) : (
            <span className="disabled" title={t("nav_dashboard_locked")}>
              {t("nav_dashboard_locked")}
            </span>
          )}
          {user && (
            <Link className={getActive("/onboarding")} to="/onboarding">
              {t("nav_profile")}
            </Link>
          )}
          <Link className={getActive("/activity")} to="/activity">
            {t("nav_activity")}
          </Link>
        </div>

        {/* ── RIGHT ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          {/* ── LANGUAGE SWITCHER ── */}
          <div className="lang-switcher" ref={langRef}>
            <button className="lang-trigger" onClick={() => setLangOpen(o => !o)}>
              <span className="lang-trigger-flag">{activeLang.flag}</span>
              <span className="lang-trigger-label">{activeLang.label}</span>
              <span className={`lang-trigger-arrow ${langOpen ? "open" : ""}`}>▾</span>
            </button>

            {langOpen && (
              <div className="lang-dropdown">
                <div className="lang-search-wrap">
                  <input
                    ref={langSearchRef}
                    className="lang-search-input"
                    type="text"
                    placeholder="Search language..."
                    value={langSearch}
                    onChange={e => setLangSearch(e.target.value)}
                  />
                </div>
                <div className="lang-count-badge">
                  {filteredLangs.length} of {LANGS.length} languages
                </div>
                <div className="lang-options-scroll">
                  {filteredLangs.length === 0 ? (
                    <div className="lang-no-result">No language found</div>
                  ) : (
                    filteredLangs.map(l => (
                      <div
                        key={l.code}
                        className={`lang-option ${lang === l.code ? "active" : ""}`}
                        onClick={() => {
                          selectLanguage(l.code);
                          setLangOpen(false);
                          setLangSearch("");
                        }}
                      >
                        <span className="lang-option-flag">{l.flag}</span>
                        <div className="lang-option-text">
                          <span className="lang-option-code">{l.label}</span>
                          <span className="lang-option-full">{l.native || l.full}</span>
                        </div>
                        {lang === l.code && <span className="lang-option-check">✓</span>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── USER MENU or AUTH BUTTONS ── */}
          {user ? (
            <div ref={userMenuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  background: "rgba(76,175,101,0.1)", border: "1px solid rgba(76,175,101,0.3)",
                  borderRadius: 40, padding: "5px 14px 5px 5px", cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "linear-gradient(135deg,#2e6b3e,#4caf65)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                  {initials}
                </div>
                <span style={{ color: "#7dd99a", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
                  {firstName}
                </span>
                <span style={{ color: "rgba(125,217,154,0.45)", fontSize: 10 }}>▾</span>
              </button>

              {userMenuOpen && (
                <div style={{
                  position: "absolute", top: 44, right: 0, zIndex: 9999,
                  background: "#0c1a0e", border: "1px solid rgba(196,127,26,0.22)",
                  borderRadius: 14, padding: "8px 0", minWidth: 200,
                  boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                }}>
                  <div style={{ padding: "12px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
                    <div style={{ color: "#f0e8d5", fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>
                      {user.name}
                    </div>
                    <div style={{ color: "rgba(240,232,213,0.38)", fontSize: 11, marginTop: 3, fontFamily: "'Space Mono',monospace" }}>
                      {user.email}
                    </div>
                  </div>
                  <Link to="/dashboard"  onClick={() => setUserMenuOpen(false)} style={MI}>📊 {t("nav_dashboard")}</Link>
                  <Link to="/onboarding" onClick={() => setUserMenuOpen(false)} style={MI}>👤 {t("nav_profile")}</Link>
                  <Link to="/activity"   onClick={() => setUserMenuOpen(false)} style={MI}>📋 {t("nav_activity")}</Link>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 4 }}>
                    <button
                      onClick={handleLogout}
                      style={{ ...MI, color: "#f87171", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="auth-btn" onClick={() => setShowLogin(true)}>
                {t("nav_login")}
              </button>
              <button className="auth-btn" onClick={() => setShowSignUp(true)}>
                {t("nav_signup")}
              </button>
            </>
          )}

          {/* ── More ⋮ ── */}
          <div ref={dropRef} style={{ position: "relative" }}>
            <FiMoreVertical
              size={20}
              onClick={() => setDropdownOpen(o => !o)}
              style={{ cursor: "pointer", color: "rgba(240,232,213,0.45)", display: "block" }}
            />
            {dropdownOpen && (
              <div style={{
                position: "absolute", top: 28, right: 0, background: "#0c1a0e",
                border: "1px solid rgba(196,127,26,0.22)", borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)", display: "flex",
                flexDirection: "column", minWidth: 160, zIndex: 9999, padding: "6px 0",
              }}>
                <Link to="/contact"     onClick={() => setDropdownOpen(false)} style={MI}>📩 Contact Us</Link>
                <Link to="/suggestions" onClick={() => setDropdownOpen(false)} style={MI}>💡 Suggestions</Link>
                <Link to="/help"        onClick={() => setDropdownOpen(false)} style={MI}>❓ Help</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── LOGIN MODAL ── */}
      {showLogin && (
        <div className="modal-overlay" onClick={e => { if (e.target.classList.contains("modal-overlay")) setShowLogin(false); }}>
          <div className="modal-content">
            <IoClose size={22} className="close-btn" onClick={() => setShowLogin(false)} />
            <Login onClose={() => setShowLogin(false)} onLogin={handleLogin} />
          </div>
        </div>
      )}

      {/* ── SIGNUP MODAL ── */}
      {showSignUp && (
        <div className="modal-overlay" onClick={e => { if (e.target.classList.contains("modal-overlay")) setShowSignUp(false); }}>
          <div className="modal-content signup">
            <IoClose size={22} className="close-btn" onClick={() => setShowSignUp(false)} />
            <SignUp onClose={() => setShowSignUp(false)} onSignup={handleSignup} />
          </div>
        </div>
      )}
    </>
  );
}

const MI = {
  display: "block", padding: "10px 16px",
  color: "#d4c4a0", fontSize: 13, textDecoration: "none",
  fontFamily: "'DM Sans',sans-serif", transition: "background 0.15s",
};