import React, { useState, useEffect } from "react";
import "./Activity.css";

function Activity() {
  const [activity, setActivity] = useState("");
  const [logs, setLogs] = useState([]);
  const [lang, setLang] = useState("ml-IN"); // Default Malayalam

  // Load logs from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("activityLogs")) || [];
    setLogs(stored);
  }, []);

  // Save new log
  const handleAdd = () => {
    if (!activity.trim()) return;
    const newLog = {
      text: activity,
      date: new Date().toLocaleDateString(),
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem("activityLogs", JSON.stringify(updatedLogs));
    setActivity("");
  };

  // Clear all logs
  const handleClear = () => {
    setLogs([]);
    localStorage.removeItem("activityLogs");
  };

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
      setActivity(transcript);
    };

    recognition.onerror = (event) => {
      console.error("❌ Error:", event.error);
      alert("Mic Error: " + event.error);
    };
  };

  // 📝 Placeholder text based on selected language
  const placeholderText =
    lang === "ml-IN" ? "ഇന്ന് അരി വിതച്ചു" : "I sowed paddy today";

  return (
    <div className="activity-container">
      {/* Input Card */}
      <div className="activity-card">
        <h2>✍️ Log Today’s Work / ഇന്നത്തെ പ്രവർത്തി രേഖപ്പെടുത്തുക</h2>

        {/* 🌐 Language selector */}
        <div className="lang-select">
          <label>🌐 Language: </label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="ml-IN">Malayalam</option>
            <option value="en-IN">English</option>
          </select>
        </div>

        <div className="input-row">
          <input
            type="text"
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
          </button>
        </div>
      </div>

      {/* Logs Section */}
      <div className="logs-section">
        <h3>📅 My Activity Diary / എന്റെ പ്രവർത്തി ഡയറി</h3>
        {logs.length === 0 ? (
          <p className="empty">
            No work logged yet 🌾 / ഇപ്പോഴും പ്രവർത്തി ഒന്നും ചേർത്തിട്ടില്ല
          </p>
        ) : (
          <ul className="timeline">
            {logs.map((log, index) => (
              <li key={index}>
                <span className="date">{log.date}</span>
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
