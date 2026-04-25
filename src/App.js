// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Dashboard from "./pages/Dashboard/Dashboard";
import Activity from "./pages/Activity/Activity";
import Schemes from "./pages/Schemes/Schemes";
import Onboarding from "./pages/Onboarding/Onboarding";
import SoilHealthCard from "./components/SoilHealthCard/SoilHealthCard";
import Contact from "./pages/Contact/Contact";
import Suggestions from "./pages/Suggestions/Suggestions";
import Help from "./pages/Help/Help";
import SplashScreen from "./components/SplashScreen";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import LanguagePicker from "./components/LanguagePicker/LanguagePicker";
import Toolbar from "./components/Toolbar/Toolbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import FloatingChatbot from "./components/FloatingChatbot/FloatingChatbot";
import WeatherCornerWidget from "./components/WeatherCornerWidget/WeatherCornerWidget";
import Mandi from "./components/Mandi/Mandi";
import SellForm from "./components/Mandi/SellForm";



function AppInner({ showLogin, setShowLogin }) {
  const location = useLocation();
  const { lang } = useLanguage();
  const showWeather = !location.pathname.startsWith("/dashboard");

  return (
    <>
      <ScrollToTop />
      <Toolbar showLogin={showLogin} setShowLogin={setShowLogin} />
      <Routes>
        <Route path="/"            element={<Home showLogin={showLogin} setShowLogin={setShowLogin} />} />
        <Route path="/about"       element={<About />} />
        <Route path="/onboarding"  element={<Onboarding />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/activity"    element={<Activity />} />
        <Route path="/schemes"     element={<Schemes />} />
        <Route path="/soil-health" element={<SoilHealthCard />} />
        <Route path="/contact"     element={<Contact />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/help"        element={<Help />} />
        <Route path="/mandi" element={<Mandi />} />
<Route path="/mandi/sell" element={<SellForm />} />

      </Routes>
      <Footer />
      <FloatingChatbot />
      {showWeather && <WeatherCornerWidget lang={lang || "en"} />}
    </>
  );
}

function App() {
  const [showLogin, setShowLogin]   = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    document.title = "Krishi Sakhi";
    localStorage.removeItem("farmerData");
    localStorage.removeItem("profileCompleted");
  }, []);

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return (
    <LanguageProvider>
      <LanguagePicker />
      <Router>
        <AppInner showLogin={showLogin} setShowLogin={setShowLogin} />
      </Router>
    </LanguageProvider>
  );
}

export default App;