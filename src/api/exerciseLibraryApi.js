import client from './client';

export const getByMuscleGroup = (muscleGroup, token) =>
  client(`/api/exercise-library?muscleGroup=${encodeURIComponent(muscleGroup)}`, { token });