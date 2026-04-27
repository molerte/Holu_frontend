import { useState, useEffect } from 'react';
import { Dropdown } from '../common/Common.jsx';
import { BsCheckLg } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";
import './ExerciseRow.css';

const ExerciseRow = ({
  exercise,
  library,
  onSave,
  onDelete,
  disabled = false,
}) => {
  const [libraryId, setLibraryId] = useState(exercise?.exerciseLibraryId ?? '');
  const [sets, setSets] = useState(exercise?.sets ?? '');
  const [reps, setReps] = useState(exercise?.reps ?? '');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLibraryId(exercise?.exerciseLibraryId ?? '');
    setSets(exercise?.sets ?? '');
    setReps(exercise?.reps ?? '');
    setError(null);
    setSuccess(false);
  }, [exercise?.id]);

  const validate = () => {
    if (!libraryId) return 'Please select an exercise.';
    const setsNum = Number(sets);
    const repsNum = Number(reps);
    if (!sets || isNaN(setsNum) || setsNum < 1) return 'Sets must be at least 1.';
    if (setsNum > 100) return 'Sets cannot exceed 100.';
    if (!reps || isNaN(repsNum) || repsNum < 1) return 'Reps must be at least 1.';
    if (repsNum > 100) return 'Reps cannot exceed 100.';
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSuccess(false);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await onSave({
        exerciseLibraryId: Number(libraryId),
        sets: Number(sets),
        reps: Number(reps),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);

    } catch (err) {
      setError(err.message || 'Failed to save exercise.');
    } finally {
      setSaving(false);
    }
  };

  const libraryOptions = library.map((ex) => ({
    value: ex.id,
    label: ex.name,
  }));

  const setsOver = Number(sets) > 100;
  const repsOver = Number(reps) > 100;

  return (
    <div className="exercise-row">
      <div className="exercise-row-main">
        <Dropdown
          value={libraryId}
          onChange={(val) => { setLibraryId(val); setError(null); setSuccess(false); }}
          options={libraryOptions}
          placeholder="Select exercise..."
          disabled={disabled || saving}
        />

        <div className="exercise-row-sets-reps">
          <input
            className={`exercise-row-number ${setsOver ? 'exercise-row-number--error' : ''}`}
            type="number"
            min="1"
            max="100"
            placeholder="Sets"
            value={sets}
            onChange={(e) => { setSets(e.target.value); setError(null); setSuccess(false); }}
            disabled={disabled || saving}
          />
          <span className="exercise-row-times">×</span>
          <input
            className={`exercise-row-number ${repsOver ? 'exercise-row-number--error' : ''}`}
            type="number"
            min="1"
            max="100"
            placeholder="Reps"
            value={reps}
            onChange={(e) => { setReps(e.target.value); setError(null); setSuccess(false); }}
            disabled={disabled || saving}
          />
        </div>

        <div className="exercise-row-actions">
          <button
            className="exercise-row-save"
            onClick={handleSave}
            disabled={disabled || saving}
            title="Save"
          >
            {saving ? '...' : <BsCheckLg />}
          </button>
          {exercise && (
            <button
              className="exercise-row-delete"
              onClick={() => onDelete(exercise.id)}
              disabled={disabled}
              title="Remove"
            >
              <BsTrash3 />
            </button>
          )}
        </div>
      </div>

      {success && (
        <div className="exercise-row-success">
          Exercise updated successfully!
        </div>
      )}

      {error && (
        <div className="exercise-row-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default ExerciseRow;