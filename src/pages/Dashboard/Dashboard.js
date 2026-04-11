import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

import WeatherWidget from "../../components/WeatherWidget/WeatherWidget";
import MarketPrice from "../../components/charts/MarketPrice";
import MarketChart from "../../components/charts/MarketChart";
import CropPieChart from "../../components/charts/CropPieChart";
import AnimatedCard from "../../components/AnimatedCard/AnimatedCard";

import leftImg from "../../assets/leftImage.jpg";
import rightImg from "../../assets/rightImage.jpg";

function Dashboard() {
  const [farmers, setFarmers] = useState([]);
  const [latestFarmer, setLatestFarmer] = useState(null);

  // ✅ LOGIN CHECK STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
  const user = localStorage.getItem("loggedInUser");

  if (user) {
    setIsLoggedIn(true);
    fetchFarmers();
  } else {
    setIsLoggedIn(false);
  }
}, []);
  const fetchFarmers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/farmers");

      const valid = res.data.filter((f) => f.name && f.location);

      setFarmers(valid);

      const sorted = valid.sort((a, b) => b.id - a.id);
      setLatestFarmer(sorted[0]);
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ NOT LOGGED IN → SHOW MESSAGE
  if (!isLoggedIn) {
    return (
      <div style={{
        textAlign: "center",
        marginTop: "100px",
        fontSize: "22px",
        color: "#2e7d32"
      }}>
        🔒 Please login first to access Dashboard
      </div>
    );
  }

  // ✅ LOGGED IN → SHOW DASHBOARD
  return (
    <div className="dashboard-container">

      {latestFarmer && (
        <AnimatedCard>
          <div className="profile-card-wrapper">

            <img src={leftImg} alt="left" className="floating-img" />

            <div className="profile-card">
              <h2>👨‍🌾 Latest Profile</h2>
              <p><b>Name:</b> {latestFarmer.name}</p>
              <p><b>Location:</b> {latestFarmer.location}</p>
              <p><b>Crop:</b> {latestFarmer.crop}</p>
              <p><b>Soil:</b> {latestFarmer.soilType ?? "N/A"}</p>
              <p><b>Irrigation:</b> {latestFarmer.irrigationType ?? "N/A"}</p>
            </div>

            <img src={rightImg} alt="right" className="floating-img" />

          </div>
        </AnimatedCard>
      )}

      <div className="top-cards">
        <AnimatedCard>
          <WeatherWidget city={latestFarmer?.location || "Delhi"} />
        </AnimatedCard>

        <AnimatedCard>
          <MarketPrice
            crop={latestFarmer?.crop}
            state={latestFarmer?.location}
          />
        </AnimatedCard>
      </div>

      <AnimatedCard>
        <div className="chart-box">
          <MarketChart price={2000} />
        </div>
      </AnimatedCard>

      <AnimatedCard>
        <div className="chart-box">
          <CropPieChart />
        </div>
      </AnimatedCard>

      <div className="table-section">
        <h3>📋 All Farmer Profiles</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Crop</th>
              <th>Soil</th>
              <th>Irrigation</th>
            </tr>
          </thead>

          <tbody>
            {farmers.map((f) => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{f.location}</td>
                <td>{f.crop}</td>
                <td>{f.soilType ?? "N/A"}</td>
                <td>{f.irrigationType ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Dashboard;