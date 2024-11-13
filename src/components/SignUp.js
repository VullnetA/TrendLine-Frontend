import React, { useState } from "react";
import "../style/AuthFormStyles.css";
import logo from "../images/design.png";

function SignUp({ onSwitchToSignIn }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting to register...");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const registrationData = {
      firstName,
      lastName,
      address,
      phoneNumber: String(phoneNumber),
      email,
      password,
    };

    console.log("Registration Data:", registrationData);

    try {
      const response = await fetch(
        "https://localhost:7277/api/Auth/registerCustomer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      );

      console.log("Response status:", response.status);

      if (response.ok) {
        console.log("Registration successful");
        onSwitchToSignIn();
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        setError(errorData.message || "Registration failed");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("A network error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="Logo" className="auth-logo" />
      <h1 className="auth-title">Sign Up</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">
          Sign Up
        </button>
      </form>
      {error && <p className="auth-error">{error}</p>}
      <button onClick={onSwitchToSignIn} className="switch-button">
        Already have an account? Sign In
      </button>
    </div>
  );
}

export default SignUp;
