import React, { useState } from "react";
import "./Routines.css";

function Routines() {
  const [liked, setLiked] = useState(false);

  return (
    <div className="routine-wrapper">
      <a href="/" className="routine-back-btn">&lt; Back</a>
      <h1 className="routine-title"> Explore Routines</h1>
      <div className="routine-divider"></div>

      <div className="routine-content">

        <div className="ownerUserName"> Jeff's Routine</div>
        <div className="routine-grid">
          <div className="routine-card">Monday</div>
          <div className="routine-card">Tuesday</div>
          <div className="routine-card">Wednesday</div>
          <div className="routine-card">Thursday</div>
          <div className="routine-card">Friday</div>
          <div className="routine-card">Saturday</div>
          <div className="routine-card">Sunday</div>
        </div>

  
        <div className="routine-description-box">
          <p>
            I made this routine in college with hopes to build
            a strong and active body in the gym. There are 3 days
            of intense weightlifting, 2 days of calisthenics exercise
            and 2 days of ACTIVE rest. The intensity of the exercises
            can be altered to fit your level of fitness but you should
            always be pushing your body with each day.
          </p>

          <button
            className={`like-button ${liked ? "liked" : ""}`}
            onClick={() => setLiked(!liked)}
          >
            {liked ? "Unlike" : "Like"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Routines;
