import React, { useState } from "react";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-card">

        <a href="/" className="back-btn">&lt; Back</a>

        <h1 className="signin-title">LOGIN</h1>

        <form onSubmit={handleSubmit}>
          <label>User Name:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
          />

          <label>Password:</label>
          <input
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
