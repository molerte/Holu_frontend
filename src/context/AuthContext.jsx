import { createContext, useContext, useState } from 'react';
import { register as apiRegister } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [username, setUsername] = useState(() => localStorage.getItem('username'));
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

  const isAuthenticated = !!token;

  const login = (payloadOrToken, fallbackUsername) => {
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
  };

  const register = async (credentials) => {
    return apiRegister(credentials);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  };

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
