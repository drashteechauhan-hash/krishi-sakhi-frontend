import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { useLanguage } from "../../context/LanguageContext";

import leftImg  from "../../assets/leftImage.jpg";
import rightImg from "../../assets/rightImage.jpg";

const API_KEY_WEATHER = process.env.REACT_APP_WEATHER_API_KEY || "d7a2c44cdd3c9b8ff2cf7c373936dd67";
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CROP_COLORS = ["#4caf65","#c47f1a","#60a5fa","#f472b6","#a78bfa","#34d399","#fbbf24","#f87171"];

const TEXT = {
  en: {
    welcome: "Welcome back 🌿",
    profiles: "Profiles",
    totalLand: "Total Land",
    crops: "Crops",
    tabOverview: "📊 Overview",
    tabProfiles: "👤 All Profiles",
    tabAnalytics: "📈 Analytics",
    loading: "Loading profiles…",
    locked: "Access Restricted",
    lockedSub: "Please log in to view your farming dashboard",
    latestBadge: "✦ Latest Profile",
    cropLabel: "Crop",
    landLabel: "Land",
    soilLabel: "Soil",
    waterLabel: "Water",
    weatherTag: "🌤 Live Weather",
    weatherTitle: "Conditions",
    fetchingWeather: "Fetching weather…",
    feels: "Feels",
    rain: "Rain",
    humidity: "Humidity",
    wind: "Wind",
    rainAlert: "🌧 Rain expected — avoid pesticide spraying",
    clearAlert: "☀️ Clear skies — good for field work",
    marketTag: "📈 Market Price",
    marketTitle: "Current Rates",
    fetchingMarket: "Fetching prices…",
    perQuintal: "/ quintal",
    trendLabel: "Est. Price Trend",
    noPrice: "No price data for",
    landTag: "🌾 Land Holdings",
    landTitle: "Acres per Profile",
    soilTag: "🪨 Soil Distribution",
    soilTitle: "Soil Types Used",
    profilesTag: "👤 Farmer Profiles",
    profilesTitle: "All Profiles",
    noProfiles: "No profiles yet.",
    addFirst: "Add your first profile →",
    tableHeaders: ["#", "Name", "Location", "Crop", "Land (ac)", "Soil", "Irrigation"],
    profileHistTag: "📋 Profile History",
    profileHistTitle: "All Submitted Profiles",
    analyticsLandTag: "🌾 Land Over Time",
    analyticsLandTitle: "Land Holdings by Profile",
    analyticsSoilTag: "🪨 Soil Analysis",
    analyticsSoilTitle: "Soil Type Breakdown",
    analyticsCropTag: "🌱 Crop Diversity",
    analyticsCropTitle: "Crops Across Profiles",
    noData: "No data yet",
    noCrop: "No crop data",
    acresSuffix: " ac",
    pillLabels: ["Total Profiles", "Total Land", "Crops Grown", "Soil Types"],
  },
  hi: {
    welcome: "वापसी पर स्वागत है 🌿",
    profiles: "प्रोफाइल",
    totalLand: "कुल ज़मीन",
    crops: "फसलें",
    tabOverview: "📊 अवलोकन",
    tabProfiles: "👤 सभी प्रोफाइल",
    tabAnalytics: "📈 विश्लेषण",
    loading: "प्रोफाइल लोड हो रहे हैं…",
    locked: "पहुंच प्रतिबंधित",
    lockedSub: "अपना डैशबोर्ड देखने के लिए लॉगिन करें",
    latestBadge: "✦ नवीनतम प्रोफाइल",
    cropLabel: "फसल",
    landLabel: "ज़मीन",
    soilLabel: "मिट्टी",
    waterLabel: "सिंचाई",
    weatherTag: "🌤 लाइव मौसम",
    weatherTitle: "वर्तमान स्थिति",
    fetchingWeather: "मौसम डेटा आ रहा है…",
    feels: "महसूस",
    rain: "बारिश",
    humidity: "नमी",
    wind: "हवा",
    rainAlert: "🌧 बारिश की संभावना — कीटनाशक न छिड़कें",
    clearAlert: "☀️ साफ आसमान — खेती के लिए अच्छा",
    marketTag: "📈 बाज़ार मूल्य",
    marketTitle: "वर्तमान दरें",
    fetchingMarket: "मूल्य डेटा आ रहा है…",
    perQuintal: "/ क्विंटल",
    trendLabel: "अनुमानित मूल्य प्रवृत्ति",
    noPrice: "कोई मूल्य डेटा नहीं",
    landTag: "🌾 भूमि जोत",
    landTitle: "प्रोफाइल अनुसार एकड़",
    soilTag: "🪨 मिट्टी वितरण",
    soilTitle: "उपयोग किए गए मिट्टी प्रकार",
    profilesTag: "👤 किसान प्रोफाइल",
    profilesTitle: "सभी प्रोफाइल",
    noProfiles: "अभी तक कोई प्रोफाइल नहीं।",
    addFirst: "पहली प्रोफाइल जोड़ें →",
    tableHeaders: ["#", "नाम", "स्थान", "फसल", "ज़मीन (एकड़)", "मिट्टी", "सिंचाई"],
    profileHistTag: "📋 प्रोफाइल इतिहास",
    profileHistTitle: "सभी सबमिट की गई प्रोफाइल",
    analyticsLandTag: "🌾 समय के साथ भूमि",
    analyticsLandTitle: "प्रोफाइल अनुसार भूमि जोत",
    analyticsSoilTag: "🪨 मिट्टी विश्लेषण",
    analyticsSoilTitle: "मिट्टी के प्रकार",
    analyticsCropTag: "🌱 फसल विविधता",
    analyticsCropTitle: "सभी प्रोफाइल में फसलें",
    noData: "अभी कोई डेटा नहीं",
    noCrop: "फसल डेटा नहीं",
    acresSuffix: " एकड़",
    pillLabels: ["कुल प्रोफाइल", "कुल ज़मीन", "उगाई गई फसलें", "मिट्टी के प्रकार"],
  },
  ml: {
    welcome: "തിരിച്ചു സ്വാഗതം 🌿",
    profiles: "പ്രൊഫൈലുകൾ",
    totalLand: "മൊത്തം ഭൂമി",
    crops: "വിളകൾ",
    tabOverview: "📊 അവലോകനം",
    tabProfiles: "👤 എല്ലാ പ്രൊഫൈലുകൾ",
    tabAnalytics: "📈 വിശകലനം",
    loading: "പ്രൊഫൈലുകൾ ലോഡ് ചെയ്യുന്നു…",
    locked: "പ്രവേശനം നിയന്ത്രിതം",
    lockedSub: "ഡാഷ്ബോർഡ് കാണാൻ ലോഗിൻ ചെയ്യൂ",
    latestBadge: "✦ ഏറ്റവും പുതിയ പ്രൊഫൈൽ",
    cropLabel: "വിള",
    landLabel: "ഭൂമി",
    soilLabel: "മണ്ണ്",
    waterLabel: "ജലസേചനം",
    weatherTag: "🌤 തത്സമയ കാലാവസ്ഥ",
    weatherTitle: "ഇപ്പോഴത്തെ സ്ഥിതി",
    fetchingWeather: "കാലാവസ്ഥ ലഭ്യമാക്കുന്നു…",
    feels: "അനുഭവം",
    rain: "മഴ",
    humidity: "ആർദ്രത",
    wind: "കാറ്റ്",
    rainAlert: "🌧 മഴ പ്രതീക്ഷിക്കുന്നു — കീടനാശിനി തളിക്കരുത്",
    clearAlert: "☀️ തെളിഞ്ഞ ആകാശം — ജോലിക്ക് അനുകൂലം",
    marketTag: "📈 വിപണി വില",
    marketTitle: "നിലവിലെ നിരക്ക്",
    fetchingMarket: "വില ലഭ്യമാക്കുന്നു…",
    perQuintal: "/ ക്വിന്റൽ",
    trendLabel: "ഏകദേശ വില ട്രെൻഡ്",
    noPrice: "വില ഡേറ്റ ലഭ്യമല്ല",
    landTag: "🌾 ഭൂമി ഉടമസ്ഥത",
    landTitle: "പ്രൊഫൈൽ അനുസരിച്ച് ഏക്കർ",
    soilTag: "🪨 മണ്ണ് വിതരണം",
    soilTitle: "ഉപയോഗിക്കുന്ന മണ്ണ് തരങ്ങൾ",
    profilesTag: "👤 കർഷക പ്രൊഫൈലുകൾ",
    profilesTitle: "എല്ലാ പ്രൊഫൈലുകൾ",
    noProfiles: "ഇതുവരെ പ്രൊഫൈൽ ഇല്ല.",
    addFirst: "ആദ്യ പ്രൊഫൈൽ ചേർക്കൂ →",
    tableHeaders: ["#", "പേര്", "സ്ഥലം", "വിള", "ഭൂമി (ഏ)", "മണ്ണ്", "ജലസേചനം"],
    profileHistTag: "📋 പ്രൊഫൈൽ ചരിത്രം",
    profileHistTitle: "സമർപ്പിച്ച എല്ലാ പ്രൊഫൈലുകൾ",
    analyticsLandTag: "🌾 ഭൂമി കാലക്രമം",
    analyticsLandTitle: "പ്രൊഫൈൽ തിരിച്ച് ഭൂമി",
    analyticsSoilTag: "🪨 മണ്ണ് വിശകലനം",
    analyticsSoilTitle: "മണ്ണ് തരം ബ്രേക്ക്ഡൗൺ",
    analyticsCropTag: "🌱 വിള വൈവിധ്യം",
    analyticsCropTitle: "പ്രൊഫൈലുകളിൽ വിളകൾ",
    noData: "ഇതുവരെ ഡേറ്റ ഇല്ല",
    noCrop: "വിള ഡേറ്റ ഇല്ല",
    acresSuffix: " ഏ",
    pillLabels: ["മൊത്തം പ്രൊഫൈൽ", "മൊത്തം ഭൂമി", "ഉൽപ്പാദിപ്പിക്കുന്ന വിളകൾ", "മണ്ണ് തരങ്ങൾ"],
  },
};

function AnimNum({ value, prefix = "", suffix = "", decimals = 0 }) {
  const [disp, setDisp] = useState(0);
  useEffect(() => {
    const end = parseFloat(value) || 0;
    if (end === 0) { setDisp(0); return; }
    let cur = 0;
    const step = end / 45;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= end) { setDisp(end); clearInterval(timer); }
      else setDisp(cur);
    }, 25);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{typeof disp === 'number' ? disp.toFixed(decimals) : disp}{suffix}</span>;
}

function WeatherPanel({ city, t }) {
  const [w, setW] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!city) return;
    setLoading(true); setErr(null);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY_WEATHER}&units=metric`)
      .then(r => r.json())
      .then(d => {
        if (!d.main) { setErr("City not found"); setLoading(false); return; }
        setW({
          city: d.name, cond: d.weather?.[0]?.description || "",
          icon: d.weather?.[0]?.icon || "", temp: Math.round(d.main.temp),
          feels: Math.round(d.main.feels_like), humidity: d.main.humidity,
          wind: d.wind?.speed ? (d.wind.speed * 3.6).toFixed(1) : "N/A",
          rain: d.rain?.["1h"] ?? d.rain?.["3h"] ?? 0,
        });
        setLoading(false);
      })
      .catch(() => { setErr("Network error"); setLoading(false); });
  }, [city]);

  const willRain = w && (w.rain > 0 || /rain|drizzle|thunder/i.test(w.cond));

  return (
    <div className="db-card">
      <div className="db-card-tag">{t.weatherTag}</div>
      <div className="db-card-title">{t.weatherTitle}</div>
      {loading && <div className="db-muted-text">{t.fetchingWeather}</div>}
      {err && <div className="db-err">{err}</div>}
      {w && !loading && (
        <>
          <div className="db-weather-top">
            {w.icon && <img src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`} alt={w.cond} className="db-wicon" />}
            <div>
              <div className="db-weather-temp"><AnimNum value={w.temp} suffix="°C" /></div>
              <div className="db-weather-loc">{w.city}</div>
              <div className="db-weather-cond">{w.cond}</div>
            </div>
          </div>
          <div className="db-weather-grid">
            {[["💧", w.humidity + "%", t.humidity], ["🌬", w.wind + " km/h", t.wind], ["🌡", w.feels + "°C", t.feels], ["🌧", w.rain + " mm", t.rain]].map(([ic, v, l]) => (
              <div key={l} className="db-wstat">
                <span className="db-wstat-ic">{ic}</span>
                <span className="db-wstat-v">{v}</span>
                <span className="db-wstat-l">{l}</span>
              </div>
            ))}
          </div>
          <div className={`db-weather-alert ${willRain ? "rain" : "ok"}`}>
            {willRain ? t.rainAlert : t.clearAlert}
          </div>
        </>
      )}
    </div>
  );
}

function MarketPanel({ crop, state, t }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!crop) return;
    setLoading(true);
    axios.get(`https://krishi-sakhi-backend-6.onrender.com/api/market/price?crop=${encodeURIComponent(crop)}&state=${encodeURIComponent(state || "Kerala")}`)
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [crop, state]);

  const trendData = data?.price
    ? MONTHS.slice(0, 9).map((m, i) => ({
        m, v: Math.round(parseFloat(data.price) * (0.82 + i * 0.025 + Math.random() * 0.08))
      }))
    : [];

  return (
    <div className="db-card">
      <div className="db-card-tag">{t.marketTag}</div>
      <div className="db-card-title">{t.marketTitle}</div>
      {loading && <div className="db-muted-text">{t.fetchingMarket}</div>}
      {!loading && data?.price && (
        <>
          <div className="db-market-crop">{data.crop || crop}</div>
          <div className="db-market-price">
            ₹ <AnimNum value={data.price} />
            <span className="db-market-unit"> {t.perQuintal}</span>
          </div>
          <div className="db-market-meta">
            {data.market && <span>📍 {data.market}</span>}
            {data.state && <span>🗺 {data.state}</span>}
          </div>
          <div className="db-trend-label">{t.trendLabel}</div>
          <ResponsiveContainer width="100%" height={90}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="mG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4caf65" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4caf65" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{fontSize:9,fill:"rgba(240,232,213,0.35)"}} axisLine={false} tickLine={false}/>
              <Area type="monotone" dataKey="v" stroke="#4caf65" fill="url(#mG)" strokeWidth={2} dot={false}/>
              <Tooltip contentStyle={{background:"#0c1a0e",border:"1px solid rgba(196,127,26,0.2)",borderRadius:"8px",fontSize:"11px",color:"#f0e8d5"}} formatter={v=>[`₹${v}`,""]}/>
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
      {!loading && !data?.price && (
        <div className="db-muted-text">{t.noPrice} <b style={{color:"var(--leaf)"}}>{crop || "—"}</b></div>
      )}
    </div>
  );
}

function ProfileCard({ profile, index, isLatest, t }) {
  const name = profile.name || "—";
  const location = profile.location || "—";
  const crop = profile.crop || "—";
  const landSize = profile.landSize ?? profile.landsize ?? "—";
  const soilType = profile.soilType || profile.soiltype || "N/A";
  const irrigationType = profile.irrigationType || profile.irrigationtype || "N/A";

  const fields = [
    ["📍", t.tableHeaders[2], location],
    ["🌱", t.cropLabel, crop],
    ["🌾", t.landLabel, landSize !== "—" ? `${landSize} ${t.acresSuffix.trim()}` : "—"],
    ["🪨", t.soilLabel, soilType],
    ["💧", t.waterLabel, irrigationType],
  ];

  return (
    <div className={`db-profile-card ${isLatest ? "latest" : ""}`} style={{animationDelay:`${index*0.08}s`}}>
      {isLatest && <div className="db-profile-badge">{t.latestBadge}</div>}
      <div className="db-profile-num">#{String(index + 1).padStart(2, "0")}</div>
      <div className="db-profile-name">{name}</div>
      <div className="db-profile-rows">
        {fields.map(([ic, lb, val]) => (
          <div className="db-profile-row" key={lb}>
            <span className="db-profile-ic">{ic}</span>
            <span className="db-profile-lb">{lb}</span>
            <span className="db-profile-val">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LandTrendChart({ profiles }) {
  const data = profiles.map((p, i) => ({
    n: `#${String(i+1).padStart(2,"0")}`,
    acres: parseFloat(p.landSize ?? p.landsize) || 0,
    crop: p.crop || "—",
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
        <XAxis dataKey="n" tick={{fontSize:11,fill:"rgba(240,232,213,0.4)"}} axisLine={false} tickLine={false}/>
        <YAxis tick={{fontSize:10,fill:"rgba(240,232,213,0.3)"}} axisLine={false} tickLine={false}/>
        <Tooltip contentStyle={{background:"#0c1a0e",border:"1px solid rgba(196,127,26,0.2)",borderRadius:"8px",color:"#f0e8d5",fontSize:"12px"}} formatter={(v,n,p) => [`${v} ac — ${p.payload.crop}`, ""]}/>
        <Bar dataKey="acres" radius={[6,6,0,0]}>
          {data.map((_, i) => <Cell key={i} fill={CROP_COLORS[i % CROP_COLORS.length]}/>)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function SoilBreakdown({ profiles }) {
  const counts = profiles.reduce((acc, p) => {
    const k = p.soilType || p.soiltype || "Unknown";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const entries = Object.entries(counts).sort((a,b) => b[1]-a[1]);
  const total = entries.reduce((s,[,v]) => s+v, 0);

  return (
    <div className="db-soil-list">
      {entries.map(([name, count], i) => (
        <div key={name} className="db-soil-row">
          <div className="db-soil-name">
            <span className="db-soil-dot" style={{background:CROP_COLORS[i % CROP_COLORS.length]}}/>
            {name}
          </div>
          <div className="db-soil-bar-wrap">
            <div className="db-soil-bar" style={{width:`${(count/total)*100}%`, background:CROP_COLORS[i % CROP_COLORS.length]}}/>
          </div>
          <span className="db-soil-pct">{Math.round((count/total)*100)}%</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { lang } = useLanguage();
  const t = TEXT[lang] || TEXT.en;

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imgLoaded, setImgLoaded] = useState({ l: false, r: false });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) { setIsLoggedIn(true); fetchProfiles(); }
    else { setIsLoggedIn(false); setLoading(false); }
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://krishi-sakhi-backend-6.onrender.com/api/farmers");
      const sorted = (res.data || []).sort((a, b) => (b.id || 0) - (a.id || 0));
      setProfiles(sorted);
    } catch (err) {
      console.error("Failed to fetch profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <style>{CSS}</style>
        <div className="db-locked">
          <div className="db-locked-ic">🔒</div>
          <h2 className="db-locked-t">{t.locked}</h2>
          <p className="db-locked-s">{t.lockedSub}</p>
        </div>
      </>
    );
  }

  const latest = profiles[0] || null;
  const farmerName = latest?.name || "Farmer";
  const farmerLocation = latest?.location || "";
  const totalAcres = profiles.reduce((s, p) => s + (parseFloat(p.landSize ?? p.landsize) || 0), 0);
  const uniqueCrops = [...new Set(profiles.map(p => p.crop).filter(Boolean))];
  const uniqueSoils = [...new Set(profiles.map(p => p.soilType || p.soiltype).filter(Boolean))];

  const pills = [
    { ic:"📋", val: profiles.length, color:"#4caf65" },
    { ic:"🌾", val: `${totalAcres.toFixed(1)}${t.acresSuffix}`, color:"#c47f1a", raw:true },
    { ic:"🌱", val: uniqueCrops.length, color:"#60a5fa" },
    { ic:"🪨", val: uniqueSoils.length, color:"#a78bfa" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="db-wrap">
        <div className="db-topbar">
          <div className="db-topbar-inner">
            <div>
              <div className="db-topbar-eye">{t.welcome}</div>
              <h1 className="db-topbar-title">{farmerName}'s Dashboard</h1>
              {farmerLocation && <div className="db-topbar-sub">📍 {farmerLocation}</div>}
            </div>
            <div className="db-topbar-stats">
              <div className="db-tstat">
                <div className="db-tstat-v"><AnimNum value={profiles.length} /></div>
                <div className="db-tstat-l">{t.profiles}</div>
              </div>
              <div className="db-tstat-div"/>
              <div className="db-tstat">
                <div className="db-tstat-v"><AnimNum value={totalAcres} suffix={t.acresSuffix} decimals={1} /></div>
                <div className="db-tstat-l">{t.totalLand}</div>
              </div>
              <div className="db-tstat-div"/>
              <div className="db-tstat">
                <div className="db-tstat-v"><AnimNum value={uniqueCrops.length} /></div>
                <div className="db-tstat-l">{t.crops}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="db-tabs-wrap">
          <div className="db-tabs">
            {["overview", "profiles", "analytics"].map((tab, i) => (
              <button key={tab} className={`db-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                {[t.tabOverview, t.tabProfiles, t.tabAnalytics][i]}
              </button>
            ))}
          </div>
        </div>

        <div className="db-body">
          {loading && (
            <div className="db-loading-full">
              <div className="db-spinner"/>
              <span>{t.loading}</span>
            </div>
          )}

          {!loading && activeTab === "overview" && (
            <>
              {latest && (
                <div className="db-hero-section">
                  <div className="db-hero-img-wrap">
                    <img src={leftImg} alt="farm" className="db-hero-img" onLoad={() => setImgLoaded(p => ({...p, l:true}))} style={{opacity: imgLoaded.l ? 1 : 0}}/>
                    <div className="db-hero-img-overlay"/>
                  </div>
                  <div className="db-hero-center">
                    <div className="db-hero-badge">{t.latestBadge}</div>
                    <div className="db-hero-name">{latest.name}</div>
                    <div className="db-hero-loc">📍 {latest.location}</div>
                    <div className="db-hero-fields">
                      {[
                        ["🌱", t.cropLabel, latest.crop],
                        ["🌾", t.landLabel, `${latest.landSize ?? latest.landsize ?? "—"}${t.acresSuffix}`],
                        ["🪨", t.soilLabel, latest.soilType || latest.soiltype || "N/A"],
                        ["💧", t.waterLabel, latest.irrigationType || latest.irrigationtype || "N/A"],
                      ].map(([ic, lb, val]) => (
                        <div key={lb} className="db-hero-field">
                          <span className="db-hero-field-ic">{ic}</span>
                          <div>
                            <div className="db-hero-field-lb">{lb}</div>
                            <div className="db-hero-field-val">{val}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="db-hero-img-wrap">
                    <img src={rightImg} alt="crops" className="db-hero-img right" onLoad={() => setImgLoaded(p => ({...p, r:true}))} style={{opacity: imgLoaded.r ? 1 : 0}}/>
                    <div className="db-hero-img-overlay"/>
                  </div>
                </div>
              )}

              <div className="db-pills-row">
                {pills.map(({ ic, val, color, raw }, i) => (
                  <div key={i} className="db-pill" style={{"--pill-c": color}}>
                    <div className="db-pill-ic" style={{background:`${color}18`,color}}>{ic}</div>
                    <div>
                      <div className="db-pill-v" style={{color}}>{raw ? val : <AnimNum value={val}/>}</div>
                      <div className="db-pill-l">{t.pillLabels[i]}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="db-two-col">
                <WeatherPanel city={latest?.location || "Delhi"} t={t} />
                <MarketPanel crop={latest?.crop} state={latest?.location} t={t} />
              </div>

              {profiles.length > 1 && (
                <div className="db-two-col">
                  <div className="db-card">
                    <div className="db-card-tag">{t.landTag}</div>
                    <div className="db-card-title">{t.landTitle}</div>
                    <LandTrendChart profiles={profiles} />
                  </div>
                  <div className="db-card">
                    <div className="db-card-tag">{t.soilTag}</div>
                    <div className="db-card-title">{t.soilTitle}</div>
                    <SoilBreakdown profiles={profiles} />
                  </div>
                </div>
              )}

              <div className="db-card">
                <div className="db-card-tag">{t.profileHistTag}</div>
                <div className="db-card-title">{t.profileHistTitle}</div>
                <div className="db-table-wrap">
                  <table className="db-table">
                    <thead>
                      <tr>{t.tableHeaders.map(h => <th key={h}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {profiles.map((p, i) => (
                        <tr key={p.id || i} style={{animationDelay:`${i*0.04}s`}}>
                          <td><span className="db-td-num">#{String(i+1).padStart(2,"0")}</span></td>
                          <td><span className="db-td-name">{p.name || "—"}</span></td>
                          <td>📍 {p.location || "—"}</td>
                          <td><span className="db-td-crop">{p.crop || "—"}</span></td>
                          <td>{(p.landSize ?? p.landsize) != null ? (p.landSize ?? p.landsize) : "—"}</td>
                          <td>{p.soilType || p.soiltype || "N/A"}</td>
                          <td>{p.irrigationType || p.irrigationtype || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {!loading && activeTab === "profiles" && (
            <>
              <div className="db-section-hd">
                <div className="db-card-tag">{t.profilesTag}</div>
                <h2 className="db-section-title">{t.profilesTitle} ({profiles.length})</h2>
              </div>
              <div className="db-profiles-grid">
                {profiles.map((p, i) => (
                  <ProfileCard key={p.id || i} profile={p} index={i} isLatest={i === 0} t={t} />
                ))}
                {profiles.length === 0 && (
                  <div className="db-empty">
                    <div style={{fontSize:"3rem"}}>🌱</div>
                    <div>{t.noProfiles} <a href="/onboarding" className="db-link">{t.addFirst}</a></div>
                  </div>
                )}
              </div>
            </>
          )}

          {!loading && activeTab === "analytics" && (
            <>
              <div className="db-two-col">
                <div className="db-card">
                  <div className="db-card-tag">{t.analyticsLandTag}</div>
                  <div className="db-card-title">{t.analyticsLandTitle}</div>
                  {profiles.length > 0 ? <LandTrendChart profiles={profiles} /> : <div className="db-muted-text">{t.noData}</div>}
                </div>
                <div className="db-card">
                  <div className="db-card-tag">{t.analyticsSoilTag}</div>
                  <div className="db-card-title">{t.analyticsSoilTitle}</div>
                  <SoilBreakdown profiles={profiles} />
                </div>
              </div>
              <div className="db-card">
                <div className="db-card-tag">{t.analyticsCropTag}</div>
                <div className="db-card-title">{t.analyticsCropTitle}</div>
                <div className="db-crop-tags">
                  {uniqueCrops.map((c, i) => (
                    <span key={c} className="db-crop-tag" style={{borderColor:CROP_COLORS[i%CROP_COLORS.length],color:CROP_COLORS[i%CROP_COLORS.length]}}>
                      🌱 {c}
                    </span>
                  ))}
                  {uniqueCrops.length === 0 && <div className="db-muted-text">{t.noCrop}</div>}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --bg:#040c06; --surf:#081309; --green:#1a4025; --sage:#2e6b3e; --leaf:#4caf65; --mint:#7dd99a; --gold:#c47f1a; --amber:#e8a832; --cream:#f0e8d5; --warm:#d4c4a0; --muted:rgba(240,232,213,0.4); --border:rgba(196,127,26,0.18); --font:'DM Sans',sans-serif; --serif:'Cormorant Garamond',serif; --mono:'Space Mono',monospace; --r:16px; --r-sm:10px; }
  .db-wrap { font-family:var(--font); background:var(--bg); min-height:100vh; color:var(--cream); }
  .db-topbar { background:radial-gradient(ellipse at 0% 50%,rgba(26,64,37,0.6) 0%,transparent 55%),linear-gradient(135deg,#040c06,#0c1a0e); border-bottom:1px solid var(--border); padding:28px 32px; position:sticky; top:0; z-index:100; backdrop-filter:blur(16px); }
  .db-topbar-inner { max-width:1320px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:20px; }
  .db-topbar-eye { font-family:var(--mono); font-size:9px; letter-spacing:2px; color:var(--leaf); margin-bottom:6px; }
  .db-topbar-title { font-family:var(--serif); font-size:clamp(1.6rem,3vw,2.4rem); font-weight:700; color:var(--cream); letter-spacing:-0.5px; }
  .db-topbar-sub { font-size:12px; color:var(--muted); margin-top:4px; }
  .db-topbar-stats { display:flex; align-items:center; gap:28px; }
  .db-tstat { text-align:center; }
  .db-tstat-v { font-family:var(--serif); font-size:1.9rem; font-weight:700; color:var(--leaf); line-height:1; }
  .db-tstat-l { font-family:var(--mono); font-size:9px; letter-spacing:1px; color:var(--muted); margin-top:4px; text-transform:uppercase; }
  .db-tstat-div { width:1px; height:36px; background:var(--border); }
  .db-tabs-wrap { background:rgba(255,255,255,0.015); border-bottom:1px solid var(--border); padding:0 32px; }
  .db-tabs { max-width:1320px; margin:0 auto; display:flex; gap:4px; }
  .db-tab { padding:14px 22px; background:none; border:none; cursor:pointer; font-family:var(--font); font-size:13px; font-weight:500; color:var(--muted); border-bottom:2px solid transparent; transition:all 0.2s; margin-bottom:-1px; }
  .db-tab.active { color:var(--leaf); border-bottom-color:var(--leaf); }
  .db-tab:hover:not(.active) { color:var(--warm); }
  .db-body { max-width:1320px; margin:0 auto; padding:32px 24px; display:flex; flex-direction:column; gap:24px; }
  .db-loading-full { display:flex; flex-direction:column; align-items:center; gap:16px; padding:80px 0; color:var(--muted); font-family:var(--mono); font-size:12px; }
  .db-spinner { width:36px; height:36px; border:2px solid rgba(76,175,101,0.2); border-top-color:var(--leaf); border-radius:50%; animation:spin 0.8s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }
  .db-hero-section { display:flex; align-items:stretch; gap:24px; background:linear-gradient(135deg,rgba(26,64,37,0.25),rgba(196,127,26,0.05)); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; min-height:340px; flex-wrap:wrap; }
  .db-hero-img-wrap { flex:0 0 220px; position:relative; overflow:hidden; }
  @media(max-width:900px){.db-hero-img-wrap{display:none}}
  .db-hero-img { width:100%; height:100%; object-fit:cover; transition:opacity 0.7s ease,transform 0.4s ease; }
  .db-hero-img:hover { transform:scale(1.04); }
  .db-hero-img-overlay { position:absolute; inset:0; background:linear-gradient(90deg,rgba(4,12,6,0.4),transparent,rgba(4,12,6,0.4)); pointer-events:none; }
  .db-hero-center { flex:1; padding:36px 32px; display:flex; flex-direction:column; justify-content:center; gap:16px; min-width:260px; }
  .db-hero-badge { display:inline-block; padding:4px 14px; border-radius:20px; background:rgba(196,127,26,0.12); border:1px solid rgba(196,127,26,0.3); color:var(--amber); font-family:var(--mono); font-size:9px; letter-spacing:1.5px; text-transform:uppercase; align-self:flex-start; }
  .db-hero-name { font-family:var(--serif); font-size:2.4rem; font-weight:700; color:var(--cream); line-height:1; }
  .db-hero-loc { font-size:13px; color:var(--muted); }
  .db-hero-fields { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px; }
  .db-hero-field { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:var(--r-sm); padding:10px 12px; }
  .db-hero-field-ic { font-size:16px; flex-shrink:0; }
  .db-hero-field-lb { font-family:var(--mono); font-size:8.5px; letter-spacing:1px; color:var(--muted); text-transform:uppercase; }
  .db-hero-field-val { font-size:13px; font-weight:600; color:var(--cream); margin-top:2px; }
  .db-pills-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
  @media(max-width:768px){.db-pills-row{grid-template-columns:repeat(2,1fr)}}
  .db-pill { background:rgba(255,255,255,0.025); border:1px solid var(--border); border-radius:var(--r); padding:18px 20px; display:flex; align-items:center; gap:14px; transition:transform 0.22s,box-shadow 0.22s; animation:slideUp 0.5s ease both; }
  .db-pill:hover { transform:translateY(-3px); box-shadow:0 10px 32px rgba(0,0,0,0.3); }
  @keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .db-pill-ic { width:44px; height:44px; border-radius:var(--r-sm); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
  .db-pill-v { font-family:var(--serif); font-size:1.65rem; font-weight:700; line-height:1; }
  .db-pill-l { font-family:var(--mono); font-size:9px; letter-spacing:0.5px; color:var(--muted); margin-top:4px; text-transform:uppercase; }
  .db-two-col { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  @media(max-width:900px){.db-two-col{grid-template-columns:1fr}}
  .db-card { background:linear-gradient(135deg,rgba(255,255,255,0.028),rgba(255,255,255,0.012)); border:1px solid var(--border); border-radius:var(--r); padding:24px; animation:slideUp 0.5s ease both; }
  .db-card-tag { font-family:var(--mono); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--amber); margin-bottom:6px; }
  .db-card-title { font-family:var(--serif); font-size:1.25rem; font-weight:700; color:var(--cream); margin-bottom:20px; }
  .db-weather-top { display:flex; align-items:center; gap:16px; margin-bottom:20px; }
  .db-wicon { width:68px; height:68px; }
  .db-weather-temp { font-family:var(--serif); font-size:3rem; font-weight:700; color:var(--cream); line-height:1; }
  .db-weather-loc { font-size:13px; font-weight:600; color:var(--warm); margin-top:4px; }
  .db-weather-cond { font-family:var(--mono); font-size:10px; color:var(--muted); text-transform:capitalize; margin-top:2px; }
  .db-weather-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px; }
  .db-wstat { background:rgba(255,255,255,0.03); border-radius:8px; padding:10px 8px; display:flex; flex-direction:column; align-items:center; gap:3px; }
  .db-wstat-ic { font-size:18px; }
  .db-wstat-v { font-size:13px; font-weight:600; color:var(--cream); }
  .db-wstat-l { font-family:var(--mono); font-size:8px; letter-spacing:0.5px; color:var(--muted); }
  .db-weather-alert { border-radius:8px; padding:10px 14px; font-size:12px; font-weight:600; }
  .db-weather-alert.rain { background:rgba(96,165,250,0.1); border:1px solid rgba(96,165,250,0.2); color:#93c5fd; }
  .db-weather-alert.ok { background:rgba(76,175,101,0.1); border:1px solid rgba(76,175,101,0.2); color:var(--leaf); }
  .db-market-crop { font-family:var(--mono); font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:var(--amber); margin-bottom:8px; }
  .db-market-price { font-family:var(--serif); font-size:2.8rem; font-weight:700; color:var(--leaf); line-height:1; }
  .db-market-unit { font-size:14px; color:var(--muted); font-family:var(--font); }
  .db-market-meta { display:flex; flex-wrap:wrap; gap:12px; font-size:11px; color:var(--muted); margin:12px 0; }
  .db-trend-label { font-family:var(--mono); font-size:8.5px; letter-spacing:1.5px; color:var(--muted); text-transform:uppercase; margin-bottom:8px; }
  .db-soil-list { display:flex; flex-direction:column; gap:14px; }
  .db-soil-row { display:flex; align-items:center; gap:10px; }
  .db-soil-name { display:flex; align-items:center; gap:8px; width:120px; font-size:12px; color:var(--warm); flex-shrink:0; }
  .db-soil-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .db-soil-bar-wrap { flex:1; height:6px; background:rgba(255,255,255,0.06); border-radius:4px; overflow:hidden; }
  .db-soil-bar { height:100%; border-radius:4px; transition:width 1s ease; }
  .db-soil-pct { font-family:var(--mono); font-size:10px; color:var(--muted); width:32px; text-align:right; flex-shrink:0; }
  .db-section-hd { margin-bottom:4px; }
  .db-section-title { font-family:var(--serif); font-size:1.8rem; font-weight:700; color:var(--cream); }
  .db-profiles-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:18px; }
  .db-profile-card { background:rgba(255,255,255,0.025); border:1px solid var(--border); border-radius:var(--r); padding:22px; position:relative; animation:slideUp 0.5s ease both; transition:transform 0.22s,box-shadow 0.22s; }
  .db-profile-card:hover { transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,0.3); }
  .db-profile-card.latest { border-color:rgba(76,175,101,0.35); background:rgba(26,64,37,0.15); }
  .db-profile-badge { position:absolute; top:16px; right:16px; padding:3px 10px; border-radius:12px; background:rgba(76,175,101,0.15); border:1px solid rgba(76,175,101,0.3); color:var(--mint); font-family:var(--mono); font-size:8px; letter-spacing:1px; }
  .db-profile-num { font-family:var(--mono); font-size:11px; color:var(--muted); margin-bottom:6px; }
  .db-profile-name { font-family:var(--serif); font-size:1.5rem; font-weight:700; color:var(--cream); margin-bottom:16px; }
  .db-profile-rows { display:flex; flex-direction:column; gap:8px; }
  .db-profile-row { display:flex; align-items:center; gap:8px; padding:8px 10px; background:rgba(255,255,255,0.025); border-radius:7px; border:1px solid rgba(255,255,255,0.04); }
  .db-profile-ic { font-size:14px; flex-shrink:0; }
  .db-profile-lb { font-family:var(--mono); font-size:9px; letter-spacing:0.5px; color:var(--muted); flex:1; }
  .db-profile-val { font-size:12px; font-weight:600; color:var(--cream); }
  .db-table-wrap { overflow-x:auto; margin-top:12px; border-radius:var(--r-sm); overflow:hidden; }
  .db-table { width:100%; border-collapse:collapse; font-size:13px; }
  .db-table thead tr { background:rgba(196,127,26,0.08); border-bottom:1px solid var(--border); }
  .db-table th { padding:12px 14px; text-align:left; font-family:var(--mono); font-size:8.5px; letter-spacing:1.5px; text-transform:uppercase; color:var(--amber); white-space:nowrap; }
  .db-table tbody tr { border-bottom:1px solid rgba(255,255,255,0.03); transition:background 0.15s; animation:slideUp 0.4s ease both; }
  .db-table tbody tr:hover { background:rgba(76,175,101,0.04); }
  .db-table td { padding:11px 14px; color:var(--cream); }
  .db-td-num { font-family:var(--mono); font-size:10px; color:var(--muted); }
  .db-td-name { font-weight:600; }
  .db-td-crop { display:inline-block; padding:2px 10px; border-radius:20px; background:rgba(76,175,101,0.1); border:1px solid rgba(76,175,101,0.2); color:var(--leaf); font-size:11px; }
  .db-crop-tags { display:flex; flex-wrap:wrap; gap:10px; }
  .db-crop-tag { padding:7px 16px; border-radius:20px; border:1px solid; font-size:13px; font-weight:500; background:rgba(255,255,255,0.03); }
  .db-muted-text { color:var(--muted); font-size:13px; padding:12px 0; font-family:var(--mono); }
  .db-err { color:#f87171; font-size:13px; }
  .db-empty { display:flex; flex-direction:column; align-items:center; gap:12px; padding:60px 0; color:var(--muted); font-size:14px; text-align:center; }
  .db-link { color:var(--leaf); text-decoration:none; }
  .db-link:hover { text-decoration:underline; }
  .db-locked { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:var(--bg); gap:14px; text-align:center; padding:40px; }
  .db-locked-ic { font-size:48px; }
  .db-locked-t { font-family:var(--serif); font-size:2.2rem; color:var(--cream); }
  .db-locked-s { color:var(--muted); font-size:14px; }
`;
