import React, { useState } from "react";
import "./MyRoutines.css";

function MyRoutines() {
  return (
    
    <div className="routine-wrapper">
      <h1 className="routine-title">My Routine</h1>
      <div className="routine-divider"></div>
        <div className="routine-grid">
            <div className="routine-card">Monday</div>
            <div className="routine-card">Tuesday</div>
            <div className="routine-card">Wedensday</div>
            <div className="routine-card">Thursday</div>
            <div className="routine-card">Friday</div>
            <div className="routine-card">Saturday</div>
            <div className="routine-card">Sunday</div>
         </div>
      <div className="routine-actions">
        <button className="edit-btn">Edit</button>
        <button className="publish-btn">Publish</button>
  </div>
    </div>
  );
}

export default MyRoutines;
