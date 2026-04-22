import { useState, useEffect, useCallback } from 'react';
import { getAllRoutines, searchRoutines } from '../api/routineApi';
import { useAuth } from '../context/AuthContext';
/*import RoutineCard from '../components/routine/RoutineCard';*/
import SearchBar from '../components/search/SearchBar';
import './Routines.css';

const RoutineCardSkeleton = () => (
  <div className="feed-skeleton">
    <div className="feed-skeleton-title" />
    <div className="feed-skeleton-days">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="feed-skeleton-day" />
      ))}
    </div>
  </div>
);

const Routines = () => {
  const { token } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllRoutines(token);
      setRoutines(data);
    } catch {
      setError('Failed to load routines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [token]);

  const handleSearch = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      if (!query.trim()) {
        setIsSearching(false);
        const data = await getAllRoutines(token);
        setRoutines(data);
      } else {
        setIsSearching(true);
        const data = await searchRoutines(query);
        setRoutines(data);
      }
    } catch {
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="feed-page">
      <div className="feed-page-header">
        <div className="feed-page-hero">
          <h1 className="feed-page-heading">
            Discover<br />Routines
          </h1>
          <p className="feed-page-subheading">
            Explore workout routines built by the community.
          </p>
        </div>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="feed-page-content">
        {error && <div className="feed-page-error">{error}</div>}

        {loading ? (
          <div className="feed-page-list">
            {[...Array(3)].map((_, i) => <RoutineCardSkeleton key={i} />)}
          </div>
        ) : routines.length === 0 ? (
          <div className="feed-page-empty">
            <p>
              {isSearching
                ? 'No routines found for that search.'
                : 'No routines yet. Be the first to create one!'}
            </p>
          </div>
        ) : (
          <div className="feed-page-list">
            {routines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                isOwner={false}  
                onDelete={undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Routines;
