import { useState, useEffect, useCallback } from 'react';
import { searchRoutines } from '../api/routineApi';

// This custom hook provides logic for searching routines based on a 
// query string. It manages the search query, results, loading state, 
// and any errors that may occur during the search process. The search 
// is debounced to prevent excessive API calls while the user is typing. 

export const useSearch = (delay = 400) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchRoutines(query);
        setResults(data);
      } catch (err) {
        setError('Search failed.');
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return { query, setQuery, results, loading, error };
};