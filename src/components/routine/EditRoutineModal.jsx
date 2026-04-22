import { useState, useEffect, memo } from 'react';
import { Modal, Button, Tag, ErrorMessage } from '../common/Common';
import { updateRoutine } from '../../api/routineApi';
import { useAuth } from '../../context/AuthContext';
import './EditRoutineModal.css';

const EditRoutineModal = memo(({ isOpen, onClose, routine, onUpdated }) => {
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [tagError, setTagError] = useState(null);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (routine) {
            setTitle(routine.title ?? '');
            setDescription(routine.description ?? '');
            setTags(routine.tags ?? []);
            setTagInput('');
            setTagError(null);
            setError(null);
        }
    }, [routine?.id]);

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = tagInput.trim().toLowerCase();
            if (!val) return;

            if (tags.includes(val)) {
                setTagError(`Tag "${val}" has already been added.`);
                setTagInput('');
                return;
            }

            setTags([...tags, val]);
            setTagInput('');
            setTagError(null);
        }
    };

    const removeTag = (tag) => {
        setTags(tags.filter((t) => t !== tag));
        setTagError(null);
    };

    const handleSave = async () => {
        if (!title.trim()) {
            setError('Title cannot be empty.');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const updated = await updateRoutine(routine.id, { title, description, tags }, token);
            onUpdated(updated);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to update routine.');
        } finally {
            setSaving(false);
        }
    };

    if (!routine) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Routine">

            <div className="edit-routine-section">
                <label className="edit-routine-label">Title *</label>
                <input
                    className="edit-routine-input"
                    type="text"
                    placeholder="e.g. Jeff's Power Build"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setError(null); }}
                    maxLength={100}
                />
                <span className={`edit-routine-char-count ${title.length >= 90 ? 'edit-routine-char-count--warn' : ''}`}>
                    {title.length}/100
                </span>
            </div>

            <div className="edit-routine-section">
                <label className="edit-routine-label">Description</label>
                <textarea
                    className="edit-routine-textarea"
                    placeholder="Describe your routine... (optional)"
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); setError(null); }}
                    rows={3}
                />
            </div>

            <div className="edit-routine-section">
                <label className="edit-routine-label">Tags</label>
                <div className={`edit-routine-tags-input ${tagError ? 'edit-routine-tags-input--error' : ''}`}>
                    {tags.map((t) => (
                        <Tag key={t} label={t} onRemove={removeTag} />
                    ))}
                    <input
                        className="edit-routine-tag-field"
                        type="text"
                        placeholder="Type tag + Enter..."
                        value={tagInput}
                        onChange={(e) => { setTagInput(e.target.value); setTagError(null); }}
                        onKeyDown={handleTagKeyDown}
                    />
                </div>

                {tagError && <p className="edit-routine-tag-error">{tagError}</p>}
                <p className="edit-routine-hint">Press Enter or comma to add a tag</p>
            </div>

            <ErrorMessage message={error} />

            <div className="edit-routine-actions">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </Modal>
    );
});

EditRoutineModal.displayName = 'EditRoutineModal';

export default EditRoutineModal;