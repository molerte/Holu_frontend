import { useState } from 'react';
import { Modal, Button, Tag, ErrorMessage } from '../common/Common';
import { BsCheckLg } from "react-icons/bs";
import './CreateRoutineModal.css';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const MUSCLE_GROUPS = ['Back', 'Chest', 'Legs', 'Arms', 'Shoulders', 'Core', 'REST'];

const CreateRoutineModal = ({ isOpen, onClose, onCreate, loading: externalLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [tagError, setTagError] = useState(null);
  const [days, setDays] = useState(
    DAYS.map((d) => ({ dayOfWeek: d, muscleGroup: '', restDay: false, enabled: false }))
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const toggleDay = (idx) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === idx ? { ...d, enabled: !d.enabled, muscleGroup: '', restDay: false } : d
      )
    );
    setError(null);
  };

  const setDayMuscle = (idx, value) => {
    const isRest = value === 'REST';
    setDays((prev) =>
      prev.map((d, i) =>
        i === idx ? { ...d, muscleGroup: value, restDay: isRest } : d
      )
    );
  };

  const enabledDays = days.filter((d) => d.enabled);
  const selectedCount = enabledDays.length;

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Please add a title.');
      return;
    }
    if (selectedCount < 3) {
      setError(`Please select at least 3 days. You have ${selectedCount} selected.`);
      return;
    }
    const invalidDays = enabledDays.filter((d) => !d.muscleGroup);
    if (invalidDays.length > 0) {
      setError('Please select a workout type for each enabled day.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onCreate({
        title,
        description,
        tags,
        workoutDays: enabledDays.map((d) => ({
          dayOfWeek: d.dayOfWeek,
          muscleGroup: d.restDay ? 'REST' : d.muscleGroup,
          restDay: d.restDay,
        })),
      });

      setTitle('');
      setDescription('');
      setTags([]);
      setTagInput('');
      setTagError(null);
      setDays(DAYS.map((d) => ({ dayOfWeek: d, muscleGroup: '', restDay: false, enabled: false })));
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create routine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Routine">

      <div className="create-routine-section">
        <label className="create-routine-label">Title *</label>
        <input
          className="create-routine-input"
          type="text"
          placeholder="e.g. Jeff's Power Build"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError(null); }}
          maxLength={100}
        />
        <span className={`create-routine-char-count ${title.length >= 90 ? 'create-routine-char-count--warn' : ''}`}>
          {title.length}/100
        </span>
      </div>

      <div className="create-routine-section">
        <label className="create-routine-label">Description</label>
        <textarea
          className="create-routine-textarea"
          placeholder="Describe your routine... (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="create-routine-section">
        <label className="create-routine-label">Tags</label>
        <div className={`create-routine-tags-input ${tagError ? 'create-routine-tags-input--error' : ''}`}>
          {tags.map((t) => (
            <Tag key={t} label={t} onRemove={removeTag} />
          ))}
          <input
            className="create-routine-tag-field"
            type="text"
            placeholder="Type tag + Enter..."
            value={tagInput}
            onChange={(e) => { setTagInput(e.target.value); setTagError(null); }}
            onKeyDown={handleTagKeyDown}
          />
        </div>
        {tagError && <p className="create-routine-tag-error">{tagError}</p>}
      </div>

      <div className="create-routine-section">
        <div className="create-routine-days-header">
          <label className="create-routine-label">Workout Days *</label>
          <span className={`create-routine-day-count ${selectedCount >= 3 ? 'create-routine-day-count--valid' : 'create-routine-day-count--invalid'}`}>
            {selectedCount}/7 {selectedCount < 3 ? `(need ${3 - selectedCount} more)` : <><BsCheckLg /></>}
          </span>
        </div>
        <div className="create-routine-days">
          {days.map((day, idx) => (
            <div key={day.dayOfWeek} className="create-routine-day-row">
              <label className="create-routine-day-toggle">
                <input
                  type="checkbox"
                  checked={day.enabled}
                  onChange={() => toggleDay(idx)}
                  className="create-routine-day-checkbox"
                />
                <span className="create-routine-day-name">
                  {day.dayOfWeek.charAt(0) + day.dayOfWeek.slice(1).toLowerCase()}
                </span>
              </label>
              {day.enabled && (
                <select
                  className="create-routine-day-muscle"
                  value={day.muscleGroup}
                  onChange={(e) => setDayMuscle(idx, e.target.value)}
                >
                  <option value="">Select type...</option>
                  {MUSCLE_GROUPS.map((mg) => (
                    <option key={mg} value={mg}>{mg}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="create-routine-actions">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || externalLoading || selectedCount < 3}
        >
          {loading || externalLoading ? 'Creating...' : 'Create Routine'}
        </Button>
      </div>
    </Modal>
  );
};

export default CreateRoutineModal;