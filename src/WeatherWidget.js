import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || "d7a2c44cdd3c9b8ff2cf7c373936dd67";

const WeatherWidget = forwardRef(({ city = "Kochi" }, ref) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const alertIntervalRef = useRef(null);
  const stopTimeoutRef = useRef(null);
  const lastAlertConditionRef = useRef(null);
  const pausedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    stopAlerts
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

  const notifyFarmer = (message) => {
    if (!("Notification" in window)) alert(message);
    else if (Notification.permission === "granted") new Notification("🌾 Krishi Sakhi Alert", { body: message });
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") new Notification("🌾 Krishi Sakhi Alert", { body: message });
      });
    }
  };

  const speakMessage = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "ml-IN";
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        if (!isMounted) return;

        if (res.ok) {
          const condition = data.weather?.[0]?.description || "";
          const tempC = Math.round(data.main.temp);
          const precipitationMm = data.rain?.["1h"] ?? data.rain?.["3h"] ?? 0;

          const w = {
            city: data.name,
            condition,
            tempC,
            feels: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            windKmh: data.wind?.speed ? (data.wind.speed * 3.6).toFixed(1) : null,
            precipitationMm,
            timeStr: new Date((data.dt + (data.timezone || 0)) * 1000).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          };
          setWeather(w);

          let currentCondition = "";
          if (w.precipitationMm > 0 || /rain|drizzle|thunderstorm/i.test(w.condition)) currentCondition = "rain";
          else if (w.tempC > 35) currentCondition = "heat";

          if (currentCondition && currentCondition !== lastAlertConditionRef.current && !pausedRef.current) {
            lastAlertConditionRef.current = currentCondition;
            stopAlerts(); // reset previous alerts

            alertIntervalRef.current = setInterval(() => {
              if (pausedRef.current) return;
              if (currentCondition === "rain") {
                notifyFarmer("🌧️ Rain expected soon. Delay spraying pesticides.");
                speakMessage("മഴയ്ക്ക് സാധ്യതയുണ്ട്. കീടനാശിനി തളിക്കുന്നതു താമസിപ്പിക്കുക.");
              } else if (currentCondition === "heat") {
                notifyFarmer("☀️ High temperature today. Water crops early morning/evening.");
                speakMessage("ഇന്ന് ഏറെ ചൂടാണ്. രാവിലെ അല്ലെങ്കിൽ വൈകുന്നേരം വെള്ളം നൽകുക.");
              }
            }, 5000);

            stopTimeoutRef.current = setTimeout(() => {
              stopAlerts();
              console.log("⏱️ Alerts auto-stopped after 5 min");
            }, 5 * 60 * 1000);
          }
        } else {
          setError(data.message || "Weather not found");
        }
      } catch (err) {
        setError("Failed to fetch weather");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
      stopAlerts();
    };
  }, [city]);

  if (loading) return <div className="weather-card">Loading weather...</div>;
  if (error) return <div className="weather-card">Weather not available: {error}</div>;
  if (!weather) return null;

  const willRain = weather.precipitationMm > 0 || /rain|drizzle|thunderstorm/i.test(weather.condition);

  return (
    <div className="weather-card">
      <h3>🌤 Weather — {weather.city}</h3>
      <div style={{ marginBottom: 6, fontSize: 14, color: "#444" }}>{weather.condition} · {weather.timeStr}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{weather.tempC}°C</div>
        <div style={{ fontSize: 12, color: "#555" }}>Feels like {weather.feels}°C</div>
      </div>
      <div style={{ fontSize: 14, marginTop: 8 }}>
        <div>Precipitation: {weather.precipitationMm} mm</div>
        <div>Humidity: {weather.humidity}%</div>
        <div>Wind: {weather.windKmh ?? "N/A"} km/h</div>
      </div>
      <div style={{ marginTop: 10, fontWeight: 600, color: willRain ? "#c62828" : "#2e7d32" }}>
        {willRain ? "🌧️ Rain likely — avoid spraying pesticides" : "✅ No rain expected soon"}
      </div>
    </div>
  );
});

export default WeatherWidget;



