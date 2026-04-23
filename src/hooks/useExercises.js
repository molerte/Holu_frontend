import { useState, useEffect } from 'react';
import {
  getExercisesByDay, addExercise, updateExercise, deleteExercise,
} from '../api/exerciseApi';
import { useAuth } from '../context/AuthContext';

export const useExercises = (routineId, dayId) => {
  const { token } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    if (!routineId || !dayId) return;
    setLoading(true);
    try {
      const data = await getExercisesByDay(routineId, dayId, token);
      setExercises(data);
    } catch (err) {
      setError(err.message || 'Failed to load exercises.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [routineId, dayId, token]);

  const add = async (data) => {
    const newEx = await addExercise(routineId, dayId, data, token);
    setExercises((prev) => [...prev, newEx]);
    return newEx;
  };

  const update = async (exerciseId, data) => {
    const updated = await updateExercise(routineId, dayId, exerciseId, data, token);
    setExercises((prev) => prev.map((e) => e.id === exerciseId ? updated : e));
    return updated;
  };

  const remove = async (exerciseId) => {
    await deleteExercise(routineId, dayId, exerciseId, token);
    setExercises((prev) => prev.filter((e) => e.id !== exerciseId));
  };

  return { exercises, loading, error, add, update, remove, refetch: fetch };
};