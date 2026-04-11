import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Onboarding.css";

import bgImage from "../../assets/bg.jpg";
function Onboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    landSize: "",
    crop: "",
    soilType: "",
    irrigationType: ""
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

   const payload = {
  name: formData.name,
  location: formData.location,
  landsize: parseFloat(formData.landSize),
  crop: formData.crop,
  soiltype: formData.soilType,
  irrigationtype: formData.irrigationType
};

try {
  const response = await axios.post("http://localhost:8080/api/farmers", payload);
  alert("Farmer profile saved successfully!");
  navigate("/dashboard");
} catch (error) {
  console.error(error.response ? error.response.data : error);
  alert("Error saving farmer data. Please try again later.");
}

  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const formSection = document.querySelector(".form-section");
      if (formSection) {
        window.scrollTo({
          top: formSection.offsetTop,
          behavior: "smooth",
        });
      }
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="onboarding-container">
      {/* Hero Section */}
      <section className="hero-section" style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        <video autoPlay loop muted className="bg-video" style={{ width: "100%", objectFit: "cover" }}>
          <source src="/farm.mp4" type="video/mp4" />
        </video>

        <div className="overlay" style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(46,125,50,0.6)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          color: "#fff",
          textAlign: "center",
          paddingTop: "120px",
          paddingLeft: "20px",
          paddingRight: "20px"
        }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "15px" }}>
            🌱 Start Your Journey with Krishi Sakhi
          </h1>
          <h2 style={{ fontSize: "2rem", color: "#d4f4dd", marginBottom: "20px" }}>
            🌱 കൃഷി സഹകാരണിയുമായി നിങ്ങളുടെ യാത്ര ആരംഭിക്കുക
          </h2>
          <p style={{ fontSize: "1.3rem", marginBottom: "30px", lineHeight: "1.6" }}>
            Empowering farmers through digital innovation <br />
            ഡിജിറ്റൽ നവീകരണത്തിലൂടെ കർഷകർക്ക് ശക്തി നൽകുന്നു
          </p>
          <div className="scroll-indicator" style={{ fontSize: "1.2rem", color: "#e0f7e0" }}>
            ⬇ Scroll Down / താഴേക്ക് സ്ക്രോൾ ചെയ്യുക
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section
        className="form-section"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3), rgba(255,255,255,0.1)), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "#2e7d32",
          padding: "50px 20px",
          width: "100%",
        }}
      >
        <div className="form-overlay" style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "rgba(255,255,255,0.8)",
          padding: "30px",
          borderRadius: "12px"
        }}>
          <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
            Farmer Onboarding / കർഷക പ്രൊഫൈലിംഗ്
          </h2>

          <form onSubmit={handleSubmit} className="profile-form" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <label>Name / പേര്</label>
            <input name="name" value={formData.name} onChange={handleChange} required />

            <label>Location / സ്ഥലം</label>
            <input name="location" value={formData.location} onChange={handleChange} required />

            <label>Land Size (acres) / ഭൂമിയുടെ വലിപ്പം</label>
            <input name="landSize" value={formData.landSize} onChange={handleChange} required />

            <label>Crop / വിള</label>
            <input name="crop" value={formData.crop} onChange={handleChange} required />

            <label>Soil Type / മണ്ണിന്റെ തരം</label>
            <input name="soilType" value={formData.soilType} onChange={handleChange} required />

            <label>Irrigation Type / ജലസേചന സംവിധാനം</label>
            <input name="irrigationType" value={formData.irrigationType} onChange={handleChange} required />

            <button type="submit" style={{
              marginTop: "20px",
              padding: "12px",
              backgroundColor: "#2e7d32",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem"
            }}>
              Save & Continue / സേവ് & തുടരുക
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Onboarding;

