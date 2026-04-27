import { useState, useCallback, useEffect } from 'react';
import { toggleSave } from '../../api/routineApi';
import { useAuth } from '../../context/AuthContext';
import { BsBookmark } from "react-icons/bs";
import { BsFillBookmarkFill } from "react-icons/bs";
import { BsCheckLg } from "react-icons/bs";
import './SaveButton.css';

const SaveButton = ({
    routineId,
    initialSaved = false,
    disabled: externalDisabled = false,
    onToggle,
}) => {
    const { token, isAuthenticated } = useAuth();
    const [saved, setSaved] = useState(initialSaved);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        setSaved(initialSaved);
    }, [initialSaved, routineId]);

    const isDisabled = !isAuthenticated || loading || externalDisabled;

    const showMessage = (type) => {
        setMessage(type);
        setTimeout(() => setMessage(null), 2500);
    };

    const getTitle = () => {
        if (externalDisabled) return 'Publish routine to enable saving';
        if (!isAuthenticated) return 'Log in to save';
        return saved ? 'Remove from saved' : 'Save routine';
    };

    const handleToggle = useCallback(async () => {
        if (isDisabled) return;

        const prevSaved = saved;
        const nextSaved = !prevSaved;
        setSaved(nextSaved);
        setLoading(true);
        setMessage(null);

        try {
            const updated = await toggleSave(routineId, token);
            if (updated !== null && updated !== undefined) {
                setSaved(updated.savedByCurrentUser);
                showMessage(updated.savedByCurrentUser ? 'saved' : 'unsaved');
                if (onToggle) onToggle(updated);
            }
        } catch (err) {
            console.error('[SaveButton] toggle error:', err);
            setSaved(prevSaved);
        } finally {
            setLoading(false);
        }
    }, [saved, isDisabled, routineId, token, onToggle]);

    return (
        <div className="save-btn-wrapper">
            <button
                className={[
                    'save-btn',
                    saved ? 'save-btn--saved' : '',
                    isDisabled ? 'save-btn--disabled' : '',
                ].join(' ').trim()}
                onClick={handleToggle}
                disabled={isDisabled}
                title={getTitle()}
                aria-label={saved ? 'Remove from saved' : 'Save routine'}
            >
                <span className="save-btn-icon">
                    {saved ? <BsFillBookmarkFill /> : <BsBookmark />}
                </span>
                <span className="save-btn-label">
                    {loading ? '...' : saved ? 'Saved' : 'Save'}
                </span>
            </button>

            {message === 'saved' && (
                <div className="save-btn-message save-btn-message--saved">
                    <span><BsCheckLg /></span> Routine saved!
                </div>
            )}
            {message === 'unsaved' && (
                <div className="save-btn-message save-btn-message--unsaved">
                    <span>✕</span> Removed from saved.
                </div>
            )}
        </div>
    );
};

export default SaveButton;