import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Dashboard from "./pages/Dashboard/Dashboard";
import Activity from "./pages/Activity/Activity";
import Schemes from "./pages/Schemes/Schemes";
import Onboarding from "./pages/Onboarding/Onboarding";

// components
import Toolbar from "./components/Toolbar/Toolbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import FloatingChatbot from "./components/FloatingChatbot/FloatingChatbot";

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
