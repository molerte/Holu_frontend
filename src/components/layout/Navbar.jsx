import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes } from "react-icons/fa";
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showLogoutConfirm) {
      const scrollY = window.scrollY;
      document.body.dataset.scrollY = String(scrollY);
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      delete document.body.dataset.scrollY;
      window.scrollTo(0, scrollY);
    }
  }, [showLogoutConfirm]);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  /*const isActive = (path) => location.pathname === path;*/

  return (
    <nav className="navbar">
      <Link
        to={isAuthenticated ? '/routines' : '/'}
        className="navbar-logo"
        onClick={closeMenu}
      >
        Holu<span>.</span>
      </Link>

      <button
        className="navbar-hamburger"
        ref={buttonRef}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div ref={menuRef} className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/routines" className="navbar-link" onClick={closeMenu}>
          Routines
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/saved" className="navbar-link" onClick={closeMenu}>
              Saved
            </Link>
            <Link to="/myroutines" className="navbar-link" onClick={closeMenu}>
              My Routines
            </Link>
            <button
              className="navbar-link"
              onClick={() => { setShowLogoutConfirm(true); closeMenu(); }}
            >
              Logout
            </button>
            <span className="navbar-username">{username ? username[0].toUpperCase() : ''}</span>
          </>
        ) : (
          <div className="navbar-auth-actions">
            <Link to="/login" className="navbar-link navbar-link--login" onClick={closeMenu}>
              Login
            </Link>
            <Link to="/register-account" className="navbar-link navbar-link--create" onClick={closeMenu}>
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {showLogoutConfirm && (
        <>

          <div className="logout-blur" aria-hidden="true" />
          <div
            className="logout-modal-overlay"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) handleCancelLogout();
            }}
          >
            <div
              className="logout-modal"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <h3 className="logout-modal-title">Log out of Holu?</h3>
              <p className="logout-modal-desc">
                You'll need to log back in to access your routines.
              </p>
              <div className="logout-modal-buttons">
                <button className="logout-cancel" onClick={handleCancelLogout}>
                  Cancel
                </button>
                <button className="logout-confirm" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;