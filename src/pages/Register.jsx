import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const isFormValid =
  formData.name !== "" &&
  formData.email !== "" &&
  formData.username !== "" &&
  formData.password !== "";


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value 
});

  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Account created successfully!");
      window.location.href = "/login";
    } else if (response.status === 409) {
      alert("Email or username already exists");
    } else {
      alert("Registration failed");
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};


  return (
    <div className="create-wrapper">
      <div className="create-card">

        <a href="/" className="back-btn">&lt; Back</a>

        <h1 className="create-title">REGISTER ACCOUNT</h1>

        <form onSubmit={handleSubmit}>
          <label>Full Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />

          <label>Username:</label>
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

          <button type="submit" className="submit-btn" disabled={!isFormValid}>
            Submit
          </button>


          <a href="/login" className="already-btn">
            I already have an account
          </a>


        </form>
      </div>
    </div>
  );
}

export default Register;
