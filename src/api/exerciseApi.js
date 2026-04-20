import client from './client';

export const getExercisesByDay = (routineId, dayId, token) =>
  client(`/api/routines/${routineId}/days/${dayId}/exercises`, { token });

export const addExercise = (routineId, dayId, data, token) =>
  client(`/api/routines/${routineId}/days/${dayId}/exercises`, {
    method: 'POST', body: data, token,
  });

export const updateExercise = (routineId, dayId, exerciseId, data, token) =>
  client(`/api/routines/${routineId}/days/${dayId}/exercises/${exerciseId}`, {
    method: 'PUT', body: data, token,
  });

export const deleteExercise = (routineId, dayId, exerciseId, token) =>
  client(`/api/routines/${routineId}/days/${dayId}/exercises/${exerciseId}`, {
    method: 'DELETE', token,
  });