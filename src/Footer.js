import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#">Terms & Conditions</a> | 
        <a href="#">Disclaimer</a> | 
        <a href="#">Related Links</a> | 
        <a href="#">Website Policy</a> | 
        <a href="#">Help</a> | 
        <a href="#">Accessibility Statement</a> | 
        <a href="#">Privacy Policy</a>
      </div>

      <div className="footer-text">
        <p>
          🌾 <b>AI-Powered Personal Farming Assistant</b> – Providing Kerala farmers with
          real-time crop insights, voice support in Malayalam, and market guidance.
        </p>
        <p>
          Designed and developed by <b>SIH Team 2025</b>  
          | Supported by Department of Agriculture Development & Farmers’ Welfare, Govt. of Kerala
        </p>
        <p>© 2025 Krishi Sakhi | All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
