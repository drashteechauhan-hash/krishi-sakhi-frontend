import React from "react";
import "./Profile.css";

function Profile() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    return (
      <div className="profile-container">
        <h3>Please login to create or edit your profile.</h3>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h2>My Profile</h2>
        <form>
          <label>Name:</label>
          <input type="text" placeholder="Enter your name" />
          <label>Email:</label>
          <input type="email" value={user.email} readOnly />
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;

