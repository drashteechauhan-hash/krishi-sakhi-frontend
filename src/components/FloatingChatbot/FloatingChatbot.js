import React, { useState } from "react";
import Chatbot from "../Chatbot/Chatbot";
import "./FloatingChatbot.css";
const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="floating-chat-window">
          <Chatbot />
        </div>
      )}

      <div className="floating-chat-icon" onClick={() => setOpen(!open)}>
        💬
      </div>
    </>
  );
};

export default FloatingChatbot;
