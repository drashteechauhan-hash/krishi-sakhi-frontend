import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";
import Login from "./Login";
import ImageSlider from "./ImageSlider";
import FeaturesSection from "./FeaturesSection";

function Home({ showLogin, setShowLogin }) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/onboarding");
  };

  return (
    <div className="hero">
      {/* Login modal overlay */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}

      <motion.h1 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.8 }}
      >
        Your Digital Farming Companion <br/> 
        <span className="ml-text">നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി സഹായി</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.5 }}
      >
        Personalized, AI-powered advice for every farmer.<br/>
        Get timely guidance, reminders, and insights for your crops.<br/>
        <span className="ml-text">
          ഓരോ കർഷകനും വ്യക്തിഗതമായ, AI-പ്രേരിത ഉപദേശം. 
          സമയോചിതമായ നിർദ്ദേശങ്ങൾ, ഓർമ്മപ്പെടുത്തലുകൾ, വിളകൾക്ക് ഇൻസൈറ്റുകൾ.
        </span>
      </motion.p>

      <motion.button 
        className="cta-btn"
        onClick={handleGetStarted}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started / തുടക്കം കുറിക്കുക 
      </motion.button>

      {/* Image slider */}
      <ImageSlider />
      <FeaturesSection />
    </div>
  );
}

export default Home;




