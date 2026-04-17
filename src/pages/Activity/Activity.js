import React, { useState, useEffect } from "react";
<<<<<<< HEAD
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
=======
import "./Activity.css";

function Activity() {
  const [activity, setActivity] = useState("");
  const [logs, setLogs] = useState([]);
  const [lang, setLang] = useState("ml-IN"); // Default Malayalam

  // Load logs from localStorage
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("activityLogs")) || [];
    setLogs(stored);
  }, []);

  // Save new log
  const handleAdd = () => {
<<<<<<< HEAD
    const trimmed = activity.trim();
    if (!trimmed) return;
    const newLog = {
      text: trimmed,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
=======
    if (!activity.trim()) return;
    const newLog = {
      text: activity,
      date: new Date().toLocaleDateString(),
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem("activityLogs", JSON.stringify(updatedLogs));
    setActivity("");
  };

<<<<<<< HEAD
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  // Clear all logs
  const handleClear = () => {
    if (!window.confirm(t.confirmClear)) return;
=======
  // Clear all logs
  const handleClear = () => {
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
    setLogs([]);
    localStorage.removeItem("activityLogs");
  };

<<<<<<< HEAD
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
=======
  // 🎤 Start speech recognition
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser!");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();

    recognition.onstart = () => {
      console.log("🎤 Listening in", lang);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("✅ Transcript:", transcript);
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
      setActivity(transcript);
    };

    recognition.onerror = (event) => {
<<<<<<< HEAD
      setListening(false);
      alert("Mic error: " + event.error);
    };

    recognition.start();
  };

=======
      console.error("❌ Error:", event.error);
      alert("Mic Error: " + event.error);
    };
  };

  // 📝 Placeholder text based on selected language
  const placeholderText =
    lang === "ml-IN" ? "ഇന്ന് അരി വിതച്ചു" : "I sowed paddy today";

>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
  return (
    <div className="activity-container">
      {/* Input Card */}
      <div className="activity-card">
<<<<<<< HEAD
        <h2>{t.title}</h2>
=======
        <h2>✍️ Log Today’s Work / ഇന്നത്തെ പ്രവർത്തി രേഖപ്പെടുത്തുക</h2>

        {/* 🌐 Language selector */}
        <div className="lang-select">
          <label>🌐 Language: </label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="ml-IN">Malayalam</option>
            <option value="en-IN">English</option>
          </select>
        </div>
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b

        <div className="input-row">
          <input
            type="text"
<<<<<<< HEAD
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
=======
            placeholder={placeholderText}
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          />
          <button className="speak-btn" onClick={handleVoiceInput}>
            🎤 Speak / സംസാരിക്കുക
          </button>
          <button className="add-btn" onClick={handleAdd}>
            ➕ Add / ചേർക്കുക
          </button>
          <button className="clear-btn" onClick={handleClear}>
            🗑️ Clear / മായ്ക്കുക
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
          </button>
        </div>
      </div>

      {/* Logs Section */}
      <div className="logs-section">
<<<<<<< HEAD
        <h3>📅 {t.diaryTitle}</h3>
        {logs.length === 0 ? (
          <p className="empty">{t.empty}</p>
=======
        <h3>📅 My Activity Diary / എന്റെ പ്രവർത്തി ഡയറി</h3>
        {logs.length === 0 ? (
          <p className="empty">
            No work logged yet 🌾 / ഇപ്പോഴും പ്രവർത്തി ഒന്നും ചേർത്തിട്ടില്ല
          </p>
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
        ) : (
          <ul className="timeline">
            {logs.map((log, index) => (
              <li key={index}>
<<<<<<< HEAD
                <span className="date">{log.date}{log.time ? ` · ${log.time}` : ""}</span>
=======
                <span className="date">{log.date}</span>
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
                <span className="text">{log.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default Activity;
=======
export default Activity;
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
