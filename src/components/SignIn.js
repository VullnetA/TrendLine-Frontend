import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/AuthFormStyles.css";
import logo from "../images/design.png";

function SignIn({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:7277/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.roles[0]);
        localStorage.setItem("isAuthenticated", "true");

        // Call onLogin to update the parent state and trigger redirection in AppContent
        onLogin();
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        setError("Login failed: " + errorData.message);
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="Logo" className="auth-logo" />
      <h1 className="auth-title">Sign In</h1>
      <form onSubmit={handleSubmit} className="auth-form">
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
        <button type="submit" className="auth-button">
          Sign In
        </button>
      </form>
      {error && <p className="auth-error">{error}</p>}
      <p>
        Don't have an account?{" "}
        <a href="/register" className="auth-link">
          Register here
        </a>
      </p>
    </div>
  );
}

export default SignIn;
