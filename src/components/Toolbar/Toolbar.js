import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FiMoreVertical, FiMenu } from "react-icons/fi";
import "./Toolbar.css";

import logo from "../../assets/logo.jpg";
import Login from "../../pages/Login/Login";
import SignUp from "../../pages/SignUp/SignUp";
import { useLanguage, SUPPORTED_LANGUAGES } from "../../context/LanguageContext";

const LANGS = SUPPORTED_LANGUAGES;

export default function Toolbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, selectLanguage, t } = useLanguage();

  const [user, setUser]               = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogin, setShowLogin]     = useState(false);
  const [showSignUp, setShowSignUp]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langOpen, setLangOpen]       = useState(false);
  const [langSearch, setLangSearch]   = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ← NEW

  const userMenuRef  = useRef(null);
  const dropRef      = useRef(null);
  const langRef      = useRef(null);
  const langSearchRef = useRef(null);

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem("loggedInUser");
      try { setUser(stored ? JSON.parse(stored) : null); } catch { setUser(null); }
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (dropRef.current    && !dropRef.current.contains(e.target))     setDropdownOpen(false);
      if (langRef.current    && !langRef.current.contains(e.target))     { setLangOpen(false); setLangSearch(""); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (langOpen && langSearchRef.current) {
      setTimeout(() => langSearchRef.current?.focus(), 50);
    } else { setLangSearch(""); }
  }, [langOpen]);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  const handleLogin = (u) => {
    localStorage.setItem("loggedInUser", JSON.stringify(u));
    setUser(u); setShowLogin(false);
  };

  const handleSignup = (u) => {
    localStorage.setItem("loggedInUser", JSON.stringify(u));
    setUser(u); setShowSignUp(false);
    setTimeout(() => navigate("/onboarding"), 800);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("profileCompleted");
    setUser(null); setUserMenuOpen(false);
    navigate("/"); window.location.reload();
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

  const navLinks = [
  { to: "/",            label: t("nav_home") },
  { to: "/about",       label: t("nav_about") },
  { to: "/schemes",     label: t("nav_schemes") },
  { to: "/soil-health", label: t("nav_soil") },
  { to: "/mandi",       label: "🌾 Mandi" },        // ← ADD
  ...(user ? [
    { to: "/dashboard",  label: t("nav_dashboard") },
    { to: "/onboarding", label: t("nav_profile") },
  ] : []),
  { to: "/activity",    label: t("nav_activity") },
  { to: "/contact",     label: "Contact" },
  { to: "/help",        label: "Help" },
];


  return (
    <>
      <style>{`
        .lang-switcher { position: relative; }
        .lang-trigger {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 10px; border-radius: 10px;
          background: rgba(76,175,101,0.07); border: 1px solid rgba(76,175,101,0.22);
          cursor: pointer; transition: all 0.18s; font-family: 'DM Sans', sans-serif;
        }
        .lang-trigger:hover { background: rgba(76,175,101,0.14); }
        .lang-trigger-flag  { font-size: 15px; line-height: 1; }
        .lang-trigger-label { font-size: 11px; font-weight: 700; color: #7dd99a; letter-spacing: 0.8px; font-family: 'Space Mono', monospace; }
        .lang-trigger-arrow { font-size: 9px; color: rgba(125,217,154,0.5); transition: transform 0.2s; }
        .lang-trigger-arrow.open { transform: rotate(180deg); }
        .lang-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0; z-index: 9999;
          background: #0c1a0e; border: 1px solid rgba(196,127,26,0.22);
          border-radius: 14px; min-width: 200px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.55);
          animation: langDrop 0.18s cubic-bezier(0.22,1,0.36,1);
          overflow: hidden; display: flex; flex-direction: column;
        }
        @keyframes langDrop {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .lang-search-wrap { padding: 10px 10px 6px; border-bottom: 1px solid rgba(196,127,26,0.12); }
        .lang-search-input {
          width: 100%; padding: 7px 10px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(76,175,101,0.2); border-radius: 8px;
          color: #f0e8d5; font-size: 12px; font-family: 'DM Sans', sans-serif; outline: none;
        }
        .lang-search-input::placeholder { color: rgba(240,232,213,0.3); }
        .lang-options-scroll { max-height: 260px; overflow-y: auto; padding: 6px; scrollbar-width: thin; }
        .lang-option {
          display: flex; align-items: center; gap: 10px; padding: 9px 12px;
          border-radius: 9px; cursor: pointer; transition: background 0.15s;
        }
        .lang-option:hover  { background: rgba(76,175,101,0.1); }
        .lang-option.active { background: rgba(76,175,101,0.14); }
        .lang-option-flag  { font-size: 16px; flex-shrink: 0; }
        .lang-option-text  { display: flex; flex-direction: column; gap: 1px; }
        .lang-option-code  { font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700; color: #7dd99a; }
        .lang-option-full  { font-size: 12px; color: rgba(240,232,213,0.55); }
        .lang-option-check { margin-left: auto; font-size: 11px; color: #4caf65; }
        .lang-count-badge  {
          font-size: 9px; font-family: 'Space Mono', monospace; color: rgba(125,217,154,0.45);
          padding: 4px 10px 2px; border-bottom: 1px solid rgba(196,127,26,0.08); text-align: center;
        }

        /* ── MOBILE MENU DRAWER ── */
        .mobile-drawer {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          z-index: 99998; display: flex;
        }
        .mobile-drawer-bg {
          position: absolute; inset: 0;
          background: rgba(3,10,4,0.75); backdrop-filter: blur(6px);
        }
        .mobile-drawer-panel {
          position: relative; z-index: 1;
          width: 78%; max-width: 300px; height: 100%;
          background: linear-gradient(160deg,#081309,#0c1a0e);
          border-right: 1px solid rgba(196,127,26,0.18);
          display: flex; flex-direction: column;
          animation: drawerIn 0.28s cubic-bezier(0.22,1,0.36,1);
          overflow-y: auto;
        }
        @keyframes drawerIn {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        .mobile-drawer-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px; border-bottom: 1px solid rgba(196,127,26,0.12);
        }
        .mobile-drawer-logo {
          display: flex; align-items: center; gap: 10px;
        }
        .mobile-drawer-close {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(255,255,255,0.06); border: none;
          color: rgba(240,232,213,0.6); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .mobile-drawer-user {
          margin: 16px 20px; padding: 14px 16px;
          background: rgba(76,175,101,0.08); border: 1px solid rgba(76,175,101,0.18);
          border-radius: 12px;
        }
        .mobile-drawer-links { padding: 8px 12px; flex: 1; }
        .mobile-drawer-link {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 12px; border-radius: 10px;
          color: rgba(240,232,213,0.7); text-decoration: none;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
          transition: all 0.18s; margin-bottom: 2px;
        }
        .mobile-drawer-link:hover,
        .mobile-drawer-link.active { 
          background: rgba(76,175,101,0.1); color: #7dd99a;
        }
        .mobile-drawer-footer {
          padding: 16px 20px; border-top: 1px solid rgba(196,127,26,0.12);
          display: flex; flex-direction: column; gap: 10px;
        }
        .mobile-auth-btn {
          padding: 12px; border-radius: 10px; text-align: center;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; border: none; transition: all 0.2s;
        }
        .mobile-auth-login {
          background: rgba(196,127,26,0.1); border: 1px solid rgba(196,127,26,0.3);
          color: #e8a832;
        }
        .mobile-auth-signup {
          background: linear-gradient(135deg,#2e6b3e,#4caf65); color: #fff;
        }
        .mobile-logout-btn {
          padding: 12px; border-radius: 10px; text-align: center;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; border: 1px solid rgba(248,113,113,0.25);
          background: rgba(248,113,113,0.08); color: #f87171; width: 100%;
        }

        /* ── HAMBURGER BUTTON ── */
        .hamburger-btn {
          display: none; background: none; border: none;
          color: rgba(240,232,213,0.7); cursor: pointer;
          padding: 6px; border-radius: 8px;
          transition: background 0.18s;
        }
        .hamburger-btn:hover { background: rgba(255,255,255,0.08); }

        @media(max-width:768px){
          .hamburger-btn { display: flex; align-items: center; justify-content: center; }
          .lang-trigger-label { display: none; }
          .lang-trigger { padding: 6px 8px; }
          .desktop-more { display: none; }
        }
        @media(min-width:769px){
          .mobile-only { display: none; }
        }
      `}</style>

      <div className="toolbar">
        {/* LEFT */}
        <div className="toolbar-left">
          {/* Hamburger — mobile only */}
          <button className="hamburger-btn" onClick={() => setMobileMenuOpen(true)}>
            <FiMenu size={22} />
          </button>
          <img src={logo} alt="Krishi Sakhi" className="toolbar-logo" />
          <span className="site-name">Krishi Sakhi</span>
        </div>

        {/* CENTER — desktop only */}
        <div className="toolbar-center">
          <Link className={getActive("/")} to="/">{t("nav_home")}</Link>
          <Link className={getActive("/about")} to="/about">{t("nav_about")}</Link>
          <Link className={getActive("/schemes")} to="/schemes">{t("nav_schemes")}</Link>
          <Link className={getActive("/soil-health")} to="/soil-health">{t("nav_soil")}</Link>
          {user ? (
            <Link className={getActive("/dashboard")} to="/dashboard">{t("nav_dashboard")}</Link>
          ) : (
            <span className="disabled">{t("nav_dashboard_locked")}</span>
          )}
{user && <Link className={getActive("/onboarding")} to="/onboarding">{t("nav_profile")}</Link>}
<Link className={getActive("/mandi")} to="/mandi">🌾 Mandi</Link>
<Link className={getActive("/activity")} to="/activity">{t("nav_activity")}</Link>
        </div>

        {/* RIGHT */}
        <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>

          {/* Language Switcher */}
          <div className="lang-switcher" ref={langRef}>
            <button className="lang-trigger" onClick={() => setLangOpen(o => !o)}>
              <span className="lang-trigger-flag">{activeLang.flag}</span>
              <span className="lang-trigger-label">{activeLang.label}</span>
              <span className={`lang-trigger-arrow ${langOpen ? "open" : ""}`}>▾</span>
            </button>
            {langOpen && (
              <div className="lang-dropdown">
                <div className="lang-search-wrap">
                  <input ref={langSearchRef} className="lang-search-input"
                    type="text" placeholder="Search language..."
                    value={langSearch} onChange={e => setLangSearch(e.target.value)} />
                </div>
                <div className="lang-count-badge">{filteredLangs.length} of {LANGS.length} languages</div>
                <div className="lang-options-scroll">
                  {filteredLangs.length === 0
                    ? <div style={{padding:"12px",textAlign:"center",fontSize:"12px",color:"rgba(240,232,213,0.3)"}}>No language found</div>
                    : filteredLangs.map(l => (
                        <div key={l.code}
                          className={`lang-option ${lang === l.code ? "active" : ""}`}
                          onClick={() => { selectLanguage(l.code); setLangOpen(false); setLangSearch(""); }}
                        >
                          <span className="lang-option-flag">{l.flag}</span>
                          <div className="lang-option-text">
                            <span className="lang-option-code">{l.label}</span>
                            <span className="lang-option-full">{l.native || l.full}</span>
                          </div>
                          {lang === l.code && <span className="lang-option-check">✓</span>}
                        </div>
                      ))
                  }
                </div>
              </div>
            )}
          </div>

          {/* User Menu / Auth — desktop */}
          {user ? (
            <div ref={userMenuRef} style={{position:"relative"}} className="desktop-only">
              <button onClick={() => setUserMenuOpen(o => !o)} style={{
                display:"flex", alignItems:"center", gap:8,
                background:"rgba(76,175,101,0.1)", border:"1px solid rgba(76,175,101,0.3)",
                borderRadius:40, padding:"5px 12px 5px 5px", cursor:"pointer",
              }}>
                <div style={{
                  width:28, height:28, borderRadius:"50%",
                  background:"linear-gradient(135deg,#2e6b3e,#4caf65)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"#fff", fontSize:11, fontWeight:700,
                }}>{initials}</div>
                <span style={{color:"#7dd99a", fontSize:13, fontWeight:600}}>{firstName}</span>
                <span style={{color:"rgba(125,217,154,0.45)", fontSize:10}}>▾</span>
              </button>
              {userMenuOpen && (
                <div style={{
                  position:"absolute", top:44, right:0, zIndex:9999,
                  background:"#0c1a0e", border:"1px solid rgba(196,127,26,0.22)",
                  borderRadius:14, padding:"8px 0", minWidth:200,
                  boxShadow:"0 16px 48px rgba(0,0,0,0.6)",
                }}>
                  <div style={{padding:"12px 16px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)", marginBottom:4}}>
                    <div style={{color:"#f0e8d5", fontWeight:700, fontSize:14}}>{user.name}</div>
                    <div style={{color:"rgba(240,232,213,0.38)", fontSize:11, marginTop:3, fontFamily:"'Space Mono',monospace"}}>{user.email}</div>
                  </div>
                  <Link to="/dashboard"  onClick={() => setUserMenuOpen(false)} style={MI}>📊 {t("nav_dashboard")}</Link>
                  <Link to="/mandi"      onClick={() => setUserMenuOpen(false)} style={MI}>🌾 Mandi — Sell/Buy</Link>  {/* ← ADD */}
                  <Link to="/onboarding" onClick={() => setUserMenuOpen(false)} style={MI}>👤 {t("nav_profile")}</Link>
                  <Link to="/activity"   onClick={() => setUserMenuOpen(false)} style={MI}>📋 {t("nav_activity")}</Link>
                  <div style={{borderTop:"1px solid rgba(255,255,255,0.06)", marginTop:4}}>
                    <button onClick={handleLogout} style={{...MI, color:"#f87171", width:"100%", textAlign:"left", background:"none", border:"none", cursor:"pointer"}}>
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="desktop-only" style={{display:"flex", gap:6}}>
              <button className="auth-btn" onClick={() => setShowLogin(true)}>{t("nav_login")}</button>
              <button className="auth-btn" onClick={() => setShowSignUp(true)}>{t("nav_signup")}</button>
            </div>
          )}

          {/* More ⋮ — desktop only */}
          <div ref={dropRef} style={{position:"relative"}} className="desktop-more">
            <FiMoreVertical size={20} onClick={() => setDropdownOpen(o => !o)}
              style={{cursor:"pointer", color:"rgba(240,232,213,0.45)"}} />
            {dropdownOpen && (
              <div style={{
                position:"absolute", top:28, right:0, background:"#0c1a0e",
                border:"1px solid rgba(196,127,26,0.22)", borderRadius:12,
                boxShadow:"0 10px 30px rgba(0,0,0,0.5)", display:"flex",
                flexDirection:"column", minWidth:160, zIndex:9999, padding:"6px 0",
              }}>
                <Link to="/contact"     onClick={() => setDropdownOpen(false)} style={MI}>📩 Contact Us</Link>
                <Link to="/suggestions" onClick={() => setDropdownOpen(false)} style={MI}>💡 Suggestions</Link>
                <Link to="/help"        onClick={() => setDropdownOpen(false)} style={MI}>❓ Help</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-bg" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-drawer-panel">

            {/* Header */}
            <div className="mobile-drawer-head">
              <div className="mobile-drawer-logo">
                <img src={logo} alt="logo" style={{width:32, height:32, borderRadius:"50%", objectFit:"cover"}} />
                <span style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", fontWeight:700, color:"#f0e8d5"}}>Krishi Sakhi</span>
              </div>
              <button className="mobile-drawer-close" onClick={() => setMobileMenuOpen(false)}>
                <IoClose size={18} />
              </button>
            </div>

            {/* User info if logged in */}
            {user && (
              <div className="mobile-drawer-user">
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <div style={{
                    width:36, height:36, borderRadius:"50%",
                    background:"linear-gradient(135deg,#2e6b3e,#4caf65)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"#fff", fontSize:13, fontWeight:700, flexShrink:0,
                  }}>{initials}</div>
                  <div>
                    <div style={{color:"#f0e8d5", fontWeight:700, fontSize:14}}>{user.name}</div>
                    <div style={{color:"rgba(240,232,213,0.4)", fontSize:11, fontFamily:"'Space Mono',monospace"}}>{user.email}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Nav Links */}
            <div className="mobile-drawer-links">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to}
                  className={`mobile-drawer-link ${location.pathname === to ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="mobile-drawer-footer">
              {user ? (
                <button className="mobile-logout-btn" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  🚪 Logout
                </button>
              ) : (
                <>
                  <button className="mobile-auth-btn mobile-auth-login"
                    onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }}>
                    {t("nav_login")}
                  </button>
                  <button className="mobile-auth-btn mobile-auth-signup"
                    onClick={() => { setShowSignUp(true); setMobileMenuOpen(false); }}>
                    {t("nav_signup")}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="modal-overlay" onClick={e => { if (e.target.classList.contains("modal-overlay")) setShowLogin(false); }}>
          <div className="modal-content">
            <IoClose size={22} className="close-btn" onClick={() => setShowLogin(false)} />
            <Login onClose={() => setShowLogin(false)} onLogin={handleLogin} />
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
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
  display:"block", padding:"10px 16px",
  color:"#d4c4a0", fontSize:13, textDecoration:"none",
  fontFamily:"'DM Sans',sans-serif", transition:"background 0.15s",
};