import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useLanguage } from "../../context/LanguageContext";

export default function Login({ onClose, onLogin }) {
  const { t } = useLanguage();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setError("⚠️ Pehle email verify karo! Inbox check karo.");
        } else {
          setError("Invalid email or password.");
        }
        return;
      }

      const user = {
        name: data.user.user_metadata?.name || email.split("@")[0],
        email: data.user.email,
        id: data.user.id
      };

      localStorage.setItem("loggedInUser", JSON.stringify(user));
      if (onLogin) onLogin(user);
      onClose();
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.wrap}>
      <div style={S.icon}>🌾</div>
      <h2 style={S.title}>{t("login_title")}</h2>
      <p style={S.sub}>{t("login_sub")}</p>
      {error && <div style={S.err}>⚠️ {error}</div>}
      <form onSubmit={handleSubmit} style={S.form}>
        <div style={S.field}>
          <label style={S.label}>{t("login_email")}</label>
          <input type="email" required value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com" style={S.input}
            onFocus={e => e.target.style.borderColor="rgba(76,175,101,0.6)"}
            onBlur={e => e.target.style.borderColor="rgba(196,127,26,0.25)"} />
        </div>
        <div style={S.field}>
          <label style={S.label}>{t("login_password")}</label>
          <input type="password" required value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" style={S.input}
            onFocus={e => e.target.style.borderColor="rgba(76,175,101,0.6)"}
            onBlur={e => e.target.style.borderColor="rgba(196,127,26,0.25)"} />
        </div>
        <button type="submit" disabled={loading}
          style={{...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer"}}>
          {loading ? t("login_loading") : t("login_btn")}
        </button>
      </form>
    </div>
  );
}

const S = {
  wrap:  { display:"flex", flexDirection:"column", alignItems:"center", padding:"4px 0 8px", gap:12, fontFamily:"'DM Sans',sans-serif", width:"100%" },
  icon:  { fontSize:38, marginBottom:2 },
  title: { fontSize:"1.55rem", fontWeight:700, color:"#f0e8d5", margin:0 },
  sub:   { fontSize:13, color:"rgba(240,232,213,0.5)", margin:0, textAlign:"center" },
  err:   { background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.35)", color:"#fca5a5", borderRadius:10, padding:"10px 16px", fontSize:13, width:"100%", textAlign:"center", fontFamily:"'DM Sans',sans-serif" },
  form:  { width:"100%", display:"flex", flexDirection:"column", gap:14 },
  field: { display:"flex", flexDirection:"column", gap:6 },
  label: { fontSize:10, fontWeight:700, color:"rgba(240,232,213,0.55)", letterSpacing:"1px", textTransform:"uppercase", fontFamily:"'Space Mono',monospace" },
  input: { padding:"11px 14px", borderRadius:10, border:"1px solid rgba(196,127,26,0.25)", background:"rgba(255,255,255,0.04)", color:"#f0e8d5", fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", transition:"border-color 0.2s", width:"100%" },
  btn:   { padding:"13px 0", borderRadius:10, border:"none", background:"linear-gradient(135deg,#2e6b3e,#4caf65)", color:"#fff", fontSize:15, fontWeight:700, fontFamily:"'DM Sans',sans-serif", marginTop:4 },
};