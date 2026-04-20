// src/components/SchemeFeed/SchemeFeed.jsx
// Uses PIB direct RSS via rss2json (free, no key needed) + data.gov.in for schemes
// Translation via existing LanguageContext /api/translate endpoint

import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";

const BASE_URL = "https://krishi-sakhi-backend-6.onrender.com/api";

// ── RSS Sources (PIB direct + agri-specific feeds) ──────────────────────────
const RSS_SOURCES = [
  {
    name: "PIB Agriculture",
    url:  "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fpib.gov.in%2FRssMain.aspx%3FModId%3D6%26Lang%3D1",
    tag:  "Govt",
  },
  {
    name: "PIB Rural Development",
    url:  "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fpib.gov.in%2FRssMain.aspx%3FModId%3D15%26Lang%3D1",
    tag:  "Rural",
  },
  {
    name: "Kisan Portal",
    url:  "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fkisan.gov.in%2Frss%2FlatestNews.rss",
    tag:  "Kisan",
  },
];

// ── Static fallback schemes (always shown if RSS fails) ───────────────────────
const STATIC_SCHEMES = [
  {
    id:          "pmkisan-static",
    title:       "PM-KISAN — ₹6,000/year Direct Income Support",
    description: "Eligible farmer families receive ₹6,000 per year in three installments of ₹2,000 directly to their bank account.",
    link:        "https://pmkisan.gov.in",
    tag:         "PM-KISAN",
    source:      "pmkisan.gov.in",
    pubDate:     "",
    isStatic:    true,
  },
  {
    id:          "pmfby-static",
    title:       "PMFBY — Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance at very low premium rates. Covers losses due to natural calamities, pests and diseases.",
    link:        "https://pmfby.gov.in",
    tag:         "Insurance",
    source:      "pmfby.gov.in",
    pubDate:     "",
    isStatic:    true,
  },
  {
    id:          "pmksy-static",
    title:       "PMKSY — Water to Every Field",
    description: "Pradhan Mantri Krishi Sinchayee Yojana ensures irrigation facilities for all agricultural lands.",
    link:        "https://pmksy.gov.in",
    tag:         "Irrigation",
    source:      "pmksy.gov.in",
    pubDate:     "",
    isStatic:    true,
  },
  {
    id:          "enam-static",
    title:       "eNAM — National Agriculture Market",
    description: "Online trading platform for agricultural commodities. Get better price discovery for your crops.",
    link:        "https://enam.gov.in",
    tag:         "Market",
    source:      "enam.gov.in",
    pubDate:     "",
    isStatic:    true,
  },
  {
    id:          "soil-static",
    title:       "Soil Health Card Scheme",
    description: "Free soil testing and crop-wise fertilizer recommendations to improve soil health and productivity.",
    link:        "https://soilhealth.dac.gov.in",
    tag:         "Soil",
    source:      "soilhealth.dac.gov.in",
    pubDate:     "",
    isStatic:    true,
  },
  {
    id:          "kcc-static",
    title:       "Kisan Credit Card (KCC)",
    description: "Short-term credit needs of farmers for crops, post-harvest expenses and allied activities at low interest rates.",
    link:        "https://www.nabard.org/content.aspx?id=572",
    tag:         "Credit",
    source:      "nabard.org",
    pubDate:     "",
    isStatic:    true,
  },
];

const LANG_NAME_MAP = {
  en:"English",  hi:"Hindi",    ml:"Malayalam", ta:"Tamil",
  te:"Telugu",   kn:"Kannada",  bn:"Bengali",   mr:"Marathi",
  gu:"Gujarati", pa:"Punjabi",  or:"Odia",      as:"Assamese",
  ur:"Urdu",     ks:"Kashmiri", sd:"Sindhi",    sa:"Sanskrit",
  kok:"Konkani", mai:"Maithili",doi:"Dogri",    bho:"Bhojpuri",
  mni:"Manipuri (Meitei)",      sat:"Santali",
};

// ── Batch translate via backend ───────────────────────────────────────────────
async function translateBatch(items, targetLang) {
  if (!targetLang || targetLang === "en" || !LANG_NAME_MAP[targetLang]) return items;

  const data = {};
  items.forEach((item, i) => {
    if (item.title)       data[`${i}_t`] = item.title;
    if (item.description) data[`${i}_d`] = item.description;
  });

  try {
    const res = await fetch(`${BASE_URL}/translate`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ lang: LANG_NAME_MAP[targetLang], data }),
    });
    if (!res.ok) return items;
    const result = await res.json();
    return items.map((item, i) => ({
      ...item,
      title:       result[`${i}_t`] || item.title,
      description: result[`${i}_d`] || item.description,
    }));
  } catch {
    return items;
  }
}

const CACHE_KEY = "scheme_feed_v3";
const CACHE_TTL = 30 * 60 * 1000; // 30 min

// ── UI label maps ─────────────────────────────────────────────────────────────
const SECTION_TITLE = {
  en:"Government Agriculture Schemes",
  hi:"सरकारी कृषि योजनाएं",        ml:"സർക്കാർ കാർഷിക പദ്ധതികൾ",
  ta:"அரசு வேளாண் திட்டங்கள்",    te:"ప్రభుత్వ వ్యవసాయ పథకాలు",
  kn:"ಸರ್ಕಾರಿ ಕೃಷಿ ಯೋಜನೆಗಳು",     bn:"সরকারি কৃষি প্রকল্প",
  mr:"सरकारी कृषी योजना",          gu:"સરકારી કૃષિ યોજनाओ",
  pa:"ਸਰਕਾਰੀ ਖੇਤੀ ਯੋਜਨਾਵਾਂ",
};

const READ_MORE = {
  en:"Read more →", hi:"और पढ़ें →",    ml:"കൂടുതൽ വായിക്കുക →",
  ta:"மேலும் படிக்க →", te:"మరింత చదవండి →", kn:"ಹೆಚ್ಚು ಓದಿ →",
  bn:"আরও পড়ুন →",   mr:"अधिक वाचा →",  gu:"વધુ વાંચો →",
  pa:"ਹੋਰ ਪੜ੍ਹੋ →",
};

const LIVE_NEWS_LABEL = {
  en:"📰 Live News", hi:"📰 ताज़ा समाचार", ml:"📰 തത്സമയ വാർത്ത",
  ta:"📰 நேரடி செய்தி", te:"📰 లైవ్ వార్తలు",
};

const SCHEMES_LABEL = {
  en:"📋 Key Schemes", hi:"📋 मुख्य योजनाएं", ml:"📋 പ്രധാന പദ്ധതികൾ",
  ta:"📋 முக்கிய திட்டங்கள்", te:"📋 ముఖ్య పథకాలు",
};

// ── TAG COLORS ────────────────────────────────────────────────────────────────
const TAG_COLORS = {
  "Govt":     { bg:"#eaf3de", color:"#3b6d11" },
  "Rural":    { bg:"#fff3cd", color:"#856404" },
  "Kisan":    { bg:"#d1ecf1", color:"#0c5460" },
  "PM-KISAN": { bg:"#d4edda", color:"#155724" },
  "Insurance":{ bg:"#f8d7da", color:"#721c24" },
  "Irrigation":{ bg:"#cce5ff", color:"#004085" },
  "Market":   { bg:"#e2d9f3", color:"#4a1d96" },
  "Soil":     { bg:"#fde8d8", color:"#7c3d12" },
  "Credit":   { bg:"#d6f5e3", color:"#14532d" },
};
const getTagStyle = (tag) => TAG_COLORS[tag] || { bg:"#eaf3de", color:"#3b6d11" };

// ─────────────────────────────────────────────────────────────────────────────
export default function SchemeFeed() {
  const { lang } = useLanguage();

  const [liveNews,      setLiveNews]      = useState([]);
  const [staticSchemes, setStaticSchemes] = useState(STATIC_SCHEMES);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [activeTab,     setActiveTab]     = useState("schemes"); // "schemes" | "news"
  const [notifications, setNotifications] = useState([]);
  const [showNotif,     setShowNotif]     = useState(false);
  const [seenIds,       setSeenIds]       = useState(() => {
    try { return JSON.parse(localStorage.getItem("seen_scheme_ids_v3") || "[]"); }
    catch { return []; }
  });

  // ── Fetch live RSS news ─────────────────────────────────────────────────────
  const fetchLiveNews = useCallback(async (forceFresh = false) => {
    setLoading(true);
    setError("");

    // Check cache
    if (!forceFresh) {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
        if (cached.lang === lang && cached.ts && Date.now() - cached.ts < CACHE_TTL) {
          setLiveNews(cached.news || []);
          setStaticSchemes(cached.schemes || STATIC_SCHEMES);
          setNotifications((cached.news || []).filter(s => !seenIds.includes(s.id)));
          setLoading(false);
          return;
        }
      } catch {}
    }

    // Fetch RSS
    const results = await Promise.allSettled(
      RSS_SOURCES.map(src =>
        fetch(src.url, { signal: AbortSignal.timeout(8000) })
          .then(r => r.json())
          .then(data => ({ ...data, tag: src.tag, sourceName: src.name }))
      )
    );

    const rawItems = [];
    results.forEach(r => {
      if (r.status === "fulfilled" && r.value?.items?.length) {
        r.value.items.slice(0, 5).forEach(item => {
          const desc = (item.description || "")
            .replace(/<[^>]*>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .trim()
            .slice(0, 200);

          rawItems.push({
            id:          item.guid || item.link || item.title || Math.random().toString(),
            title:       (item.title || "").trim(),
            description: desc,
            link:        item.link || "#",
            pubDate:     item.pubDate ? new Date(item.pubDate).toLocaleDateString("en-IN") : "",
            tag:         r.value.tag,
            source:      r.value.sourceName,
          });
        });
      }
    });

    // Deduplicate
    const seen = new Set();
    const unique = rawItems.filter(item => {
      if (!item.title || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

    // Translate live news
    const translatedNews    = await translateBatch(unique,         lang);
    const translatedSchemes = await translateBatch(STATIC_SCHEMES, lang);

    // Cache
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        lang, ts: Date.now(),
        news:    translatedNews,
        schemes: translatedSchemes,
      }));
    } catch {}

    setLiveNews(translatedNews);
    setStaticSchemes(translatedSchemes);
    setNotifications(translatedNews.filter(s => !seenIds.includes(s.id)));
    setLoading(false);
  }, [lang, seenIds]);

  // Re-fetch when language changes
  useEffect(() => {
    try { localStorage.removeItem(CACHE_KEY); } catch {}
    fetchLiveNews(true);
  }, [lang]); // eslint-disable-line

  const markAllSeen = () => {
    const ids = [...seenIds, ...notifications.map(n => n.id)];
    setSeenIds(ids);
    try { localStorage.setItem("seen_scheme_ids_v3", JSON.stringify(ids)); } catch {}
    setNotifications([]);
    setShowNotif(false);
  };

  const displayItems = activeTab === "news" ? liveNews : staticSchemes;
  const unreadCount  = notifications.length;

  return (
    <div style={S.wrap}>

      {/* ── Header ── */}
      <div style={S.header}>
        <div>
          <div style={S.eyebrow}>LIVE FEED</div>
          <h2 style={S.title}>{SECTION_TITLE[lang] || SECTION_TITLE.en}</h2>
        </div>

        {/* Bell */}
        <div style={{ position:"relative" }}>
          <button style={S.bell} onClick={() => setShowNotif(v => !v)}>
            🔔
            {unreadCount > 0 && (
              <span style={S.badge}>{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </button>

          {showNotif && (
            <div style={S.notifPanel}>
              <div style={S.notifHeader}>
                <span style={{ fontWeight:700, fontSize:13, color:"#173404" }}>
                  {unreadCount > 0
                    ? `${unreadCount} new update${unreadCount > 1 ? "s" : ""}`
                    : "All caught up ✓"}
                </span>
                {unreadCount > 0 && (
                  <button style={S.markBtn} onClick={markAllSeen}>Mark all read</button>
                )}
              </div>
              {notifications.slice(0, 5).map(n => (
                <div key={n.id} style={S.notifItem}>
                  <span style={{ ...S.tagPill, ...getTagStyle(n.tag) }}>{n.tag}</span>
                  <p style={S.notifTitle}>{n.title}</p>
                  <span style={S.notifDate}>{n.pubDate}</span>
                </div>
              ))}
              {unreadCount === 0 && (
                <p style={{ color:"#888", fontSize:12, textAlign:"center", paddingTop:8 }}>
                  No new updates right now.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs + Refresh ── */}
      <div style={S.toolbar}>
        <div style={S.tabs}>
          <button
            style={{ ...S.tab, ...(activeTab === "schemes" ? S.tabActive : {}) }}
            onClick={() => setActiveTab("schemes")}
          >
            {SCHEMES_LABEL[lang] || SCHEMES_LABEL.en}
          </button>
          <button
            style={{ ...S.tab, ...(activeTab === "news" ? S.tabActive : {}) }}
            onClick={() => setActiveTab("news")}
          >
            {LIVE_NEWS_LABEL[lang] || LIVE_NEWS_LABEL.en}
            {unreadCount > 0 && activeTab !== "news" && (
              <span style={S.tabBadge}>{unreadCount}</span>
            )}
          </button>
        </div>
        <button style={S.refreshBtn} onClick={() => fetchLiveNews(true)} disabled={loading}>
          {loading ? "⟳ Loading..." : "⟳ Refresh"}
        </button>
      </div>

      {error && <div style={S.error}>{error}</div>}

      {/* ── Content ── */}
      {loading ? (
        <div style={S.loadingWrap}>
          {[1,2,3].map(i => <div key={i} style={S.skeleton} />)}
        </div>
      ) : displayItems.length === 0 ? (
        <div style={S.empty}>
          {activeTab === "news"
            ? "No live news right now. Try refreshing."
            : "No schemes available."}
        </div>
      ) : (
        <div style={S.grid}>
          {displayItems.map(item => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={S.card}
              onMouseEnter={e => {
                e.currentTarget.style.transform   = "translateY(-4px)";
                e.currentTarget.style.boxShadow   = "0 10px 32px rgba(99,153,34,0.18)";
                e.currentTarget.style.borderColor = "#97c459";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform   = "translateY(0)";
                e.currentTarget.style.boxShadow   = "0 2px 12px rgba(99,153,34,0.07)";
                e.currentTarget.style.borderColor = "#c0dd97";
              }}
            >
              <div style={S.cardTop}>
                <span style={{ ...S.tagPill, ...getTagStyle(item.tag) }}>{item.tag}</span>
                <span style={S.source}>{item.source}</span>
              </div>
              <h3 style={S.cardTitle}>{item.title}</h3>
              {item.description && (
                <p style={S.cardDesc}>{item.description}{item.description.length >= 195 ? "…" : ""}</p>
              )}
              <div style={S.cardFoot}>
                <span style={S.date}>{item.pubDate}</span>
                <span style={S.readMore}>{READ_MORE[lang] || READ_MORE.en}</span>
              </div>

              {/* Static scheme badge */}
              {item.isStatic && (
                <div style={S.officialBadge}>✅ Official Scheme</div>
              )}
            </a>
          ))}
        </div>
      )}

      <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  wrap:        { padding:"40px 24px 60px", maxWidth:1100, margin:"0 auto", fontFamily:"'DM Sans',sans-serif" },
  header:      { display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 },
  eyebrow:     { fontSize:10, fontWeight:700, letterSpacing:3, textTransform:"uppercase", color:"#3b6d11", marginBottom:6 },
  title:       { fontSize:"clamp(1.5rem,3vw,2rem)", fontWeight:700, color:"#173404", margin:0 },
  bell:        { background:"none", border:"1px solid #c0dd97", borderRadius:10, width:42, height:42, fontSize:18, cursor:"pointer", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" },
  badge:       { position:"absolute", top:-6, right:-6, background:"#e53935", color:"#fff", borderRadius:"50%", width:18, height:18, fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff" },
  notifPanel:  { position:"absolute", top:50, right:0, width:300, background:"#fff", border:"1px solid #c0dd97", borderRadius:14, boxShadow:"0 16px 48px rgba(0,0,0,0.12)", zIndex:9999, padding:16 },
  notifHeader: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, paddingBottom:10, borderBottom:"1px solid #eaf3de" },
  markBtn:     { background:"#eaf3de", border:"none", borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:600, color:"#3b6d11", cursor:"pointer" },
  notifItem:   { padding:"10px 0", borderBottom:"1px solid #f0f0f0" },
  notifTitle:  { fontSize:12, color:"#173404", fontWeight:600, margin:"4px 0 2px", lineHeight:1.4 },
  notifDate:   { fontSize:10, color:"#888" },

  toolbar:     { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:10 },
  tabs:        { display:"flex", gap:6 },
  tab:         { padding:"8px 18px", borderRadius:10, border:"1px solid #c0dd97", background:"#fff", color:"#5f5e5a", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", position:"relative" },
  tabActive:   { background:"#eaf3de", color:"#27500a", fontWeight:700, borderColor:"#97c459" },
  tabBadge:    { position:"absolute", top:-6, right:-6, background:"#e53935", color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:8, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" },
  refreshBtn:  { padding:"8px 18px", background:"#eaf3de", border:"1px solid #97c459", borderRadius:10, color:"#27500a", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" },

  error:       { background:"#fff3cd", border:"1px solid #ffc107", borderRadius:10, padding:"10px 16px", marginBottom:20, color:"#856404", fontSize:13 },
  empty:       { textAlign:"center", padding:"40px 0", color:"#888", fontSize:14 },
  loadingWrap: { display:"flex", flexDirection:"column", gap:16 },
  skeleton:    { height:160, borderRadius:14, background:"linear-gradient(90deg,#eaf3de 25%,#d4e8c0 50%,#eaf3de 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite" },
  grid:        { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:20 },

  card:        { background:"#fff", border:"1px solid #c0dd97", borderRadius:14, padding:20, textDecoration:"none", display:"flex", flexDirection:"column", gap:10, transition:"transform 0.2s, box-shadow 0.2s, border-color 0.2s", boxShadow:"0 2px 12px rgba(99,153,34,0.07)", position:"relative" },
  cardTop:     { display:"flex", alignItems:"center", justifyContent:"space-between" },
  tagPill:     { fontSize:9, fontWeight:700, letterSpacing:1, textTransform:"uppercase", padding:"3px 9px", borderRadius:5 },
  source:      { fontSize:10, color:"#888" },
  cardTitle:   { fontSize:14, fontWeight:700, color:"#173404", margin:0, lineHeight:1.45 },
  cardDesc:    { fontSize:13, color:"#5f5e5a", margin:0, lineHeight:1.65, flex:1 },
  cardFoot:    { display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:4 },
  date:        { fontSize:11, color:"#888" },
  readMore:    { fontSize:12, fontWeight:700, color:"#3b6d11" },
  officialBadge: { fontSize:10, color:"#27500a", background:"#eaf3de", borderRadius:6, padding:"3px 8px", alignSelf:"flex-start", marginTop:2 },
};