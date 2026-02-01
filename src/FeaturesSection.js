import React from "react";
import "./FeaturesSection.css";
import { FaUserPlus, FaChartBar, FaClock, FaRobot, FaMicrophone, FaRupeeSign } from "react-icons/fa";

function FeaturesSection() {
  const features = [
    {
      icon: <FaUserPlus />,
      title: "Easy Registration",
      desc: "One-time registration facility for farmers to get started quickly."
    },
    {
      icon: <FaChartBar />,
      title: "Dashboard Reports",
      desc: "Personalized dashboard with insights and services for farmers."
    },
    {
      icon: <FaClock />,
      title: "Access 24x7",
      desc: "Apply for services and check status anytime, anywhere."
    },
    {
      icon: <FaRobot />,
      title: "AI Farming Tips",
      desc: "Get personalized crop, irrigation, and pest control advice powered by AI."
    },
    {
      icon: <FaMicrophone />,
      title: "Voice Assistance",
      desc: "Use Malayalam voice input to add data and get instant guidance."
    },
    
  ];

  return (
    <div className="features-section">
      {features.map((f, idx) => (
        <div className="feature-card" key={idx}>
          <div className="icon">{f.icon}</div>
          <h4>{f.title}</h4>
          <p>{f.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default FeaturesSection;
