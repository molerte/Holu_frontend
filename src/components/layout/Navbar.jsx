import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Holu<span>.</span>
      </Link>

      <div className="navbar-links">
        <Link to="/routines" className="navbar-link">
          Routines
        </Link>
        {isAuthenticated ? (
          <>
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
            <Link to="/register" className="navbar-link navbar-link--create">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;