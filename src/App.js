import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Onboarding from "./Onboarding";
import Dashboard from "./Dashboard";
import Activity from "./Activity";
import About from "./About";
import Toolbar from "./Toolbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import Schemes from "./Schemes";
import FloatingChatbot from "./FloatingChatbot";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  // Optional: clear profile on mount
  useEffect(() => {
    localStorage.removeItem("farmerData");
    localStorage.removeItem("profileCompleted");
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Toolbar showLogin={showLogin} setShowLogin={setShowLogin} />

      <Routes>
        <Route path="/" element={<Home showLogin={showLogin} setShowLogin={setShowLogin} />} />
        <Route path="/about" element={<About />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/schemes" element={<Schemes />} />
      </Routes>

      <Footer />
            <FloatingChatbot />

    </Router>
  );
}

export default App;
