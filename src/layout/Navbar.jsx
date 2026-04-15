import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="nav-wrapper">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded-4 px-4 py-2">
        <div className="container-fluid">
          <Link className="navbar-brand mx-auto" to="/">Home</Link>

          {!token && (
            <Link className="navbar-brand mx-auto" to="/login">Login</Link>
          )}

          {token && (
            <button onClick={logout} className="navbar-brand mx-auto logout-btn">
              Logout
            </button>
          )}

          <Link className="navbar-brand mx-auto" to="/myroutines">My Routines</Link>
        </div>
      </nav>
    </div>
  );
}
