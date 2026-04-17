import React, { useState } from "react";
import { useRef, useEffect } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hello 👋\n\nനമസ്കാരം! എങ്ങനെ സഹായിക്കാം?" }
  ]);
  const [input, setInput] = useState("");
 //
  const bottomRef = useRef(null);

  // 👇 ADD HERE
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageToAI = async (message) => {
    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      return data.reply;
    } catch (err) {
      console.error(err);
      return "Error connecting to AI";
    }
  };
  const speakText = (text) => {
  const parts = text.split("\n\n");

  const english = parts[0] || "";
  const malayalam = parts[1] || "";

  // English speech
  const engSpeech = new SpeechSynthesisUtterance(english);
  engSpeech.lang = "en-US";

  // Malayalam speech (force English voice)
  const malSpeech = new SpeechSynthesisUtterance(malayalam);
  malSpeech.lang = "en-US"; // 👈 IMPORTANT (this is what you want)

  speechSynthesis.cancel();

  speechSynthesis.speak(engSpeech);

  engSpeech.onend = () => {
    speechSynthesis.speak(malSpeech);
  };
};
 const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = input;

  // show user + typing
  setMessages((prev) => [
    ...prev,
    { type: "user", text: userMessage },
    { type: "bot", text: "⏳ Typing..." }
  ]);

  setInput("");

  // wait for UI update
  await new Promise((resolve) => setTimeout(resolve, 300));

  // ✅ FIRST get reply
  const reply = await sendMessageToAI(userMessage);
const cleanReply = reply.replace(/---/g, "\n\n");
speakText(cleanReply);
  // ✅ THEN speak
  speakText(reply);

  // replace typing
  setMessages((prev) => {
    const updated = [...prev];
    updated[updated.length - 1] = {
      type: "bot",
      text: reply,
    };
    return updated;
  });
};
  return (
    <div style={{
      width: "350px",
      height: "100%",
      background: "white",
      borderRadius: "15px",
      border: "2px solid green",
      display: "flex",
      flexDirection: "column"
    }}>
      
      {/* HEADER */}
      <div style={{ padding: "10px", fontWeight: "bold" }}>
        🌾 Krishi Sakhi AI
      </div>

      {/* MESSAGES */}
      <div style={{
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",  // 👈 ADD THIS
  padding: "10px"
}}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
  textAlign: msg.type === "user" ? "right" : "left",
  background: msg.type === "user" ? "#c8f7c5" : "#f1f1f1",
  margin: "5px",
  padding: "10px",
  borderRadius: "12px",
  maxWidth: "80%",
  wordWrap: "break-word",
   overflowWrap: "break-word",
      whiteSpace: "pre-line",
      lineHeight: "1.5",   // 👈 HERE
      fontSize: "14px"     // 👈 HERE
    }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div style={{
        display: "flex",
        borderTop: "1px solid #ddd"
      }}>
        <input
          type="text"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: "8px", border: "none" }}
        />

        <button onClick={handleSend} style={{
          background: "green",
          color: "white",
          border: "none",
          padding: "8px 12px"
        }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;