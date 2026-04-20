import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage, translateText } from "../../context/LanguageContext";
import "./Activity.css";

const RECOGNITION_LANG = {
  en: "en-IN", hi: "hi-IN", ml: "ml-IN", te: "te-IN",
  ta: "ta-IN", kn: "kn-IN", mr: "mr-IN", gu: "gu-IN",
  pa: "pa-IN", bn: "bn-IN", ur: "ur-PK", or: "or-IN",
  as: "as-IN", sa: "sa-IN",
};

function Activity() {
  const { t, lang } = useLanguage();
  const [activity, setActivity]     = useState("");
  const [logs, setLogs]             = useState([]);
  const [listening, setListening]   = useState(false);
  const [translating, setTranslating] = useState(false);

  const debounceRef   = useRef(null);
  const latestLang    = useRef(lang);
  const recognitionRef = useRef(null);

  useEffect(() => { latestLang.current = lang; }, [lang]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("activityLogs")) || [];
    setLogs(stored);
  }, []);

  // Real-time translation as user types
  const handleActivityChange = useCallback((e) => {
    const raw = e.target.value;
    setActivity(raw);

    if (!raw.trim() || latestLang.current === "en") return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setTranslating(true);
      try {
        const translated = await translateText(raw, latestLang.current);
        if (translated && translated !== raw) setActivity(translated);
      } finally {
        setTranslating(false);
      }
    }, 700);
  }, []);

  const handleAdd = useCallback(() => {
    const trimmed = activity.trim();
    if (!trimmed) return;
    const newLog = {
      text: trimmed,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem("activityLogs", JSON.stringify(updated));
    setActivity("");
    clearTimeout(debounceRef.current);
  }, [activity, logs]);

  const handleClear = useCallback(() => {
    if (!window.confirm(t("activity_confirm_clear"))) return;
    setLogs([]);
    localStorage.removeItem("activityLogs");
  }, [t]);

  const handleVoiceInput = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Speech Recognition not supported in this browser."); return; }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
      setListening(false);
      return;
    }

    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = RECOGNITION_LANG[latestLang.current] || "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart  = () => setListening(true);
    recognition.onend    = () => { setListening(false); recognitionRef.current = null; };
    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript;
      if (latestLang.current !== "en") {
        setTranslating(true);
        try {
          const translated = await translateText(transcript, latestLang.current);
          setActivity(translated || transcript);
        } finally {
          setTranslating(false);
        }
      } else {
        setActivity(transcript);
      }
    };
    recognition.onerror = (e) => {
      setListening(false);
      recognitionRef.current = null;
      if (e.error !== "aborted") alert("Mic error: " + e.error);
    };
    recognition.start();
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  }, [handleAdd]);

  // Cleanup on unmount
  useEffect(() => () => {
    clearTimeout(debounceRef.current);
    recognitionRef.current?.abort();
  }, []);

  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2>{t("activity_title")}</h2>
        <div className="input-row">
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              placeholder={t("activity_placeholder")}
              value={activity}
              onChange={handleActivityChange}
              onKeyDown={handleKeyDown}
              style={{ width: "100%", paddingRight: translating ? "32px" : undefined }}
            />
            {translating && (
              <span style={{
                position: "absolute", right: 8, top: "50%",
                transform: "translateY(-50%)",
                fontSize: 12, color: "rgba(74,222,128,0.7)", animation: "spin 1s linear infinite",
                display: "inline-block",
              }}>⟳</span>
            )}
          </div>
          <button
            className={`speak-btn${listening ? " listening" : ""}`}
            onClick={handleVoiceInput}
          >
            {listening ? "🔴" : "🎤"} {t("activity_speak_btn")}
          </button>
          <button className="add-btn" onClick={handleAdd}>
            ➕ {t("activity_add_btn")}
          </button>
          <button className="clear-btn" onClick={handleClear}>
            🗑️ {t("activity_clear_btn")}
          </button>
        </div>
      </div>

      <div className="logs-section">
        <h3>📅 {t("activity_diary_title")}</h3>
        {logs.length === 0 ? (
          <p className="empty">{t("activity_empty")}</p>
        ) : (
          <ul className="timeline">
            {logs.map((log, i) => (
              <li key={i}>
                <span className="date">{log.date}{log.time ? ` · ${log.time}` : ""}</span>
                <span className="text">{log.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: translateY(-50%) rotate(0deg); } to { transform: translateY(-50%) rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Activity;