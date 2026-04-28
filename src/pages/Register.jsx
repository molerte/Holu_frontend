import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { register as registerApi } from '../api/authApi';
import { BsEye } from "react-icons/bs";
import { BsEyeSlash } from "react-icons/bs";
import { LuSquareActivity } from "react-icons/lu";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setFieldErrors({ ...fieldErrors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      await registerApi(form);
      navigate('/login');
    } catch (err) {
      if (err.username || err.name || err.email || err.password) {
        setFieldErrors(err);
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-card-logo">
          <LuSquareActivity size={48} />
        </div>

        <h1 className="register-card-title">Create Account</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-form-group">
            <label className="register-form-label">Username</label>
            <input className={`register-form-input ${fieldErrors.username ? 'register-form-input--error' : ''}`}
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
            />
            {fieldErrors.username && (
              <span className="register-form-field-error">{fieldErrors.username}</span>
            )}
          </div>

          <div className="register-form-group">
            <label className="register-form-label">Name</label>
            <input
              className={`register-form-input ${fieldErrors.name ? 'register-form-input--error' : ''}`}
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
            {fieldErrors.name && (
              <span className="register-form-field-error">{fieldErrors.name}</span>
            )}
          </div>

          <div className="register-form-group">
            <label className="register-form-label">Email</label>
            <input
              className={`register-form-input ${fieldErrors.email ? 'register-form-input--error' : ''}`}
              type="email"
              name="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && (
              <span className="register-form-field-error">{fieldErrors.email}</span>
            )}
          </div>

          <div className="register-form-group">
            <label className="register-form-label">Password</label>
            <div className="register-form-input-wrapper">
              <input
                className={`register-form-input ${fieldErrors.password ? 'register-form-input--error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="register-form-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <BsEyeSlash /> : <BsEye />}
              </button>
            </div>
          </div>

          {error && <div className="register-form-error">{error}</div>}

          <button
            className="register-form-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

        </form>

        <p className="register-card-footer">
          Already have an account?{' '}
          <Link to="/login" className="register-card-link">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
