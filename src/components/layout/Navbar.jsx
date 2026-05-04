import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaStudiovinari } from "react-icons/fa";
import { TbActivity } from "react-icons/tb";
import { CgEditUnmask } from "react-icons/cg";
import { LuSquareActivity } from "react-icons/lu";
import { useState } from 'react';
import { FaBars, FaTimes } from "react-icons/fa";

import { useEffect, useRef } from 'react';

import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const menuOpenRef = useRef(false);

  const closeMenu = () => setMenuOpen(false);

useEffect(() => {
  menuOpenRef.current = menuOpen;
}, [menuOpen]);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      menuOpenRef.current &&
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target)
    ) {
      setMenuOpen(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);

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
        ref={buttonRef}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>




      <div ref={menuRef} className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/routines" className="navbar-link" onClick={closeMenu}>
          Routines
        </Link>
        {isAuthenticated ? (
          <>
            <Link
              to="/saved" onClick={(closeMenu)}
              className={`navbar-link ${isActive('/saved') ? 'navbar-link--active' : ''}`}
            > Saved
            </Link>

            <Link to="/myroutines" className="navbar-link" onClick={(closeMenu)}>
              My Routines
            </Link>
            <button className="navbar-link" onClick={handleLogout}>
              Logout
            </button>
            <span className="navbar-username">{username ? username[0] : ''}</span>
          </>
        ) : (
          <div className="navbar-auth-actions">
            <Link to="/login" className="navbar-link navbar-link--login" onClick={(closeMenu)}>
              Login
            </Link>
            <Link to="/register-account" className="navbar-link navbar-link--create" onClick={(closeMenu)}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;