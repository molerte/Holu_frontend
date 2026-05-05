import client from './client';

// This file handles all workout day-related API calls

export const getDaysByRoutine = (routineId, token) =>
  client(`/api/routines/${routineId}/days`, { token });

export const addDay = (routineId, data, token) =>
  client(`/api/routines/${routineId}/days`, { method: 'POST', body: data, token });

export const updateDay = (routineId, dayId, data, token) =>
  client(`/api/routines/${routineId}/days/${dayId}`, { method: 'PUT', body: data, token });

export const deleteDay = (routineId, dayId, token) =>
  client(`/api/routines/${routineId}/days/${dayId}`, { method: 'DELETE', token });