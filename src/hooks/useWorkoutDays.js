import { useState, useEffect } from 'react';
import { getDaysByRoutine, addDay, updateDay, deleteDay } from '../api/workoutDayApi';
import { useAuth } from '../context/AuthContext';

export const useWorkoutDays = (routineId) => {
    const { token } = useAuth();
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetch = async () => {
        if (!routineId) return;
        setLoading(true);
        try {
            const data = await getDaysByRoutine(routineId, token);
            setDays(data);
        } catch (err) {
            setError(err.message || 'Failed to load workout days.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetch(); }, [routineId, token]);

    const add = async (data) => {
        const newDay = await addDay(routineId, data, token);
        setDays((prev) => [...prev, newDay].sort((a, b) => a.dayOrder - b.dayOrder));
        return newDay;
    };

    const update = async (dayId, data) => {
        const updated = await updateDay(routineId, dayId, data, token);
        setDays((prev) => prev.map((d) => d.id === dayId ? updated : d));
        return updated;
    };

    const remove = async (dayId) => {
        await deleteDay(routineId, dayId, token);
        setDays((prev) => prev.filter((d) => d.id !== dayId));
    };

    return { days, loading, error, add, update, remove, refetch: fetch };
};