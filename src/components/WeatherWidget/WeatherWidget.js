<<<<<<< HEAD
// WeatherWidget is now fully embedded in Dashboard.jsx for design consistency.
// This file is kept for backward compatibility if used elsewhere.

import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
=======
import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || "d7a2c44cdd3c9b8ff2cf7c373936dd67";

const WeatherWidget = forwardRef(({ city = "Delhi" }, ref) => {
<<<<<<< HEAD
  const [weather, setWeather]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);
  const alertIntervalRef        = useRef(null);
  const stopTimeoutRef          = useRef(null);
  const lastConditionRef        = useRef(null);
  const pausedRef               = useRef(false);

  useImperativeHandle(ref, () => ({ stopAlerts }));

  function stopAlerts() {
    pausedRef.current = true;
    clearInterval(alertIntervalRef.current);
    clearTimeout(stopTimeoutRef.current);
    alertIntervalRef.current = null;
    stopTimeoutRef.current   = null;
    lastConditionRef.current = null;
  }

  useEffect(() => {
    if ("Notification" in window) Notification.requestPermission();
  }, []);

  const notify = (msg) => {
    if (!("Notification" in window)) return alert(msg);
    if (Notification.permission === "granted")
      new Notification("🌾 Krishi Sakhi Alert", { body: msg });
  };

  const speak = (msg) => {
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = "hi-IN";
    speechSynthesis.speak(u);
  };

  useEffect(() => {
    let mounted = true;

    const fetch_ = async () => {
      setLoading(true); setError(null);
      try {
        const res  = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok) { setError(data.message || "City not found"); setLoading(false); return; }

        const w = {
          city: data.name,
          condition:   data.weather?.[0]?.description || "",
          icon:        data.weather?.[0]?.icon || "",
          tempC:       Math.round(data.main.temp),
          feels:       Math.round(data.main.feels_like),
          humidity:    data.main.humidity,
          windKmh:     data.wind?.speed ? (data.wind.speed * 3.6).toFixed(1) : "N/A",
          rain:        data.rain?.["1h"] ?? data.rain?.["3h"] ?? 0,
        };
        setWeather(w);

        let cond = "";
        if (w.rain > 0 || /rain|drizzle|thunder/i.test(w.condition)) cond = "rain";
        else if (w.tempC > 35) cond = "heat";

        if (cond && cond !== lastConditionRef.current && !pausedRef.current) {
          lastConditionRef.current = cond;
          stopAlerts();
          alertIntervalRef.current = setInterval(() => {
            if (pausedRef.current) return;
            if (cond === "rain") { notify("🌧️ Rain expected. Avoid pesticide spraying."); speak("बारिश की संभावना है। कीटनाशक छिड़काव रोक दें।"); }
            else { notify("☀️ High temperature. Water crops morning/evening."); speak("आज तापमान अधिक है। सुबह या शाम सिंचाई करें।"); }
          }, 5000);
          stopTimeoutRef.current = setTimeout(stopAlerts, 5 * 60 * 1000);
        }
      } catch { if (mounted) setError("Failed to fetch weather"); }
      finally  { if (mounted) setLoading(false); }
    };

    fetch_();
    const iv = setInterval(fetch_, 60000);
    return () => { mounted = false; clearInterval(iv); stopAlerts(); };
  }, [city]);

  if (loading) return <div style={S.card}><span style={S.muted}>Loading weather…</span></div>;
  if (error)   return <div style={S.card}><span style={{color:"#f87171"}}>❌ {error}</span></div>;
  if (!weather) return null;

  const willRain = weather.rain > 0 || /rain|drizzle|thunder/i.test(weather.condition);

  return (
    <div style={S.card}>
      <div style={S.title}>🌤 {weather.city}</div>
      <div style={S.row}>
        {weather.icon && <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="" style={{width:60}} />}
        <div>
          <div style={S.temp}>{weather.tempC}°C</div>
          <div style={S.cond}>{weather.condition}</div>
        </div>
      </div>
      <div style={S.grid}>
        {[["💧",`${weather.humidity}%`,"Humidity"],["🌬",`${weather.windKmh} km/h`,"Wind"],["🌡",`${weather.feels}°C`,"Feels Like"],["🌧",`${weather.rain} mm`,"Rain"]].map(([ic,v,l])=>(
          <div key={l} style={S.wstat}><span>{ic}</span><b>{v}</b><span style={S.muted}>{l}</span></div>
        ))}
      </div>
      <div style={{...S.alert, background: willRain ? "rgba(96,165,250,0.12)" : "rgba(92,184,112,0.12)", color: willRain ? "#93c5fd" : "#5cb870"}}>
        {willRain ? "🌧 Rain expected — avoid spraying" : "☀️ Clear skies — good for field work"}
      </div>
=======
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const alertIntervalRef = useRef(null);
  const stopTimeoutRef = useRef(null);
  const lastAlertConditionRef = useRef(null);
  const pausedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    stopAlerts,
  }));

  function stopAlerts() {
    pausedRef.current = true;
    if (alertIntervalRef.current) clearInterval(alertIntervalRef.current);
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    alertIntervalRef.current = null;
    stopTimeoutRef.current = null;
    lastAlertConditionRef.current = null;
    console.log("✅ Weather alerts stopped");
  }

  // ✅ FIXED: Ask notification permission once
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const notifyFarmer = (message) => {
    if (!("Notification" in window)) {
      alert(message);
    } else if (Notification.permission === "granted") {
      new Notification("🌾 Krishi Sakhi Alert", { body: message });
    }
  };

  // ✅ FIXED: Hindi voice instead of Malayalam
  const speakMessage = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "hi-IN";
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching weather for:", city);

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
          )}&appid=${API_KEY}&units=metric`
        );

        const data = await res.json();
        console.log("API response:", data);

        if (!isMounted) return;

        if (res.ok) {
          const w = {
            city: data.name,
            condition: data.weather?.[0]?.description || "",
            tempC: Math.round(data.main.temp),
            feels: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            windKmh: data.wind?.speed
              ? (data.wind.speed * 3.6).toFixed(1)
              : null,
            precipitationMm:
              data.rain?.["1h"] ?? data.rain?.["3h"] ?? 0,
            timeStr: new Date(
              (data.dt + (data.timezone || 0)) * 1000
            ).toLocaleTimeString("en-IN", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          };

          setWeather(w);

          // 🌧️ Detect condition
          let currentCondition = "";
          if (
            w.precipitationMm > 0 ||
            /rain|drizzle|thunderstorm/i.test(w.condition)
          )
            currentCondition = "rain";
          else if (w.tempC > 35) currentCondition = "heat";

          if (
            currentCondition &&
            currentCondition !== lastAlertConditionRef.current &&
            !pausedRef.current
          ) {
            lastAlertConditionRef.current = currentCondition;
            stopAlerts();

            alertIntervalRef.current = setInterval(() => {
              if (pausedRef.current) return;

              if (currentCondition === "rain") {
                notifyFarmer(
                  "🌧️ Rain expected. Avoid pesticide spraying."
                );
                speakMessage(
                  "बारिश की संभावना है। कीटनाशक छिड़काव रोक दें।"
                );
              } else if (currentCondition === "heat") {
                notifyFarmer(
                  "☀️ High temperature. Water crops morning/evening."
                );
                speakMessage(
                  "आज तापमान अधिक है। सुबह या शाम सिंचाई करें।"
                );
              }
            }, 5000);

            stopTimeoutRef.current = setTimeout(() => {
              stopAlerts();
            }, 5 * 60 * 1000);
          }
        } else {
          setError(data.message || "City not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch weather");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      stopAlerts();
    };
  }, [city]);

  if (loading) return <div className="weather-card">Loading...</div>;
  if (error)
    return <div className="weather-card">❌ {error}</div>;
  if (!weather) return null;

  const willRain =
    weather.precipitationMm > 0 ||
    /rain|drizzle|thunderstorm/i.test(weather.condition);

  return (
    <div className="weather-card">
      <h3>🌤 Weather — {weather.city}</h3>

      <p>
        {weather.condition} • {weather.timeStr}
      </p>

      <h2>{weather.tempC}°C</h2>
      <p>Feels like {weather.feels}°C</p>

      <p>💧 Humidity: {weather.humidity}%</p>
      <p>🌬 Wind: {weather.windKmh ?? "N/A"} km/h</p>

      <p>
        🌧 Rain: {weather.precipitationMm} mm
      </p>

      <strong style={{ color: willRain ? "red" : "green" }}>
        {willRain
          ? "Rain expected — avoid spraying"
          : "No rain expected"}
      </strong>
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
    </div>
  );
});

<<<<<<< HEAD
const S = {
  card:  { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(201,135,42,0.18)", borderRadius:16, padding:20, color:"#f5ede0", fontFamily:"'Outfit',sans-serif" },
  title: { fontSize:14, fontWeight:700, marginBottom:12, color:"#f0b24a" },
  row:   { display:"flex", alignItems:"center", gap:12, marginBottom:16 },
  temp:  { fontSize:"2.4rem", fontWeight:900, lineHeight:1, fontFamily:"'Playfair Display',serif", color:"#f5ede0" },
  cond:  { fontSize:12, color:"rgba(245,237,224,0.5)", textTransform:"capitalize", marginTop:4 },
  grid:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 },
  wstat: { display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"8px 6px", fontSize:12 },
  muted: { fontSize:10, color:"rgba(245,237,224,0.4)" },
  alert: { borderRadius:8, padding:"8px 12px", fontSize:12, fontWeight:600 },
};

export default WeatherWidget;
=======
export default WeatherWidget;


>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
