import React, { useState } from "react";
import axios from "axios";
<<<<<<< HEAD
import { useLanguage } from "../../context/LanguageContext";

function AddFarmer({ onAdded }) {
  const { lang } = useLanguage();

  const TEXT = {
    en: {
      title: "Add Farmer Profile",
      name: "Name",
      location: "Location",
      land: "Land Size (acres)",
      crop: "Crop",
      soil: "Soil Type",
      irrigation: "Irrigation Type",
      btn: "Add Farmer"
    },
    ml: {
      title: "കർഷക പ്രൊഫൈൽ ചേർക്കുക",
      name: "പേര്",
      location: "സ്ഥലം",
      land: "ഭൂമി (ഏക്കർ)",
      crop: "വിള",
      soil: "മണ്ണ്",
      irrigation: "ജലസേചനം",
      btn: "ചേർക്കുക"
    }
  };

  const t = TEXT[lang] || TEXT.en;

  const [formData, setFormData] = useState({
    name: "", location: "", landsize: "", crop: "", soiltype: "", irrigationtype: ""
=======

function AddFarmer({ onAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    landsize: "",
    crop: "",
    soiltype: "",
    irrigationtype: "",
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
  });

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("/api/farmer", {
      ...formData,
      email: loggedInUser?.email,
    });

    onAdded();
=======
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
      await axios.post("/api/farmer", newFarmer);
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
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
  };

  return (
    <div className="add-farmer-form">
<<<<<<< HEAD
      <h3>🌾 {t.title}</h3>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder={t.name} onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
        <input name="location" placeholder={t.location} onChange={(e)=>setFormData({...formData,location:e.target.value})}/>
        <input name="landsize" placeholder={t.land} onChange={(e)=>setFormData({...formData,landsize:e.target.value})}/>
        <input name="crop" placeholder={t.crop} onChange={(e)=>setFormData({...formData,crop:e.target.value})}/>
        <input name="soiltype" placeholder={t.soil} onChange={(e)=>setFormData({...formData,soiltype:e.target.value})}/>
        <input name="irrigationtype" placeholder={t.irrigation} onChange={(e)=>setFormData({...formData,irrigationtype:e.target.value})}/>
        <button type="submit">{t.btn}</button>
=======
      <h3>🌾 Add Farmer Profile</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input name="landsize" type="number" placeholder="Land Size (acres)" value={formData.landsize} onChange={handleChange} required />
        <input name="crop" placeholder="Crop" value={formData.crop} onChange={handleChange} required />
        <input name="soiltype" placeholder="Soil Type" value={formData.soiltype} onChange={handleChange} required />
        <input name="irrigationtype" placeholder="Irrigation Type" value={formData.irrigationtype} onChange={handleChange} required />
        <button type="submit">Add Farmer</button>
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
      </form>
    </div>
  );
}

<<<<<<< HEAD
export default AddFarmer;
=======
export default AddFarmer;
>>>>>>> 50afdea6ba75fd1ee9991631a0b1a5305299959b
