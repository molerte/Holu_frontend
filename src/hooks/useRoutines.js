import { useState, useEffect, useCallback } from 'react';
import { getAllRoutines, getMyRoutines, deleteRoutine } from '../api/routineApi';
import { useAuth } from '../context/AuthContext';

export const useRoutines = () => {
  const { token } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllRoutines(token);
      setRoutines(data);
    } catch (err) {
      setError(err.message || 'Failed to load routines.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const remove = async (id) => {
    await deleteRoutine(id, token);
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  return { routines, loading, error, remove, refetch: fetchAll };
};

export const useMyRoutines = () => {
  const { token, userId } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMine = useCallback(async () => {
    if (!userId) {
      console.warn('[useMyRoutines] userId is null — skipping fetch');
      setLoading(false);
      return;
    }
    console.log('[useMyRoutines] fetching for userId:', userId);
    setLoading(true);
    setError(null);
    try {
      const data = await getMyRoutines(userId, token);
      console.log('[useMyRoutines] fetched:', data.length, 'routines');
      setRoutines(data);
    } catch (err) {
      console.error('[useMyRoutines] error:', err);
      setError(err.message || 'Failed to load your routines.');
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchMine();
  }, [fetchMine]);

  const remove = async (id) => {
    await deleteRoutine(id, token);
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  return { routines, loading, error, remove, refetch: fetchMine };
};