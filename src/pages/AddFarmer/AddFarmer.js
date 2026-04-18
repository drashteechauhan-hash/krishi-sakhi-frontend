import React, { useState } from "react";
import axios from "axios";
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
  });

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("/api/farmer", {
      ...formData,
      email: loggedInUser?.email,
    });

    onAdded();
  };

  return (
    <div className="add-farmer-form">
      <h3>🌾 {t.title}</h3>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder={t.name} onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
        <input name="location" placeholder={t.location} onChange={(e)=>setFormData({...formData,location:e.target.value})}/>
        <input name="landsize" placeholder={t.land} onChange={(e)=>setFormData({...formData,landsize:e.target.value})}/>
        <input name="crop" placeholder={t.crop} onChange={(e)=>setFormData({...formData,crop:e.target.value})}/>
        <input name="soiltype" placeholder={t.soil} onChange={(e)=>setFormData({...formData,soiltype:e.target.value})}/>
        <input name="irrigationtype" placeholder={t.irrigation} onChange={(e)=>setFormData({...formData,irrigationtype:e.target.value})}/>
        <button type="submit">{t.btn}</button>
      </form>
    </div>
  );
}

export default AddFarmer;
