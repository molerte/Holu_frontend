import React from "react";
import "./Login.css";

function Login() {
  return (
    <>
      {/* LOGIN PAGE */}
      <div className="login-wrapper">
        <div className="login-content">
          <h1 className="title">HOLU FITNESS</h1>
          <p className="slogan">"Your Routine, Their Inspiration"</p>

          <div className="button-group">
            <a href="/signin" className="btn primary">Sign In</a>
            <a href="/create-account" className="btn secondary">Create new account</a>
            <a href="/guest" className="btn third">Continue as guest</a>
          </div>
        </div>
      </div>

      {/* ABOUT US SECTION */}
      <div className="about-section">
        <h2>About Holu Fitness</h2>
        <p>
          Holu is a community fitness app designed for Fitness enthusiasts, 
          Trainers, and Beginners alike. Our goal is to connect users 
          through shared workout routines,encouraging a supportive and 
          engaging environment. Whether you're looking to share your fitness 
          routine, find new workouts, or just connect with other like-minded people, 
          Holu has something for everyone.

        </p>
      </div>
    </>
  );
}

export default Login;
