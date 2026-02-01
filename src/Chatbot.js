import React, { useState, useEffect, useRef } from "react";
import faqData from "./faq.json";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Normalize text (remove punctuation, trim spaces, lowercase)
  const normalize = (str) =>
    (str || "").toLowerCase().replace(/[?.!,]/g, "").trim();

  // Detect language (English if has A-Z, else Malayalam)
  const detectLang = (text) => {
    return /[a-zA-Z]/.test(text) ? "en" : "ml";
  };

  // Send message
  const handleSend = (text) => {
    if (!text || !text.trim()) return;
    const userText = text.trim();

    // Show user msg
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");

    // Normalize user text
    const lowerText = normalize(userText);

    // Match FAQ (exact match after normalization)
    const match = faqData.find((q) => {
      const qEn = normalize(q.question_en);
      const qMl = normalize(q.question_ml);
      return qEn === lowerText || qMl === lowerText;
    });

    const userLang = detectLang(userText);
    let answer;
    if (match) {
      answer =
        userLang === "en"
          ? match.answer_en || "Sorry, answer not available."
          : match.answer_ml || "ക്ഷമിക്കുക, മറുപടി ലഭ്യമല്ല.";
    } else {
      answer =
        userLang === "en"
          ? "Sorry, we will reply shortly."
          : "ക്ഷമിക്കുക, ഉടൻ മറുപടി നൽകും";
    }

    setMessages((prev) => [...prev, { sender: "bot", text: answer }]);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "300px",
        height: "400px",
        background: "#fff",
        border: "2px solid #2e7d32",
        borderRadius: "12px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        zIndex: 9999,
      }}
    >
      {/* Close button */}
      <button
        onClick={() => setMessages([])}
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          background: "#d9534f",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ×
      </button>

      {/* Messages */}
      <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
        {messages.length === 0 && (
          <div style={{ color: "#aaa", textAlign: "center", marginTop: "40%" }}>
            You can ask a question in English or Malayalam
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              margin: "5px 0",
              textAlign: msg.sender === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px",
                borderRadius: "10px",
                background: msg.sender === "user" ? "#4caf50" : "#eee",
                color: msg.sender === "user" ? "#fff" : "#000",
                maxWidth: "80%",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input + send */}
      <div
        style={{
          padding: "10px",
          display: "flex",
          gap: "5px",
          alignItems: "center",
          marginBottom: "5px",
          paddingRight: "40px",
        }}
      >
        <input
          style={{
            flex: 1,
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Type here..."}
        />

        {/* Send */}
        <button
          onClick={() => handleSend(input)}
          style={{
            background: "#2e7d32",
            color: "#fff",
            border: "none",
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;




