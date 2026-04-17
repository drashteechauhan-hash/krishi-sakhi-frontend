import React, { useState } from "react";
import axios from "axios";
<<<<<<< HEAD

export default function Login({ onClose, onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("https://krishi-sakhi-backend-6.onrender.com/api/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });
      const user = {
        name:  res.data.name,
        email: res.data.email,
        id:    res.data.id,
      };
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      onLogin(user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.wrap}>
      <div style={S.icon}>🌾</div>
      <h2 style={S.title}>Welcome Back</h2>
      <p style={S.sub}>Login to access your farming dashboard</p>

      {error && (
        <div style={S.err}>⚠️ {error}</div>
      )}

      <form onSubmit={handleSubmit} style={S.form}>
        <div style={S.field}>
          <label style={S.label}>Email Address</label>
          <input
            type="email" required value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={S.input}
            onFocus={e => e.target.style.borderColor = "rgba(76,175,101,0.6)"}
            onBlur={e => e.target.style.borderColor = "rgba(196,127,26,0.25)"}
          />
        </div>
        <div style={S.field}>
          <label style={S.label}>Password</label>
          <input
            type="password" required value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={S.input}
            onFocus={e => e.target.style.borderColor = "rgba(76,175,101,0.6)"}
            onBlur={e => e.target.style.borderColor = "rgba(196,127,26,0.25)"}
          />
        </div>
        <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Logging in…" : "Login →"}
        </button>
      </form>
=======
import "../../components/Toolbar/Toolbar.css";

function Login({ onClose, onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", formData);

    // ✅ SAVE USER
    localStorage.setItem("loggedInUser", JSON.stringify(response.data));

    // ✅ ADD THIS LINE (IMPORTANT)
    localStorage.setItem("isLoggedIn", "true");

    onLogin(response.data);

    alert("Login successful!");
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
    <div className="login-modal-overlay">
      <div className="login-modal">
        <span className="login-close-btn" onClick={onClose}>✖</span>
        <h2 style={{ marginBottom: "20px", textAlign: "center", color: "#2e7d32" }}>
          Login / ലോഗിൻ
        </h2>

        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <label style={{ marginTop: "10px" }}>Email / ഇമെയിൽ</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label style={{ marginTop: "10px" }}>Password / പാസ്‌വേഡ്</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" style={{ marginTop: "20px" }}>Login / ലോഗിൻ</button>
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
    fontSize: 13, width: "100%", textAlign: "center",
    fontFamily: "'DM Sans', sans-serif",
  },
  form:  { width: "100%", display: "flex", flexDirection: "column", gap: 14 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
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
    outline: "none", transition: "border-color 0.2s", width: "100%",
  },
  btn: {
    padding: "13px 0", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg, #2e6b3e, #4caf65)", color: "#fff",
    fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
    marginTop: 4, cursor: "pointer",
  },
};
=======
export default Login;

>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
