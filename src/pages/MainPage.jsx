import React from "react";
import "./MainPage.css";

function Login() {
  return (
    <>
      {/* LOGIN PAGE */}
     <div className="login-wrapper">
  <div className="login-content">
    <h1 className="title">HOLU FITNESS</h1>
    <p className="slogan">"Your Routine, Their Inspiration"</p>

    <div className="button-group">
      <a href="/login" className="btn primary">Log In</a>
      <a href="/register-account" className="btn secondary">Register Account</a>
    </div>
  </div>

  {/* ABOUT SECTION NOW INSIDE */}
  <div className="about-section">
    <h2>About Holu Fitness</h2>
    <p>
      Holu is a community fitness app designed for Fitness enthusiasts, 
      Trainers, and Beginners alike. Our goal is to connect users 
      through shared workout routines, encouraging a supportive and 
      engaging environment. Whether you're looking to share your fitness 
      routine, find new workouts, or just connect with other like-minded people, 
      Holu has something for everyone.
    </p>
  </div>
</div>

    </>
  );
}

export default Login;
