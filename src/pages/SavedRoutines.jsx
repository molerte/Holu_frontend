import { useState, useEffect } from 'react';
import { getSavedRoutines } from '../api/routineApi';
import { useAuth } from '../context/AuthContext';
import RoutineCard from '../components/routine/RoutineCard';
import { BsFillBookmarkFill } from "react-icons/bs";
import './SavedRoutines.css';

const RoutineCardSkeleton = () => (
    <div className="saved-skeleton">
        <div className="saved-skeleton-title" />
        <div className="saved-skeleton-days">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="saved-skeleton-day" />
            ))}
        </div>
    </div>
);

const SavedRoutines = () => {
    const { token, userId } = useAuth();
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetch = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getSavedRoutines(userId, token);
                setRoutines(data);
            } catch (err) {
                setError('Failed to load saved routines.');
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [userId, token]);

    const handleUnsave = (routineId) => {
        setRoutines((prev) => prev.filter((r) => r.id !== routineId));
    };

    return (
        <div className="saved-page">
            <div className="saved-page-header">
                <div className="saved-page-hero">
                    <h1 className="saved-page-heading">Saved<br />Routines</h1>
                    <p className="saved-page-subheading">
                        Routines you've bookmarked for later.
                    </p>
                </div>
            </div>

            <div className="saved-page-content">
                {loading ? (
                    <div className="saved-page-list">
                        {[...Array(2)].map((_, i) => (
                            <RoutineCardSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <p className="saved-page-error">{error}</p>
                ) : routines.length === 0 ? (
                    <div className="saved-page-empty">
                        <span className="saved-page-empty-icon"><BsFillBookmarkFill /></span>
                        <p>No saved routines yet.</p>
                        <p className="saved-page-empty-hint">
                            Browse the feed and save routines you want to come back to.
                        </p>
                    </div>
                ) : (
                    <div className="saved-page-list">
                        {routines.map((routine) => (
                            <RoutineCard
                                key={routine.id}
                                routine={routine}
                                isOwner={false}
                                onUnsave={handleUnsave}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedRoutines;   