import React from "react";
import "../style/Welcome.css"; // Ensure you have this CSS file for styling if needed

const Welcome = ({ onLogout }) => {
  return (
    <div className="welcome-container">
      <h1>Welcome to the TrendLine Admin Panel</h1>
      <p>Manage your products, orders, reports, and more with ease.</p>
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default Welcome;
