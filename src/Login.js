import React, { useState } from "react";
import axios from "axios";
import "./Toolbar.css"; // modal styles

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
    </div>
  );
}

export default Login;

