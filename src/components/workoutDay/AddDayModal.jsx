import { useState, memo } from 'react';
import { Modal, Button, Dropdown, ErrorMessage } from '../common/Common';
import { addDay } from '../../api/workoutDayApi';
import { useAuth } from '../../context/AuthContext';
import './AddDayModal.css';

const ALL_DAYS = [
    'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
];

const MUSCLE_GROUPS = [
    'Back', 'Chest', 'Legs', 'Arms', 'Shoulders', 'Core',
];

const AddDayModal = memo(({ isOpen, onClose, routineId, existingDays = [], onAdded }) => {
    const { token } = useAuth();
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('');
    const [isRest, setIsRest] = useState(false);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const existingDayNames = existingDays.map((d) => d.dayOfWeek);
    const availableDays = ALL_DAYS
        .filter((d) => !existingDayNames.includes(d))
        .map((d) => ({
            value: d,
            label: d.charAt(0) + d.slice(1).toLowerCase(),
        }));

    const handleClose = () => {
        setDayOfWeek('');
        setMuscleGroup('');
        setIsRest(false);
        setError(null);
        onClose();
    };

    const handleSave = async () => {
        if (!dayOfWeek) {
            setError('Please select a day.');
            return;
        }
        if (!isRest && !muscleGroup) {
            setError('Please select a workout type.');
            return;
        }

        setSaving(true);
        setError(null);
        try {
            const newDay = await addDay(routineId, {
                dayOfWeek,
                muscleGroup: isRest ? 'REST' : muscleGroup,
                restDay: isRest,
            }, token);
            onAdded(newDay);
            handleClose();
        } catch (err) {
            setError(err.message || 'Failed to add day.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Add Workout Day">

            {availableDays.length === 0 ? (
                <p className="add-day-full">
                    All 7 days are already added to this routine.
                </p>
            ) : (
                <>
                    <div className="add-day-section">
                        <label className="add-day-label">Day *</label>
                        <Dropdown
                            value={dayOfWeek}
                            onChange={(val) => { setDayOfWeek(val); setError(null); }}
                            options={availableDays}
                            placeholder="Select a day..."
                        />
                    </div>

                    <div className="add-day-rest-toggle">
                        <label className="add-day-toggle-label">
                            <input
                                type="checkbox"
                                className="add-day-checkbox"
                                checked={isRest}
                                onChange={(e) => {
                                    setIsRest(e.target.checked);
                                    if (e.target.checked) setMuscleGroup('');
                                    setError(null);
                                }}
                            />
                            <span className="add-day-toggle-text">Mark as ACTIVE REST day</span>
                        </label>
                    </div>

                    {!isRest && (
                        <div className="add-day-section">
                            <label className="add-day-label">Workout Type *</label>
                            <Dropdown
                                value={muscleGroup}
                                onChange={(val) => { setMuscleGroup(val); setError(null); }}
                                options={MUSCLE_GROUPS}
                                placeholder="Select muscle group..."
                            />
                        </div>
                    )}

                    <ErrorMessage message={error} />

                    <div className="add-day-actions">
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={saving || !dayOfWeek || (!isRest && !muscleGroup)}
                        >
                            {saving ? 'Adding...' : 'Add Day'}
                        </Button>
                    </div>
                </>
            )}
        </Modal>
    );
});

AddDayModal.displayName = 'AddDayModal';

export default AddDayModal;