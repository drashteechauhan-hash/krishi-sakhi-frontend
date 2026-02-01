import React, { useState } from "react";
import axios from "axios";
import "./Toolbar.css";

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
    </div>
  );
}

export default SignUp;
