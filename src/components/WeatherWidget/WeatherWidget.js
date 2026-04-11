import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || "d7a2c44cdd3c9b8ff2cf7c373936dd67";

const WeatherWidget = forwardRef(({ city = "Delhi" }, ref) => {
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
    </div>
  );
});

export default WeatherWidget;


