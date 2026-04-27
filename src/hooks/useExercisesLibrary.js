import { useState, useEffect } from 'react';
import { getByMuscleGroup } from '../api/exerciseLibraryApi';
import { useAuth } from '../context/AuthContext';

export const useExerciseLibrary = (muscleGroup) => {
  const { token } = useAuth();
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!muscleGroup || muscleGroup === 'REST') {
      setLibrary([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getByMuscleGroup(muscleGroup, token)
      .then((data) => {
        setLibrary(data ?? []);
        setError(null);
      })
      .catch((err) => {
        setLibrary([]);
        setError(err.message || 'Failed to load exercises.');
      })
      .finally(() => setLoading(false));
  }, [muscleGroup, token]);

  return { library, loading, error };
};