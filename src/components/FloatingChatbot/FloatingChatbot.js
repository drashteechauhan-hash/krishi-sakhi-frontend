<<<<<<< HEAD
import React from "react";
import Chatbot from "../Chatbot/Chatbot";

const FloatingChatbot = () => {
  return <Chatbot />;
};

export default FloatingChatbot;
=======
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
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
