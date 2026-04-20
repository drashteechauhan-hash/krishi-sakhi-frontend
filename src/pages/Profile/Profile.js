import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./Profile.css";

function Profile() {
  const { t } = useLanguage();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    return (
      <div className="profile-container">
        <h3>{t("profile_login_prompt")}</h3>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h2>{t("profile_title")}</h2>
        <form>
          <label>{t("profile_name_label")}:</label>
          <input type="text" placeholder={t("profile_name_label")} defaultValue={user.name} />
          <label>{t("profile_email_label")}:</label>
          <input type="email" value={user.email} readOnly />
          <button type="submit">{t("profile_save_btn")}</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;