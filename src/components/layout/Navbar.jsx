import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaStudiovinari } from "react-icons/fa";
import { TbActivity } from "react-icons/tb";
import { CgEditUnmask } from "react-icons/cg";
import { LuSquareActivity } from "react-icons/lu";
import { useState } from 'react';
import { FaBars, FaTimes } from "react-icons/fa";

import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Holu<span>.</span>
      </Link>

      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>




      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/routines" className="navbar-link">
          Routines
        </Link>
        {isAuthenticated ? (
          <>
            <Link
              to="/saved"
              className={`navbar-link ${isActive('/saved') ? 'navbar-link--active' : ''}`}
            > Saved
            </Link>

            <Link to="/myroutines" className="navbar-link">
              My Routines
            </Link>
            <button className="navbar-link" onClick={handleLogout}>
              Logout
            </button>
            <span className="navbar-username">{username ? username[0] : ''}</span>
          </>
        ) : (
          <div className="navbar-auth-actions">
            <Link to="/login" className="navbar-link navbar-link--login">
              Login
            </Link>
            <Link to="/register-account" className="navbar-link navbar-link--create">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;