// src/components/WeatherCornerWidget/WeatherCornerWidget.jsx
// Floating bottom-left weather widget — shows current device location weather
// Only shown on non-dashboard pages

import React, { useState, useEffect, useRef } from "react";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || "d7a2c44cdd3c9b8ff2cf7c373936dd67";

const WEATHER_LABELS = {
  en: { title:"Weather", feels:"Feels", humidity:"Humidity", wind:"Wind", loading:"Locating...", denied:"Location access denied", error:"Weather unavailable" },
  hi: { title:"मौसम",   feels:"महसूस", humidity:"आर्द्रता",  wind:"हवा",  loading:"स्थान खोज रहे हैं...", denied:"स्थान अनुमति नहीं", error:"मौसम उपलब्ध नहीं" },
  ml: { title:"കാലാവസ്ഥ", feels:"അനുഭവം", humidity:"ആർദ്രത",  wind:"കാറ്റ്", loading:"സ്ഥലം കണ്ടെത്തുന്നു...", denied:"ലൊക്കേഷൻ ആക്സസ് നിഷേധിച്ചു", error:"കാലാവസ്ഥ ലഭ്യമല്ല" },
  ta: { title:"வானிலை", feels:"உணர்வு", humidity:"ஈரப்பதம்", wind:"காற்று", loading:"இடம் கண்டறிகிறது...", denied:"இட அணுகல் மறுக்கப்பட்டது", error:"வானிலை கிடைக்கவில்லை" },
  te: { title:"వాతావరణం", feels:"అనుభవం", humidity:"తేమ",    wind:"గాలి", loading:"స్థానం కనుగొంటున్నారు...", denied:"లొకేషన్ యాక్సెస్ నిరాకరించబడింది", error:"వాతావరణం అందుబాటులో లేదు" },
  kn: { title:"ಹವಾಮಾನ", feels:"ಅನುಭವ", humidity:"ತೇವಾಂಶ",   wind:"ಗಾಳಿ", loading:"ಸ್ಥಳ ಹುಡುಕುತ್ತಿದೆ...", denied:"ಸ್ಥಳ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ", error:"ಹವಾಮಾನ ಲಭ್ಯವಿಲ್ಲ" },
  bn: { title:"আবহাওয়া", feels:"অনুভব", humidity:"আর্দ্রতা", wind:"বায়ু", loading:"অবস্থান খুঁজছে...", denied:"অবস্থান অ্যাক্সেস অস্বীকৃত", error:"আবহাওয়া পাওয়া যাচ্ছে না" },
  mr: { title:"हवामान",  feels:"जाणवते", humidity:"आर्द्रता", wind:"वारा", loading:"स्थान शोधत आहे...", denied:"स्थान प्रवेश नाकारला", error:"हवामान उपलब्ध नाही" },
  gu: { title:"હવામાન",  feels:"લાગે",   humidity:"ભેજ",      wind:"પવન", loading:"સ્થાન શોધી રહ્યું છે...", denied:"સ્થાન ઍક્સેસ નકારી", error:"હવામાન ઉપલબ્ધ નથી" },
  pa: { title:"ਮੌਸਮ",    feels:"ਮਹਿਸੂਸ", humidity:"ਨਮੀ",     wind:"ਹਵਾ", loading:"ਟਿਕਾਣਾ ਲੱਭ ਰਿਹਾ ਹੈ...", denied:"ਟਿਕਾਣਾ ਪਹੁੰਚ ਤੋਂ ਇਨਕਾਰ", error:"ਮੌਸਮ ਉਪਲਬਧ ਨਹੀਂ" },
};

const getLabel = (lang, key) => (WEATHER_LABELS[lang] || WEATHER_LABELS.en)[key];

export default function WeatherCornerWidget({ lang = "en" }) {
  const [weather,   setWeather]   = useState(null);
  const [status,    setStatus]    = useState("idle"); // idle | locating | loading | ready | denied | error
  const [expanded,  setExpanded]  = useState(false);
  const [coords,    setCoords]    = useState(null);
  const intervalRef = useRef(null);

  // ── Fetch weather by coords ─────────────────────────────────────────────────
  const fetchWeather = async (lat, lon) => {
    setStatus("loading");
    try {
      const res  = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (!res.ok || !data.main) { setStatus("error"); return; }

      setWeather({
        city:      data.name,
        country:   data.sys?.country || "",
        temp:      Math.round(data.main.temp),
        feels:     Math.round(data.main.feels_like),
        humidity:  data.main.humidity,
        wind:      data.wind?.speed ? (data.wind.speed * 3.6).toFixed(1) : "0",
        condition: data.weather?.[0]?.description || "",
        icon:      data.weather?.[0]?.icon || "",
        rain:      data.rain?.["1h"] ?? data.rain?.["3h"] ?? 0,
        main:      data.weather?.[0]?.main || "",
      });
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  };

  // ── Get current location ────────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) { setStatus("error"); return; }

    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setCoords({ lat, lon });
        fetchWeather(lat, lon);
      },
      () => setStatus("denied"),
      { timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  // ── Refresh every 10 min ────────────────────────────────────────────────────
  useEffect(() => {
    if (!coords) return;
    intervalRef.current = setInterval(() => fetchWeather(coords.lat, coords.lon), 10 * 60 * 1000);
    return () => clearInterval(intervalRef.current);
  }, [coords]);

  // ── Weather icon emoji ──────────────────────────────────────────────────────
  const getEmoji = (main = "", rain = 0) => {
    if (rain > 0 || /rain/i.test(main))    return "🌧";
    if (/thunder/i.test(main))             return "⛈";
    if (/drizzle/i.test(main))             return "🌦";
    if (/snow/i.test(main))                return "❄️";
    if (/mist|fog|haze/i.test(main))       return "🌫";
    if (/cloud/i.test(main))               return "☁️";
    if (/clear/i.test(main))               return "☀️";
    return "🌤";
  };

  const willRain = weather && (weather.rain > 0 || /rain|drizzle|thunder/i.test(weather.condition));

  // ── Collapsed pill ──────────────────────────────────────────────────────────
  const renderPill = () => {
    if (status === "locating" || status === "loading") {
      return (
        <div style={S.pill} onClick={() => setExpanded(true)}>
          <span style={S.pillEmoji}>🌐</span>
          <span style={S.pillText}>{getLabel(lang, "loading")}</span>
        </div>
      );
    }
    if (status === "denied") {
      return (
        <div style={S.pill} onClick={() => setExpanded(true)}>
          <span style={S.pillEmoji}>📍</span>
          <span style={S.pillText}>{getLabel(lang, "denied")}</span>
        </div>
      );
    }
    if (status === "error" || !weather) {
      return (
        <div style={S.pill} onClick={() => setExpanded(true)}>
          <span style={S.pillEmoji}>⚠️</span>
          <span style={S.pillText}>{getLabel(lang, "error")}</span>
        </div>
      );
    }
    return (
      <div style={S.pill} onClick={() => setExpanded(true)}>
        <span style={S.pillEmoji}>{getEmoji(weather.main, weather.rain)}</span>
        <span style={S.pillTemp}>{weather.temp}°C</span>
        <span style={S.pillCity}>{weather.city}</span>
      </div>
    );
  };

  // ── Expanded card ───────────────────────────────────────────────────────────
  const renderCard = () => (
    <div style={S.card}>
      {/* Header */}
      <div style={S.cardHead}>
        <div>
          <div style={S.cardEyebrow}>{getLabel(lang, "title")}</div>
          <div style={S.cardCity}>{weather?.city}{weather?.country ? `, ${weather.country}` : ""}</div>
        </div>
        <button style={S.closeBtn} onClick={() => setExpanded(false)}>✕</button>
      </div>

      {/* Main temp */}
      {weather && (
        <>
          <div style={S.mainRow}>
            <div style={S.tempBig}>{getEmoji(weather.main, weather.rain)} {weather.temp}°C</div>
            <div style={S.condText}>{weather.condition}</div>
          </div>

          {/* Stats grid */}
          <div style={S.statsGrid}>
            <div style={S.statItem}>
              <span style={S.statIcon}>🌡</span>
              <span style={S.statVal}>{weather.feels}°C</span>
              <span style={S.statLbl}>{getLabel(lang, "feels")}</span>
            </div>
            <div style={S.statItem}>
              <span style={S.statIcon}>💧</span>
              <span style={S.statVal}>{weather.humidity}%</span>
              <span style={S.statLbl}>{getLabel(lang, "humidity")}</span>
            </div>
            <div style={S.statItem}>
              <span style={S.statIcon}>🌬</span>
              <span style={S.statVal}>{weather.wind} km/h</span>
              <span style={S.statLbl}>{getLabel(lang, "wind")}</span>
            </div>
          </div>

          {/* Alert */}
          <div style={{ ...S.alert, ...(willRain ? S.alertRain : S.alertOk) }}>
            {willRain
              ? "🌧 Rain expected — avoid spraying crops"
              : "☀️ Clear skies — good day for field work"}
          </div>
        </>
      )}

      {(status === "locating" || status === "loading") && (
        <div style={S.loadingRow}>
          <div style={S.spinner} />
          <span style={S.loadingTxt}>{getLabel(lang, "loading")}</span>
        </div>
      )}

      {status === "denied" && (
        <div style={S.errTxt}>{getLabel(lang, "denied")}</div>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes wcw-spin { to { transform: rotate(360deg); } }
        @keyframes wcw-fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes wcw-pulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.04)} }
        .wcw-pill-hover:hover { transform: scale(1.04) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.25) !important; }
      `}</style>

      <div style={S.container}>
        {expanded ? renderCard() : (
          <div className="wcw-pill-hover" style={{ transition:"transform 0.2s, box-shadow 0.2s" }}>
            {renderPill()}
          </div>
        )}
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  container: {
    position:    "fixed",
    bottom:      24,
    left:        24,
    zIndex:      9990,
    fontFamily:  "'DM Sans', sans-serif",
  },

  // ── Collapsed pill ──
  pill: {
    display:       "flex",
    alignItems:    "center",
    gap:           8,
    background:    "rgba(10,20,12,0.88)",
    backdropFilter:"blur(12px)",
    border:        "1px solid rgba(76,175,101,0.35)",
    borderRadius:  40,
    padding:       "10px 18px",
    cursor:        "pointer",
    boxShadow:     "0 4px 20px rgba(0,0,0,0.3)",
    color:         "#f0e8d5",
    userSelect:    "none",
  },
  pillEmoji: { fontSize:18 },
  pillTemp:  { fontSize:16, fontWeight:700, color:"#7dd99a", letterSpacing:"-0.5px" },
  pillCity:  { fontSize:12, color:"rgba(240,232,213,0.55)", maxWidth:90, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },

  // ── Expanded card ──
  card: {
    width:         260,
    background:    "rgba(8,18,10,0.96)",
    backdropFilter:"blur(16px)",
    border:        "1px solid rgba(76,175,101,0.25)",
    borderRadius:  18,
    padding:       "18px 16px",
    boxShadow:     "0 16px 48px rgba(0,0,0,0.45)",
    color:         "#f0e8d5",
    animation:     "wcw-fadeIn 0.25s ease",
  },
  cardHead: {
    display:        "flex",
    alignItems:     "flex-start",
    justifyContent: "space-between",
    marginBottom:   14,
  },
  cardEyebrow: {
    fontSize:      9,
    fontWeight:    700,
    letterSpacing: 2,
    textTransform: "uppercase",
    color:         "rgba(240,232,213,0.35)",
    marginBottom:  3,
  },
  cardCity: { fontSize:15, fontWeight:700, color:"#f0e8d5" },
  closeBtn: {
    background: "rgba(255,255,255,0.07)",
    border:     "none",
    borderRadius:8,
    color:      "rgba(240,232,213,0.5)",
    width:      26,
    height:     26,
    cursor:     "pointer",
    fontSize:   12,
    display:    "flex",
    alignItems: "center",
    justifyContent:"center",
    flexShrink: 0,
  },

  mainRow: { marginBottom:14 },
  tempBig: { fontSize:28, fontWeight:700, color:"#7dd99a", lineHeight:1.1 },
  condText:{ fontSize:12, color:"rgba(240,232,213,0.45)", textTransform:"capitalize", marginTop:3 },

  statsGrid: {
    display:             "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap:                 6,
    marginBottom:        12,
  },
  statItem: {
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    gap:            2,
    background:     "rgba(255,255,255,0.04)",
    borderRadius:   9,
    padding:        "8px 4px",
  },
  statIcon: { fontSize:14 },
  statVal:  { fontSize:12, fontWeight:700, color:"#f0e8d5" },
  statLbl:  { fontSize:9, color:"rgba(240,232,213,0.35)", textAlign:"center" },

  alert:     { borderRadius:8, padding:"8px 10px", fontSize:11, fontWeight:600, lineHeight:1.4 },
  alertRain: { background:"rgba(96,165,250,0.12)", border:"1px solid rgba(96,165,250,0.2)", color:"#93c5fd" },
  alertOk:   { background:"rgba(76,175,101,0.1)",  border:"1px solid rgba(76,175,101,0.2)",  color:"#7dd99a" },

  loadingRow: { display:"flex", alignItems:"center", gap:10, padding:"8px 0" },
  spinner:    { width:16, height:16, border:"2px solid rgba(76,175,101,0.2)", borderTopColor:"#4caf65", borderRadius:"50%", animation:"wcw-spin 0.8s linear infinite" },
  loadingTxt: { fontSize:12, color:"rgba(240,232,213,0.4)" },
  errTxt:     { fontSize:12, color:"#f87171", padding:"8px 0" },
};