import client from './client';

// This file handles all exercise library-related API calls

export const getByMuscleGroup = (muscleGroup, token) =>
  client(`/api/exercise-library?muscleGroup=${encodeURIComponent(muscleGroup)}`, { token });