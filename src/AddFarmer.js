import React, { useState } from "react";
import axios from "axios";

function AddFarmer({ onAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    landsize: "",
    crop: "",
    soiltype: "",
    irrigationtype: "",
  });

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFarmer = {
      ...formData,
      email: loggedInUser?.email, // ✅ save user email
    };

    try {
      await axios.post("http://localhost:8080/api/farmers", newFarmer);
      alert("Farmer added successfully!");
      setFormData({
        name: "",
        location: "",
        landsize: "",
        crop: "",
        soiltype: "",
        irrigationtype: "",
      });
      onAdded(); // refresh list after adding
    } catch (err) {
      console.error("Error adding farmer:", err);
    }
  };

  return (
    <div className="add-farmer-form">
      <h3>🌾 Add Farmer Profile</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input name="landsize" type="number" placeholder="Land Size (acres)" value={formData.landsize} onChange={handleChange} required />
        <input name="crop" placeholder="Crop" value={formData.crop} onChange={handleChange} required />
        <input name="soiltype" placeholder="Soil Type" value={formData.soiltype} onChange={handleChange} required />
        <input name="irrigationtype" placeholder="Irrigation Type" value={formData.irrigationtype} onChange={handleChange} required />
        <button type="submit">Add Farmer</button>
      </form>
    </div>
  );
}

export default AddFarmer;
