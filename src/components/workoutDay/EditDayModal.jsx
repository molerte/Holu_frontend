import { useState, useEffect, useMemo, memo } from 'react';
import { Modal, Button, Dropdown, ErrorMessage } from '../common/Common.jsx';
import ExerciseRow from '../exercise/ExerciseRow';
import { useExerciseLibrary } from '../../hooks/useExercisesLibrary';
import { useExercises } from '../../hooks/useExercises';
import { updateDay } from '../../api/workoutDayApi';
import { useAuth } from '../../context/AuthContext';
import { BsPlusLg } from "react-icons/bs";
import { BsPlus } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";
import './EditDayModal.css';

const MUSCLE_GROUPS = [
  'Back', 'Chest', 'Legs', 'Arms', 'Shoulders', 'Core',
];

const DAY_NAMES = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
};

const EditDayModal = memo(({ isOpen, onClose, day, routineId, onUpdated }) => {
  const { token } = useAuth();

  const [muscleGroup, setMuscleGroup] = useState('');
  const [isRest, setIsRest] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showNewRow, setShowNewRow] = useState(false);

  const stableRoutineId = useMemo(() => routineId, [routineId]);
  const stableDayId = useMemo(() => day?.id ?? null, [day?.id]);

  const { library } = useExerciseLibrary(isRest ? null : muscleGroup);
  const { exercises, add, update, remove } = useExercises(stableRoutineId, stableDayId);

  useEffect(() => {
    if (!day) return;
    setMuscleGroup(day.restDay ? '' : (day.muscleGroup ?? ''));
    setIsRest(day.restDay ?? false);
    setError(null);
    setWarning(null);
    setShowNewRow(false);
  }, [day?.id]);

  const handleMuscleGroupChange = (val) => {
    setMuscleGroup(val);
    setShowNewRow(false);
    setError(null);
    if (val !== day?.muscleGroup && exercises.length > 0) {
      setWarning(<><IoIosWarning /> Changing to {val} will remove {exercises.length} existing exercise{exercises.length !== 1 ? 's' : ''}.</>);
    } else {
      setWarning(null);
    }
  };

  const handleRestToggle = (checked) => {
    setIsRest(checked);
    setMuscleGroup('');
    setError(null);
    if (checked && exercises.length > 0) {
      setWarning(<><IoIosWarning /> Marking as ACTIVE REST will remove {exercises.length} existing exercise{exercises.length !== 1 ? 's' : ''}.</>);
    } else {
      setWarning(null);
    }
  };

  const handleSaveDay = async () => {
    if (!isRest && !muscleGroup) {
      setError('Please select a workout type.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await updateDay(routineId, day.id, {
        dayOfWeek: day.dayOfWeek,
        muscleGroup: isRest ? 'REST' : muscleGroup,
        restDay: isRest,
      }, token);
      setWarning(null);
      onUpdated(updated);
    } catch (err) {
      setError(err.message || 'Failed to update day.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddExercise = async (data) => {
    try {
      await add(data);
      setShowNewRow(false);
    } catch (err) {
      setError(err.message || 'Failed to add exercise.');
    }
  };

  const handleUpdateExercise = async (exerciseId, data) => {
    try {
      await update(exerciseId, data);
    } catch (err) {
      setError(err.message || 'Failed to update exercise.');
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await remove(exerciseId);
    } catch (err) {
      setError(err.message || 'Failed to delete exercise.');
    }
  };

  const usedLibraryIds = useMemo(() => exercises.map((ex) => ex.exerciseLibraryId), [exercises]);
  const newRowLibrary = useMemo(() => library.filter((lib) => !usedLibraryIds.includes(lib.id)),
    [library, usedLibraryIds]
  );
  const hasLibraryConflict = !isRest && muscleGroup && library.some((ex) => usedLibraryIds.includes(ex.id) && ex.muscleGroup !== muscleGroup);


  if (!day) return null;

  const dayDisplayName = DAY_NAMES[day.dayOfWeek] ?? day.dayOfWeek ?? '';
  const muscleGroupChanged = muscleGroup !== day.muscleGroup;


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enter Details"
      badge={dayDisplayName}
    >
      <div className="edit-day-rest-toggle">
        <label className="edit-day-toggle-label">
          <input
            type="checkbox"
            className="edit-day-checkbox"
            checked={isRest}
            onChange={(e) => handleRestToggle(e.target.checked)}
          />
          <span className="edit-day-toggle-text">Mark as ACTIVE REST day</span>
        </label>
      </div>

      {!isRest && (
        <div className="edit-day-section">
          <label className="edit-day-label">Workout Type *</label>
          <Dropdown
            value={muscleGroup}
            onChange={handleMuscleGroupChange}
            options={MUSCLE_GROUPS}
            placeholder="Select muscle group..."
          />
        </div>
      )}

      {warning && (
        <div className="edit-day-warning">{warning}</div>
      )}

      {!isRest && muscleGroup && (
        <div className="edit-day-section">
          <div className="edit-day-exercises-header">
            <label className="edit-day-label">
              Exercises
              {muscleGroupChanged && (
                <span className="edit-day-label-note"> (save type change first)</span>
              )}
            </label>
            <button
              className="edit-day-add-btn"
              onClick={() => setShowNewRow(true)}
              disabled={showNewRow || muscleGroupChanged}
              title={muscleGroupChanged ? 'Save workout type change first' : 'Add exercise'}
            >
              <BsPlus />
            </button>
          </div>

          <div className="edit-day-exercises">
            {!muscleGroupChanged && exercises.map((ex) => {
              const availableLibrary = library.filter(
                (lib) => !usedLibraryIds.includes(lib.id) || lib.id === ex.exerciseLibraryId
              );
              return (
                <ExerciseRow
                  key={ex.id}
                  exercise={ex}
                  library={availableLibrary}
                  onSave={(data) => handleUpdateExercise(ex.id, data)}
                  onDelete={handleDeleteExercise}
                />
              );
            })}

            {!muscleGroupChanged && showNewRow && (
              <ExerciseRow
                exercise={null}
                library={newRowLibrary}
                onSave={handleAddExercise}
                onDelete={() => setShowNewRow(false)}
              />
            )}

            {!muscleGroupChanged && exercises.length === 0 && !showNewRow && (
              <p className="edit-day-empty">No exercises yet. Click + to add one.</p>
            )}

            {muscleGroupChanged && (
              <p className="edit-day-empty">
                Save the workout type change first, then add exercises.
              </p>
            )}
          </div>
        </div>
      )}

      <ErrorMessage message={error} />

      <div className="edit-day-actions">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleSaveDay}
          disabled={saving || (!isRest && !muscleGroup)}
        >
          {saving ? 'Saving...' : 'Update'}
        </Button>
      </div>
    </Modal>
  );
});

EditDayModal.displayName = 'EditDayModal';

export default EditDayModal;
