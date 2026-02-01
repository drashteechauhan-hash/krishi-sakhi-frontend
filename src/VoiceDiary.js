import React, { useState, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";

function VoiceDiaryInput({ value, onChange }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition!");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ml-IN"; // Malayalam
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onChange(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        placeholder="E.g. I sowed paddy today / നിങ്ങളുടെ പ്രവൃത്തി ടൈപ്പ് ചെയ്യുക"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 40px 10px 15px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />
      <FaMicrophone
        onClick={startListening}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: listening
            ? "translateY(-50%) scale(1.3)"
            : "translateY(-50%) scale(1)",
          cursor: "pointer",
          color: listening ? "#e53935" : "#2e7d32", // red when recording
          transition: "transform 0.2s, color 0.2s",
        }}
      />
    </div>
  );
}

export default VoiceDiaryInput;
