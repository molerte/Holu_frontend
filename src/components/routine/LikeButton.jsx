import { useState, useCallback, useEffect } from 'react';
import { toggleLike } from '../../api/routineApi';
import { useAuth } from '../../context/AuthContext';
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import './LikeButton.css';

const LikeButton = ({
  routineId,
  initialCount = 0,
  initialLiked = false,
  disabled: externalDisabled = false,
}) => {
  const { token, isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(initialLiked);
    setCount(initialCount);
  }, [initialLiked, initialCount, routineId]);

  const isDisabled = !isAuthenticated || loading || externalDisabled;

  const getTitle = () => {
    if (externalDisabled) return 'Publish routine to enable likes';
    if (!isAuthenticated) return 'Log in to like';
    return liked ? 'Unlike' : 'Like';
  };

  const handleToggle = useCallback(async () => {
    if (isDisabled) return;

    const prevLiked = liked;
    const prevCount = count;

    setLiked(!prevLiked);
    setCount(prevLiked ? prevCount - 1 : prevCount + 1);
    setLoading(true);

    try {
      const updated = await toggleLike(routineId, token);
      if (updated !== null && updated !== undefined) {
        setLiked(updated.likedByCurrentUser);
        setCount(updated.likeCount);
      }
    } catch (err) {
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setLoading(false);
    }
  }, [liked, count, isDisabled, routineId, token]);

  return (
    <button
      className={[
        'like-btn',
        liked ? 'like-btn--liked' : '',
        isDisabled ? 'like-btn--disabled' : '',
      ].join(' ').trim()}
      onClick={handleToggle}
      disabled={isDisabled}
      title={getTitle()}
      aria-label={liked ? 'Unlike routine' : 'Like routine'}
    >
      <span className="like-btn-icon">{liked ? <FaHeart /> : <FaRegHeart />}</span>
      <span className="like-btn-count">{count}</span>
    </button>
  );
};

export default LikeButton;