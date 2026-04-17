import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./Activity.css";

const TEXT = {
  en: {
    title: "Log Today's Work",
    placeholder: "e.g. Sowed paddy in north field",
    speakBtn: "🎤 Speak",
    addBtn: "Add Entry",
    clearBtn: "Clear All",
    diaryTitle: "My Activity Diary",
    empty: "No work logged yet. Add your first entry above.",
    recognitionLang: "en-IN",
    confirmClear: "Clear all activity logs?",
  },
  hi: {
    title: "आज का काम दर्ज करें",
    placeholder: "जैसे: उत्तरी खेत में धान बोया",
    speakBtn: "🎤 बोलें",
    addBtn: "दर्ज करें",
    clearBtn: "सब मिटाएं",
    diaryTitle: "मेरी गतिविधि डायरी",
    empty: "अभी तक कोई काम दर्ज नहीं हुआ।",
    recognitionLang: "hi-IN",
    confirmClear: "सभी गतिविधियां मिटा दें?",
  },
  ml: {
    title: "ഇന്നത്തെ പ്രവർത്തി രേഖപ്പെടുത്തുക",
    placeholder: "ഉദാ: വടക്കേ പാടത്ത് നെൽ വിതച്ചു",
    speakBtn: "🎤 സംസാരിക്കുക",
    addBtn: "ചേർക്കുക",
    clearBtn: "മായ്ക്കുക",
    diaryTitle: "എന്റെ പ്രവർത്തി ഡയറി",
    empty: "ഇപ്പോഴും ഒന്നും ചേർത്തിട്ടില്ല. മുകളിൽ ആദ്യ എൻട്രി ചേർക്കൂ.",
    recognitionLang: "ml-IN",
    confirmClear: "എല്ലാ എൻട്രികളും മായ്ക്കണോ?",
  },
};

function Activity() {
  const { lang } = useLanguage();
  const t = TEXT[lang] || TEXT.en;

  const [activity, setActivity] = useState("");
  const [logs, setLogs] = useState([]);
  const [listening, setListening] = useState(false);

  // Load logs from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("activityLogs")) || [];
    setLogs(stored);
  }, []);

  // Save new log
  const handleAdd = () => {
    const trimmed = activity.trim();
    if (!trimmed) return;
    const newLog = {
      text: trimmed,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem("activityLogs", JSON.stringify(updatedLogs));
    setActivity("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  // Clear all logs
  const handleClear = () => {
    if (!window.confirm(t.confirmClear)) return;
    setLogs([]);
    localStorage.removeItem("activityLogs");
  };

  // Voice input — uses app language automatically
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = t.recognitionLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setActivity(transcript);
    };

    recognition.onerror = (event) => {
      setListening(false);
      alert("Mic error: " + event.error);
    };

    recognition.start();
  };

  return (
    <div className="activity-container">
      {/* Input Card */}
      <div className="activity-card">
        <h2>{t.title}</h2>

        <div className="input-row">
          <input
            type="text"
            placeholder={t.placeholder}
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`speak-btn${listening ? " listening" : ""}`}
            onClick={handleVoiceInput}
            title={t.speakBtn}
          >
            {listening ? "🔴" : "🎤"} {t.speakBtn.replace("🎤 ", "")}
          </button>
          <button className="add-btn" onClick={handleAdd}>
            ➕ {t.addBtn}
          </button>
          <button className="clear-btn" onClick={handleClear}>
            🗑️ {t.clearBtn}
          </button>
        </div>
      </div>

      {/* Logs Section */}
      <div className="logs-section">
        <h3>📅 {t.diaryTitle}</h3>
        {logs.length === 0 ? (
          <p className="empty">{t.empty}</p>
        ) : (
          <ul className="timeline">
            {logs.map((log, index) => (
              <li key={index}>
                <span className="date">{log.date}{log.time ? ` · ${log.time}` : ""}</span>
                <span className="text">{log.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Activity;