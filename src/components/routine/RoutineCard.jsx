import { useState, memo, useCallback } from 'react';
import { DayCardGrid } from '../workoutDay/DayCard';
import LikeButton from './LikeButton';
import EditDayModal from '../workoutDay/EditDayModal';
import EditRoutineModal from './EditRoutineModal';
import AddDayModal from '../workoutDay/AddDayModal';
import { publishRoutine, unpublishRoutine } from '../../api/routineApi';
import { deleteDay } from '../../api/workoutDayApi';
import { useAuth } from '../../context/AuthContext';
import { BsPencilSquare } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";
import './RoutineCard.css';

const RoutineCard = memo(({ routine, isOwner = false, onDelete, onUpdated }) => {
    const { token } = useAuth();
    const [days, setDays] = useState(routine.workoutDays ?? []);
    const [currentRoutine, setCurrentRoutine] = useState(routine);
    const [publishError, setPublishError] = useState(null);
    const [publishSuccess, setPublishSuccess] = useState(null);
    const [publishing, setPublishing] = useState(false);
    
    const [editingDay, setEditingDay] = useState(null);
    const [dayModalOpen, setDayModalOpen] = useState(false);
    const [addDayModalOpen, setAddDayModalOpen] = useState(false);
    const [routineModalOpen, setRoutineModalOpen] = useState(false);
 
    const handleEdit = useCallback((day) => {
        setEditingDay(day);
        setDayModalOpen(true);
    }, []);
    
    const handleDayClose = useCallback(() => {
        setDayModalOpen(false);
        setTimeout(() => setEditingDay(null), 200);
    }, []);
    
    const handleDayUpdated = useCallback((updatedDay) => {
        setDays((prev) =>
        prev
            .map((d) => d.id === updatedDay.id ? updatedDay : d)
            .sort((a, b) => (a.dayOrder ?? 0) - (b.dayOrder ?? 0))
        );
        if (currentRoutine.published && updatedDay.exercises?.length === 0) {
        setCurrentRoutine((prev) => ({ ...prev, published: false }));
        }
        handleDayClose();
    }, [handleDayClose, currentRoutine.published]);
    
    const handleDayAdded = useCallback((newDay) => {
        setDays((prev) =>
        [...prev, newDay].sort((a, b) => (a.dayOrder ?? 0) - (b.dayOrder ?? 0))
        );
    }, []);
    
    const handleDayDelete = useCallback(async (dayId) => {
        try {
        await deleteDay(currentRoutine.id, dayId, token);
        setDays((prev) => prev.filter((d) => d.id !== dayId));
        if (currentRoutine.published) {
            setCurrentRoutine((prev) => ({ ...prev, published: false }));
        }
        } catch (err) {
            console.error("[RoutineCard] deleteDay error:", err);
        }
    }, [currentRoutine.id, currentRoutine.published, token]);
    const handleRoutineUpdated = useCallback((updated) => {
        setCurrentRoutine(updated);
        if (onUpdated) onUpdated(updated);
    }, [onUpdated]);
    
    const showSuccess = (msg) => {
            setPublishSuccess(msg);
            setTimeout(() => setPublishSuccess(null), 4000);
    };
 
  const handlePublish = async () => {
    setPublishing(true);
    setPublishError(null);
    setPublishSuccess(null);
    try {
        const updated = await publishRoutine(currentRoutine.id, token);
        setCurrentRoutine(updated);
        if (onUpdated) onUpdated(updated);
        showSuccess(`"${updated.title}" has been successfully published!`);
    } catch (err) {
        setPublishError(err.message || 'Failed to publish routine.');
    } finally {
        setPublishing(false);
    }
  };
 
  const handleUnpublish = async () => {
        setPublishing(true);
        setPublishError(null);
        setPublishSuccess(null);
        try {
        const updated = await unpublishRoutine(currentRoutine.id, token);
        setCurrentRoutine(updated);
        if (onUpdated) onUpdated(updated);
        showSuccess(`"${updated.title}" has been moved back to drafts.`);
    } catch (err) {
        setPublishError(err.message || 'Failed to unpublish routine.');
    } finally {
        setPublishing(false);
    }
  };

    return (
        <article className="routine-card">
        <div className="routine-card-header">
            <div className="routine-card-title-block">
            <h2 className="routine-card-title">
                {currentRoutine.title || 'My Routine'}
            </h2>
            <p className="routine-card-creator">
                by <span>{currentRoutine.ownerUsername}</span>
            </p>
            {isOwner && !currentRoutine.published && (
                <span className="routine-card-draft-badge">Draft</span>
            )}
            </div>
    
            {isOwner && (
            <div className="routine-card-actions">
                <button
                className="routine-card-edit-btn"
                onClick={() => setRoutineModalOpen(true)}
                title="Edit title, description and tags"
                >
                <BsPencilSquare />
                </button>
                <button
                className="routine-card-delete"
                onClick={() => onDelete(currentRoutine.id)}
                title="Delete routine"
                >
                <BsTrash3 />
                </button>
            </div>
            )}
        </div>
    
        <DayCardGrid
            days={days}
            routineId={currentRoutine.id}
            isOwner={isOwner}
            onEdit={isOwner ? handleEdit : undefined}
            onDelete={isOwner ? handleDayDelete : undefined}
            onAddDay={isOwner ? () => setAddDayModalOpen(true) : undefined}
        />
    
        {currentRoutine.description && (
            <p className="routine-card-description">{currentRoutine.description}</p>
        )}
    
        {publishSuccess && (
            <div className="routine-card-publish-success">
            {publishSuccess}
            </div>
        )}
    
        {publishError && (
            <div className="routine-card-publish-error">{publishError}</div>
        )}
    
        <div className="routine-card-footer">
            <div className="routine-card-tags">
            {currentRoutine.tags?.map((tag) => (
                <span key={tag} className="routine-card-tag">#{tag}</span>
            ))}
            </div>
    
            <div className="routine-card-footer-right">
            {isOwner && (
                currentRoutine.published ? (
                <button
                    className="routine-card-unpublish-btn"
                    onClick={handleUnpublish}
                    disabled={publishing}
                >
                    {publishing ? '...' : 'Unpublish'}
                </button>
                ) : (
                <button
                    className="routine-card-publish-btn"
                    onClick={handlePublish}
                    disabled={publishing}
                >
                    {publishing ? 'Publishing...' : 'Publish'}
                </button>
                )
            )}
            <LikeButton
                routineId={currentRoutine.id}
                initialCount={currentRoutine.likeCount ?? 0}
                initialLiked={currentRoutine.likedByCurrentUser ?? false}
                disabled={!currentRoutine.published}
            />
            </div>
        </div>
    
        {isOwner && (
            <EditDayModal
            isOpen={dayModalOpen}
            onClose={handleDayClose}
            day={editingDay}
            routineId={currentRoutine.id}
            onUpdated={handleDayUpdated}
            />
        )}
    
        {isOwner && (
            <AddDayModal
            isOpen={addDayModalOpen}
            onClose={() => setAddDayModalOpen(false)}
            routineId={currentRoutine.id}
            existingDays={days}
            onAdded={handleDayAdded}
            />
        )}
    
        {isOwner && (
            <EditRoutineModal
            isOpen={routineModalOpen}
            onClose={() => setRoutineModalOpen(false)}
            routine={currentRoutine}
            onUpdated={handleRoutineUpdated}
            />
        )}
        </article>
    );
});