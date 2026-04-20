import React, { useState } from "react";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext";

export default function SignUp({ onClose, onSignup }) {
  const { t } = useLanguage();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2)   { setError("Please enter your full name."); return; }
    if (password.length < 6)       { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm)      { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await axios.post(
        "https://krishi-sakhi-backend-6.onrender.com/api/auth/signup",
        { name: name.trim(), email: email.trim().toLowerCase(), password }
      );
      const user = { name: res.data.name, email: res.data.email, id: res.data.id };
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      localStorage.removeItem("profileCompleted");
      setSuccess(true);
      onSignup(user);
      setTimeout(() => onClose(), 1400);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={S.wrap}>
      <div style={{fontSize:52,marginBottom:8}}>✅</div>
      <h2 style={S.title}>{t("signup_success_title")}</h2>
      <p style={S.sub}>Welcome, {name.split(" ")[0]}!</p>
    </div>
  );

  return (
    <div style={S.wrap}>
      <div style={S.icon}>🌿</div>
      <h2 style={S.title}>{t("signup_title")}</h2>
      <p style={S.sub}>{t("signup_sub")}</p>
      {error && <div style={S.err}>⚠️ {error}</div>}
      <form onSubmit={handleSubmit} style={S.form}>
        <div style={S.field}>
          <label style={S.label}>{t("signup_name")}</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Drashtee Chauhan" style={S.input} onFocus={e => e.target.style.borderColor="rgba(76,175,101,0.6)"} onBlur={e => e.target.style.borderColor="rgba(196,127,26,0.25)"} />
        </div>
        <div style={S.field}>
          <label style={S.label}>{t("signup_email")}</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={S.input} onFocus={e => e.target.style.borderColor="rgba(76,175,101,0.6)"} onBlur={e => e.target.style.borderColor="rgba(196,127,26,0.25)"} />
        </div>
        <div style={S.twoCol}>
          <div style={S.field}>
            <label style={S.label}>{t("signup_password")}</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" style={S.input} onFocus={e => e.target.style.borderColor="rgba(76,175,101,0.6)"} onBlur={e => e.target.style.borderColor="rgba(196,127,26,0.25)"} />
          </div>
          <div style={S.field}>
            <label style={S.label}>{t("signup_confirm")}</label>
            <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" style={S.input} onFocus={e => e.target.style.borderColor="rgba(76,175,101,0.6)"} onBlur={e => e.target.style.borderColor="rgba(196,127,26,0.25)"} />
          </div>
        </div>
        {confirm.length > 0 && (
          <div style={{fontSize:11,fontFamily:"'Space Mono',monospace",color: password === confirm ? "#4caf65" : "#f87171"}}>
            {password === confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
          </div>
        )}
        <button type="submit" disabled={loading || (confirm.length > 0 && password !== confirm)} style={{...S.btn, opacity: loading || (confirm.length > 0 && password !== confirm) ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer"}}>
          {loading ? t("signup_loading") : t("signup_btn")}
        </button>
      </form>
    </div>
  );
}

const S = {
  wrap:   { display:"flex", flexDirection:"column", alignItems:"center", padding:"4px 0 8px", gap:12, fontFamily:"'DM Sans',sans-serif", width:"100%" },
  icon:   { fontSize:38, marginBottom:2 },
  title:  { fontSize:"1.55rem", fontWeight:700, color:"#f0e8d5", margin:0 },
  sub:    { fontSize:13, color:"rgba(240,232,213,0.5)", margin:0, textAlign:"center" },
  err:    { background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.35)", color:"#fca5a5", borderRadius:10, padding:"10px 16px", fontSize:13, width:"100%", textAlign:"center" },
  form:   { width:"100%", display:"flex", flexDirection:"column", gap:14 },
  twoCol: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
  field:  { display:"flex", flexDirection:"column", gap:6 },
  label:  { fontSize:10, fontWeight:700, color:"rgba(240,232,213,0.55)", letterSpacing:"1px", textTransform:"uppercase", fontFamily:"'Space Mono',monospace" },
  input:  { padding:"11px 14px", borderRadius:10, border:"1px solid rgba(196,127,26,0.25)", background:"rgba(255,255,255,0.04)", color:"#f0e8d5", fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", transition:"border-color 0.2s", width:"100%" },
  btn:    { padding:"13px 0", borderRadius:10, border:"none", background:"linear-gradient(135deg,#2e6b3e,#4caf65)", color:"#fff", fontSize:15, fontWeight:700, fontFamily:"'DM Sans',sans-serif", marginTop:4 },
};