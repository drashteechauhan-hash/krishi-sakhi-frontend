import React, { useState } from "react";

const PAGE_CSS = `
// SAME CSS (copy again — or optionally move to common CSS later)
`;

export function Suggestions() {
  const TOPICS = ["New Feature", "UI Improvement", "Bug Report", "Crop Support", "Language Support", "Voice Feature", "Market Data", "Other"];
  const TOPIC_COLORS = ["#4caf65","#c47f1a","#ef4444","#22c55e","#8b5cf6","#f97316","#3b82f6","#6b7280"];

  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({ name:"", suggestion:"", priority:"medium" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = (t) => setSelected(s => s.includes(t) ? s.filter(x=>x!==t) : [...s, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      <style>{PAGE_CSS}</style>
      {/* FULL SAME JSX */}
    </>
  );
}

export default Suggestions;