import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="logo">Krishi Sakhi</h2>
      </div>

      <div className="navbar-center">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/features">Features</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/soil-health">🧪 Soil Health</Link>

      </div>

      <div className="navbar-right">
        <button className="login-btn">Login</button>
      </div>
    </nav>
  );
}

export default Navbar;
