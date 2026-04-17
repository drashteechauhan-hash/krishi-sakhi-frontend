import React, { useState } from "react";
import axios from "axios";
<<<<<<< HEAD

export default function SignUp({ onClose, onSignup }) {
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

    // Client-side validation first
    if (name.trim().length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://krishi-sakhi-backend-6.onrender.com/api/auth/signup", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      const user = {
        name:  res.data.name,
        email: res.data.email,
        id:    res.data.id,
      };
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      // Remove any old profileCompleted so new user starts fresh
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
      <div style={{ fontSize: 52, marginBottom: 8 }}>✅</div>
      <h2 style={S.title}>Account Created!</h2>
      <p style={S.sub}>Welcome, {name.split(" ")[0]}! Redirecting…</p>
    </div>
  );

  return (
    <div style={S.wrap}>
      <div style={S.icon}>🌿</div>
      <h2 style={S.title}>Create Account</h2>
      <p style={S.sub}>Join Krishi Sakhi — your AI farming companion</p>

      {error && (
        <div style={S.err}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={S.form}>
        <div style={S.field}>
          <label style={S.label}>Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Drashtee Chauhan"
            style={S.input}
            onFocus={e => e.target.style.borderColor = "rgba(76,175,101,0.6)"}
            onBlur={e => e.target.style.borderColor = "rgba(196,127,26,0.25)"}
          />
        </div>

        <div style={S.field}>
          <label style={S.label}>Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={S.input}
            onFocus={e => e.target.style.borderColor = "rgba(76,175,101,0.6)"}
            onBlur={e => e.target.style.borderColor = "rgba(196,127,26,0.25)"}
          />
        </div>

        <div style={S.twoCol}>
          <div style={S.field}>
            <label style={S.label}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              style={{
                ...S.input,
                borderColor: confirm && password !== confirm ? "rgba(239,68,68,0.5)" : "rgba(196,127,26,0.25)"
              }}
              onFocus={e => e.target.style.borderColor = "rgba(76,175,101,0.6)"}
              onBlur={e => e.target.style.borderColor = confirm && password !== confirm ? "rgba(239,68,68,0.5)" : "rgba(196,127,26,0.25)"}
            />
          </div>
          <div style={S.field}>
            <label style={S.label}>Confirm Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat password"
              style={{
                ...S.input,
                borderColor: confirm && password !== confirm ? "rgba(239,68,68,0.5)" : "rgba(196,127,26,0.25)"
              }}
              onFocus={e => e.target.style.borderColor = "rgba(76,175,101,0.6)"}
              onBlur={e => e.target.style.borderColor = confirm && password !== confirm ? "rgba(239,68,68,0.5)" : "rgba(196,127,26,0.25)"}
            />
          </div>
        </div>

        {/* Live match indicator */}
        {confirm.length > 0 && (
          <div style={{
            fontSize: 11, fontFamily: "'Space Mono', monospace",
            color: password === confirm ? "#4caf65" : "#f87171",
            marginTop: -8,
          }}>
            {password === confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (confirm.length > 0 && password !== confirm)}
          style={{
            ...S.btn,
            opacity: loading || (confirm.length > 0 && password !== confirm) ? 0.6 : 1,
            cursor: loading || (confirm.length > 0 && password !== confirm) ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating account…" : "Create Account →"}
        </button>
      </form>
=======
import "../../components/Toolbar/Toolbar.css";

function SignUp({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await axios.post("http://localhost:8080/api/auth/signup", formData);
    localStorage.setItem("loggedInUser", JSON.stringify(response.data));
    onSignup(response.data); // ✅ Update Toolbar state
    alert("Signup successful!");
    onClose();
  } catch (err) {
    if (err.response && err.response.data) {
      alert(err.response.data.error);
    } else {
      alert("Network error: " + err.message);
    }
  }
};



  return (
    <div className="signup-modal-overlay">
      <div className="signup-modal">
        <span className="signup-close-btn" onClick={onClose}>✖</span>
        <div className="signup-header">Create Account / അക്കൗണ്ട് സൃഷ്ടിക്കുക</div>

        <form onSubmit={handleSubmit}>
          <label>Name / പേര്</label>
          <input name="name" value={formData.name} onChange={handleChange} required />

          <label>Email / ഇമെയിൽ</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Password / പാസ്‌വേഡ്</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          <label>Confirm Password / പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

          <button type="submit">Sign Up / സൈൻ അപ്പ്</button>
        </form>
      </div>
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
    </div>
  );
}

<<<<<<< HEAD
const S = {
  wrap: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "4px 0 8px", gap: 12,
    fontFamily: "'DM Sans', 'Noto Sans Malayalam', sans-serif",
    width: "100%",
  },
  icon:  { fontSize: 38, marginBottom: 2 },
  title: { fontSize: "1.55rem", fontWeight: 700, color: "#f0e8d5", margin: 0 },
  sub:   { fontSize: 13, color: "rgba(240,232,213,0.5)", margin: 0, textAlign: "center" },
  err: {
    background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)",
    color: "#fca5a5", borderRadius: 10, padding: "10px 16px",
    fontSize: 13, width: "100%", textAlign: "center", lineHeight: 1.5,
    fontFamily: "'DM Sans', sans-serif",
  },
  form:   { width: "100%", display: "flex", flexDirection: "column", gap: 14 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field:  { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: 10, fontWeight: 700, color: "rgba(240,232,213,0.55)",
    letterSpacing: "1px", textTransform: "uppercase",
    fontFamily: "'Space Mono', monospace",
  },
  input: {
    padding: "11px 14px", borderRadius: 10,
    border: "1px solid rgba(196,127,26,0.25)",
    background: "rgba(255,255,255,0.04)", color: "#f0e8d5",
    fontSize: 14, fontFamily: "'DM Sans', sans-serif",
    outline: "none", transition: "border-color 0.2s",
    width: "100%",
  },
  btn: {
    padding: "13px 0", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg, #2e6b3e, #4caf65)", color: "#fff",
    fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
    marginTop: 4, transition: "all 0.2s",
  },
};
=======
export default SignUp;
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
