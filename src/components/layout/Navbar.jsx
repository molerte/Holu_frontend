import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const hideOnRoutes = ["/login", "/register-account"];
  const shouldHide = hideOnRoutes.includes(location.pathname);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const menuOpenRef = useRef(false);
  const modalOpenRef = useRef(false);
  const isVisibleRef = useRef(true);
  const ignoringScrollRef = useRef(false);
  const visibilityBeforeModal = useRef(true);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  },)

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
    const observer = new MutationObserver(() => {
      const isModalOpen = document.body.style.position === 'fixed';

      if (isModalOpen && !modalOpenRef.current) {
        visibilityBeforeModal.current = isVisibleRef.current;
        modalOpenRef.current = true;
      } else if (!isModalOpen && modalOpenRef.current) {
        modalOpenRef.current = false;
        ignoringScrollRef.current = true;

        setTimeout(() => {
          ignoringScrollRef.current = false;
          setIsVisible(visibilityBeforeModal.current);
        });
      }
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style']
    }, 10);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    const handleScroll = () => {

      if (modalOpenRef.current || ignoringScrollRef.current) return;
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setMenuOpen(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  const isActive = (path) => location.pathname === path;
  if (shouldHide) return null;

  return (
    <>
      <nav className={`navbar ${menuOpen ? 'navbar--menu-open' : ''} ${isVisible ? 'navbar--visible' : 'navbar--hidden'}`}>
        <div className="navbar-left">
          <button
            className={`navbar-hamburger ${menuOpen ? 'navbar-hamburger--open' : ''}`}
            ref={buttonRef}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="navbar-hamburger-bar" />
            <span className="navbar-hamburger-bar" />
            <span className="navbar-hamburger-bar" />
          </button>

          <Link
            to={isAuthenticated ? '/routines' : '/'}
            className="navbar-logo"
            onClick={closeMenu}
          >
            Holu<span>.</span>
          </Link>
        </div>
        
        <div ref={menuRef} className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link
            to="/routines"
            className={`navbar-link ${isActive('/routines') ? 'navbar-link--active' : ''}`}
            onClick={closeMenu}
          >
            Routines
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/saved"
                className={`navbar-link ${isActive('/saved') ? 'navbar-link--active' : ''}`}
                onClick={closeMenu}
              >
                Saved
              </Link>
              <Link
                to="/myroutines"
                className={`navbar-link ${isActive('/myroutines') ? 'navbar-link--active' : ''}`}
                onClick={closeMenu}
              >
                My Routines
              </Link>
              <button
                className="navbar-link navbar-logout"
                onClick={() => { setShowLogoutConfirm(true); closeMenu(); }}
              >
                Logout
              </button>
              <span className="navbar-username" title={username}>
                {username ? username[0].toUpperCase() : ''}
              </span>
            </>
          ) : (
            <div className="navbar-auth-actions">
              <Link
                to="/login"
                className="navbar-link navbar-link--login"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                to="/register-account"
                className="navbar-link navbar-link--create"
                onClick={closeMenu}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

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
    </>
  );
};

export default Navbar;