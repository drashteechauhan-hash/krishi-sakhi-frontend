import React, { useEffect, useState, useRef } from "react";
import WeatherWidget from "./WeatherWidget";
import axios from "axios";
import "./Dashboard.css";

import leftImg from "./leftImage.jpg";
import rightImg from "./rightImage.jpg";

function Dashboard() {
  const [farmers, setFarmers] = useState([]);
  const [latestFarmer, setLatestFarmer] = useState(null);
  const weatherRef = useRef();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    if (loggedInUser) {
      fetchFarmers();
    } else {
      setFarmers([]);
      setLatestFarmer(null);
    }
  }, [loggedInUser]);

  const fetchFarmers = async () => {
    try {
      const email = loggedInUser?.email;
      const res = await axios.get(
        `http://localhost:8080/api/farmers?email=${email}`
      );

      if (res.data && res.data.length > 0) {
        const uniqueFarmers = Array.from(
          new Map(
            res.data.map((f) => [
              `${f.name}-${f.location}-${f.crop}-${f.landsize}`,
              f,
            ])
          ).values()
        );

        setFarmers(uniqueFarmers);
        setLatestFarmer(uniqueFarmers[uniqueFarmers.length - 1]);
      } else {
        setFarmers([]);
        setLatestFarmer(null);
      }
    } catch (err) {
      console.error("Error fetching farmers:", err);
      setFarmers([]);
      setLatestFarmer(null);
    }
  };

  if (!loggedInUser) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">🌾 Krishi Sakhi Dashboard</h2>
        <p style={{ textAlign: "center", marginTop: "30px", color: "#777" }}>
          Please login to view your farmer profiles 🌱
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">🌾 Krishi Sakhi Dashboard</h2>

      <div className="profile-card-wrapper">
        <img src={leftImg} alt="Left" className="floating-img left" />
        <img src={rightImg} alt="Right" className="floating-img right" />

        {latestFarmer && (
          <div className="latest-profile-card">
            <h3>👨‍🌾 Latest Profile</h3>
            <div className="farmer-details">
              <p><b>Name:</b> {latestFarmer.name}</p>
              <p><b>Location:</b> {latestFarmer.location}</p>
              <p><b>Land Size:</b> {latestFarmer.landsize} acres</p>
              <p><b>Crop:</b> {latestFarmer.crop}</p>
              <p><b>Soil:</b> {latestFarmer.soiltype}</p>
              <p><b>Irrigation:</b> {latestFarmer.irrigationtype}</p>
            </div>

            <WeatherWidget ref={weatherRef} city={latestFarmer.location} />
            <button
              className="stop-alerts-btn"
              onClick={() => weatherRef.current?.stopAlerts()}
            >
              ⛔ Stop Alerts
            </button>
          </div>
        )}
      </div>

      <div className="table-container">
        <h3 className="table-title">📋 All Farmer Profiles</h3>
        <table className="farmer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Land Size (acres)</th>
              <th>Crop</th>
              <th>Soil Type</th>
              <th>Irrigation</th>
            </tr>
          </thead>
          <tbody>
            {farmers.length > 0 ? (
              farmers.map((f) => (
                <tr key={f.id}>
                  <td>{f.name}</td>
                  <td>{f.location}</td>
                  <td>{f.landsize}</td>
                  <td>{f.crop}</td>
                  <td>{f.soiltype}</td>
                  <td>{f.irrigationtype}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                  No profiles found. Create one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;

