import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Dashboard from "./pages/Dashboard/Dashboard";
import Activity from "./pages/Activity/Activity";
import Schemes from "./pages/Schemes/Schemes";
import Onboarding from "./pages/Onboarding/Onboarding";
<<<<<<< HEAD
import SoilHealthCard from "./components/SoilHealthCard/SoilHealthCard";
import Contact from "./pages/Contact/Contact";
import Suggestions from "./pages/Suggestions/Suggestions";
import Help from "./pages/Help/Help";
import SplashScreen from "./components/SplashScreen";

// ✅ NEW IMPORTS (Language System)
import { LanguageProvider } from "./context/LanguageContext";
import LanguagePicker from "./components/LanguagePicker/LanguagePicker";
=======
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b

// components
import Toolbar from "./components/Toolbar/Toolbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import FloatingChatbot from "./components/FloatingChatbot/FloatingChatbot";

function App() {
  const [showLogin, setShowLogin] = useState(false);
<<<<<<< HEAD
  const [splashDone, setSplashDone] = useState(false);

=======

  // Optional: clear profile on mount
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
  useEffect(() => {
    localStorage.removeItem("farmerData");
    localStorage.removeItem("profileCompleted");
  }, []);

<<<<<<< HEAD
  // 🔥 KEEP splash logic SAME
  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return (
    // ✅ WRAP EVERYTHING INSIDE LanguageProvider
    <LanguageProvider>

      {/* ✅ Language popup (first visit only) */}
      <LanguagePicker />

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
          <Route path="/soil-health" element={<SoilHealthCard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/help" element={<Help />} />
        </Routes>

        <Footer />
        <FloatingChatbot />
      </Router>

    </LanguageProvider>
  );
}

export default App;
=======
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
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
