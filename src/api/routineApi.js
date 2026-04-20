import client from './client';

export const getAllRoutines = (token) =>
  client('/api/routines', { token });

export const getRoutineById = (id, token) =>
  client(`/api/routines/${id}`, { token });

export const getMyRoutines = (userId, token) =>
  client(`/api/routines/user/${userId}`, { token });

export const createRoutine = (data, token) =>
  client('/api/routines', { method: 'POST', body: data, token });

export const updateRoutine = (id, data, token) =>
  client(`/api/routines/${id}`, { method: 'PUT', body: data, token });

export const deleteRoutine = (id, token) =>
  client(`/api/routines/${id}`, { method: 'DELETE', token });

export const publishRoutine = (id, token) =>
  client(`/api/routines/${id}/publish`, { method: 'POST', token });

export const unpublishRoutine = (id, token) =>
  client(`/api/routines/${id}/unpublish`, { method: 'POST', token });

// Single toggle endpoint — backend handles like/unlike logic
export const toggleLike = (id, token) =>
  client(`/api/routines/${id}/like`, { method: 'POST', token });

export const searchRoutines = (q) =>
  client(`/api/search?q=${encodeURIComponent(q)}`);