import './DayCard.css'

const MUSCLE_COLORS = {
    back: 'linear-gradient(135deg, #6f28f4ff, #200b4fff)',
    chest: 'linear-gradient(135deg, #fb5417ff, #7e3919ff)',
    legs: 'linear-gradient(135deg, #2e81c0ff, #083b53ff)',
    arms: 'linear-gradient(135deg, #129247ff, #073820ff)',
    shoulders: 'linear-gradient(135deg, #ac1849ff, #4d061dff)',
    core: 'linear-gradient(135deg, #c805b7ff, #4a0a46ff)',
    rest: 'linear-gradient(135deg, #4a4a4aff, #000000ff)',
};

const DAY_NAMES = {
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
    SUNDAY: 'Sunday'
};

const getBackground = (muscleGroup) =>
    MUSCLE_COLORS[muscleGroup?.toLowerCase()] || MUSCLE_COLORS.back;

const DayCard = ({ day, isOwner = false, onEdit, onDelete }) => {
    const isRest = day.restDay;
    const dayLabel = DAY_NAMES[day.dayOfWeek] ?? day.dayOfWeek ?? '';

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm(`Delete ${dayLabel}?`)) {
            onDelete(day.id);
        }
    };

    return (
        <div
            className={`day-card ${isRest ? 'day-card--rest' : ''} ${isOwner ? 'day-card--editable' : ''}`}
            style={{ background: isRest ? MUSCLE_COLORS.rest : getBackground(day.muscleGroup) }}
            onClick={() => isOwner && onEdit && onEdit(day)}
        >
            <div className="day-card-day-label">{dayLabel}</div>

            {isOwner && (
                <button
                    className="day-card-delete"
                    onClick={handleDelete}
                    title={`Delete ${dayLabel}`}
                >
                    ✕
                </button>
            )}

            {isOwner && (
                <div className="day-card-edit-hint">Edit</div>
            )}

            <div className="day-card-muscle">
                {isRest ? 'REST' : day.muscleGroup}
            </div>

            <div className="day-card-exercises">
                {isRest ? (
                    <span className="day-card-rest-label">Active Rest day</span>
                ) : (
                    day.exercises?.slice(0, 3).map((ex) => (
                        <span key={ex.id} className="day-card-exercise">
                            – {ex.name} {ex.sets}×{ex.reps}
                        </span>
                    ))
                )}
                {!isRest && day.exercises?.length > 3 && (
                    <span className="day-card-more">
                        +{day.exercises.length - 3} more
                    </span>
                )}
            </div>
        </div>
    );
};

export const DayCardGrid = ({
    days, routineId, isOwner = false, onEdit, onDelete, onAddDay,
}) => {
    const isFull = days.length >= 7;

    return (
        <div className="day-card-grid">
            {days.map((day) => (
                <DayCard
                    key={day.id}
                    day={day}
                    routineId={routineId}
                    isOwner={isOwner}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}

            {isOwner && onAddDay && (
                <button
                    className={`day-card-add ${isFull ? 'day-card-add--disabled' : ''}`}
                    onClick={isFull ? undefined : onAddDay}
                    disabled={isFull}
                    title={isFull ? 'All 7 days have been added' : 'Add a workout day'}
                >
                    <span className="day-card-add-plus">+</span>
                    <span className="day-card-add-label">
                        {isFull ? 'Full' : 'Add Day'}
                    </span>
                </button>
            )}
        </div>
    );
};

export default DayCard;