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
      // Try using the full URL with your machine's IP instead of localhost
      const response = await fetch("http://localhost:5000/api/v1/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Add CORS headers
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("Response received:", response);

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.roles[0]);
        localStorage.setItem("isAuthenticated", "true");
        onLogin();
      } else {
        console.log("Response not ok:", response.status);
        const errorData = await response.text();
        console.log("Error data:", errorData);
        setError("Login failed: " + (errorData || response.statusText));
      }
    } catch (err) {
      console.log("Fetch error:", err);
      console.log("Error details:", {
        message: err.message,
        name: err.name,
        stack: err.stack,
      });
      setError("Network error: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="Logo" className="auth-logo" />
      <h1 className="auth-title">Sign In</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>EmailVVVVVVV:</label>
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
