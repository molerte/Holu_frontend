import client from './client';

// handles all authentication-related API calls

export const register = (data) =>
  client('/api/auth/register', { method: 'POST', body: data });

export const login = (data) =>
  client('/api/auth/login', { method: 'POST', body: data });