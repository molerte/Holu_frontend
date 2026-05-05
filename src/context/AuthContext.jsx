import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { register as apiRegister } from '../api/authApi';

// This file address authentication state management and logic
// This includes token storage along with authentication function (login-logout-register)

const AuthContext = createContext(null);

const decodeToken = (token) => {
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

// Returns the number of ms until the token expires from backend
const getTokenExpiryMs = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || typeof decoded.exp !== 'number') return 0;
  return decoded.exp * 1000 - Date.now();
};

// AuthProvider manages authentication state 
// provides login, logout, and register
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return null;
    if (getTokenExpiryMs(storedToken) <= 0) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      return null;
    }
    return storedToken;
  });
  const [username, setUsername] = useState(() => localStorage.getItem('username'));
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

  const isAuthenticated = !!token;

  const logout = useCallback(() => {
    setToken(null);
    setUsername(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  }, []);

  // Callback when a user logs in. Accepts token string `bearer ...` 
  // Also accepts username, id, and payload data
  const login = useCallback((payloadOrToken, fallbackUsername) => {
    const payload = typeof payloadOrToken === 'object' && payloadOrToken !== null
      ? payloadOrToken
      : { token: payloadOrToken, username: fallbackUsername };

    const nextToken = payload.token;
    const nextUsername = payload.username ?? fallbackUsername ?? null;
    const nextUserId = payload.userId ?? payload.id ?? null;

    setToken(nextToken ?? null);
    setUsername(nextUsername);
    setUserId(nextUserId != null ? String(nextUserId) : null);

    if (nextToken) localStorage.setItem('token', nextToken);
    else localStorage.removeItem('token');

    if (nextUsername) localStorage.setItem('username', nextUsername);
    else localStorage.removeItem('username');

    if (nextUserId != null) localStorage.setItem('userId', String(nextUserId));
    else localStorage.removeItem('userId');
  }, []);

  const register = async (credentials) => {
    return apiRegister(credentials);
  };

  useEffect(() => {
    if (!token) return;

    const expiresIn = getTokenExpiryMs(token);
    if (expiresIn <= 0) {
      logout();
      return;
    }

    const timeoutId = setTimeout(() => {
      logout();
    }, expiresIn);

    return () => clearTimeout(timeoutId);
  }, [token, logout]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ token, username, userId, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
