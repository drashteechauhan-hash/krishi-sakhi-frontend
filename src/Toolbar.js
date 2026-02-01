import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import "./Toolbar.css";
import logo from "./logo.jpg";
import Login from "./Login"; 
import SignUp from "./SignUp"; 

function Toolbar() {
  const location = useLocation();
  const profileCompleted = JSON.parse(localStorage.getItem("profileCompleted"));

  // ✅ Hooks must be inside the component
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("loggedInUser");
  window.location.reload(); // refresh UI to clear dashboard
};


  const getActiveClass = (path) => (location.pathname === path ? "active" : "");

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-left">
          <img src={logo} alt="Logo" className="toolbar-logo" />
          <span className="site-name">Krishi Sakhi</span>
        </div>

        <div className="toolbar-center">
          <Link className={getActiveClass("/")} to="/">Home</Link>
          <Link className={getActiveClass("/about")} to="/about">About</Link>
          <Link className={getActiveClass("/onboarding")} to="/onboarding">Profile</Link>
          <Link className={getActiveClass("/schemes")} to="/schemes">Schemes</Link>
          {profileCompleted ? (
            <Link className={getActiveClass("/dashboard")} to="/dashboard">Dashboard</Link>
          ) : (
            <span className="disabled">Dashboard</span>
          )}
          <Link className={getActiveClass("/activity")} to="/activity">Activity</Link>
        </div>

        <div className="toolbar-right" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {user ? (
            <>
              <span style={{ color: "#8ef494ff" }}>✅ You already have a profile</span>
              <button className="auth-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="auth-btn" onClick={() => setShowLogin(true)}>Login</button>
              <button className="auth-btn" onClick={() => setShowSignUp(true)}>Sign Up</button>
            </>
          )}

          <div className="more-dropdown" style={{ position: "relative" }}>
            <FiMoreVertical
              size={25}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ cursor: "pointer" }}
            />
            {dropdownOpen && (
              <div className="dropdown-menu" style={{
                position: "absolute",
                top: "30px",
                right: "0",
                background: "white",
                borderRadius: "5px",
                boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                minWidth: "150px",
                zIndex: 10
              }}>
                <Link to="/contact" onClick={() => setDropdownOpen(false)}>Contact Us</Link>
                <Link to="/suggestions" onClick={() => setDropdownOpen(false)}>Suggestions</Link>
                <Link to="/help" onClick={() => setDropdownOpen(false)}>Help</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
{showLogin && (
  <div className="modal-overlay">
    <div className="modal-content">
      <IoClose size={30} className="close-btn" onClick={() => setShowLogin(false)} />
      <Login 
        onClose={() => setShowLogin(false)} 
        onLogin={(loggedInUser) => setUser(loggedInUser)} 
      />
    </div>
  </div>
)}

{showSignUp && (
  <div className="modal-overlay">
    <div className="modal-content signup">
      <IoClose size={30} className="close-btn" onClick={() => setShowSignUp(false)} />
      <SignUp 
        onClose={() => setShowSignUp(false)} 
        onSignup={(loggedInUser) => setUser(loggedInUser)} 
      />
    </div>
  </div>
)}

    </>
  );
}

export default Toolbar;


