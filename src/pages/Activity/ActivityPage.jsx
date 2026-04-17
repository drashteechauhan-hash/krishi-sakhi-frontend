import { useState, useRef } from "react";

const GREEN_DARK  = "#1a4d2e";
const GREEN_MID   = "#2e7d32";
const GREEN_LIGHT = "#4caf50";
const ORANGE      = "#f57c00";
const RED_DARK    = "#b71c1c";
const CREAM       = "#fdf6e3";
const CREAM2      = "#f5f0e8";

const SpeechRecognition =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const styles = {
  root: {
    fontFamily: "'Noto Sans Malayalam', 'Segoe UI', sans-serif",
    minHeight: "100vh",
    background: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 16px",
    gap: 28,
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
    padding: "28px 32px",
    width: "100%",
    maxWidth: 780,
  },
  cardTitle: {
    fontWeight: 800,
    fontSize: 20,
    color: GREEN_DARK,
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  langRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  langLabel: {
    color: "#555",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  langSelect: {
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "4px 10px",
    fontSize: 14,
    cursor: "pointer",
    background: "#fff",
    color: "#333",
  },
  inputRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    minWidth: 200,
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 15,
    outline: "none",
    color: "#333",
    fontFamily: "inherit",
  },
  btnSpeak: (active) => ({
    background: active ? "#e65100" : ORANGE,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap",
    boxShadow: active ? "0 0 0 3px #ffb74d" : "none",
  }),
  btnAdd: {
    background: GREEN_MID,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  btnClear: {
    background: RED_DARK,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  diaryCard: {
    background: CREAM,
    borderRadius: 14,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    padding: "28px 32px",
    width: "100%",
    maxWidth: 780,
    border: `1px solid ${CREAM2}`,
  },
  emptyMsg: {
    textAlign: "center",
    color: "#888",
    fontSize: 15,
    marginTop: 12,
  },
  entryList: {
    listStyle: "none",
    padding: 0,
    margin: "14px 0 0",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  entryItem: {
    background: "#fff",
    borderRadius: 8,
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    borderLeft: `4px solid ${GREEN_LIGHT}`,
    gap: 12,
  },
  entryText: {
    flex: 1,
    color: "#333",
    fontSize: 14,
  },
  entryMeta: {
    fontSize: 12,
    color: "#999",
    whiteSpace: "nowrap",
  },
  entryDelete: {
    background: "none",
    border: "none",
    color: "#e53935",
    cursor: "pointer",
    fontSize: 16,
    padding: "2px 6px",
    borderRadius: 4,
  },
};

export default function ActivityPage() {
  const [lang, setLang]           = useState("ml");
  const [input, setInput]         = useState("");
  const [entries, setEntries]     = useState([]);
  const [listening, setListening] = useState(false);
  const recognitionRef            = useRef(null);

  const handleSpeak = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition not supported. Please use Chrome.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = lang === "ml" ? "ml-IN" : "en-IN";
    rec.interimResults = false;
    rec.onstart  = () => setListening(true);
    rec.onend    = () => setListening(false);
    rec.onerror  = () => setListening(false);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognitionRef.current = rec;
    rec.start();
  };

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString("en-IN");
    setEntries((prev) => [
      { id: Date.now(), text: trimmed, time: `${dateStr} ${timeStr}` },
      ...prev,
    ]);
    setInput("");
  };

  const handleClear  = () => setInput("");
  const handleDelete = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const placeholder = lang === "ml" ? "ഇന്ന് അരി വിതച്ചു" : "What did you do today?";

  return (
    <div style={styles.root}>

      {/* ── Log Work Card ── */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          ✍️ Log Today's Work / ഇന്നത്തെ പ്രവർത്തി രേഖപ്പെടുത്തുക
        </div>

        <div style={styles.langRow}>
          <span style={styles.langLabel}>🌐 Language:</span>
          <select
            style={styles.langSelect}
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="ml">Malayalam</option>
            <option value="en">English</option>
          </select>
        </div>

        <div style={styles.inputRow}>
          <input
            style={styles.textInput}
            type="text"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button style={styles.btnSpeak(listening)} onClick={handleSpeak}>
            🎤 {listening
              ? (lang === "ml" ? "കേൾക്കുന്നു…" : "Listening…")
              : "Speak / സംസാരിക്കുക"}
          </button>
          <button style={styles.btnAdd} onClick={handleAdd}>
            + Add / ചേർക്കുക
          </button>
          <button style={styles.btnClear} onClick={handleClear}>
            🗑️ Clear / മായ്ക്കുക
          </button>
        </div>
      </div>

      {/* ── Diary Card ── */}
      <div style={styles.diaryCard}>
        <div style={styles.cardTitle}>
          📅 My Activity Diary / എന്റെ പ്രവർത്തി ഡയറി
        </div>

        {entries.length === 0 ? (
          <p style={styles.emptyMsg}>
            No work logged yet 🌱 / ഇപ്പോഴും പ്രവർത്തി ഒന്നും ചേർത്തിട്ടില്ല
          </p>
        ) : (
          <ul style={styles.entryList}>
            {entries.map((entry) => (
              <li key={entry.id} style={styles.entryItem}>
                <span style={styles.entryText}>{entry.text}</span>
                <span style={styles.entryMeta}>{entry.time}</span>
                <button style={styles.entryDelete} onClick={() => handleDelete(entry.id)}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
