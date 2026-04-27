import React, { useState } from "react";
import { API_BASE_URL } from "../api/api";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const isFormValid = formData.username !== "" && formData.password !== "";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        alert("Invalid username or password");
        return;
      }

      const data = await response.json(); 

      // Store token
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);
         localStorage.setItem("name", data.name);

      alert("Login successful!");

      window.location.href = "/myroutines";
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-card">
       <a href="/" className="login-back-btn">&lt; Back</a>


        <h1 className="signin-title">LOGIN</h1>

        <form onSubmit={handleSubmit}>
          <label className="signin-label">User Name:</label>
          <input
            className="signin-input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
          />

          <label className="signin-label">Password:</label>
          <input
            className="signin-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />

          <button 
            type="submit" 
            className="signin-btn" 
            disabled={!isFormValid}
          >
            Login
          </button>

          <a href="/register-account" className="Createaccount-btn">
            Create new account
          </a>
        </form>
      </div>
    </div>
  );
}

export default Login;
