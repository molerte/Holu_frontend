import client from './client';

// handles register calls
export const register = (data) =>
  client('/api/auth/register', { method: 'POST', body: data });

// handles login calls
export const login = (data) =>
  client('/api/auth/login', { method: 'POST', body: data });