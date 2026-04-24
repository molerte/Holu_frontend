import { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RiRestTimeLine } from "react-icons/ri";
import './DayDetailModal.css';

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
    SUNDAY: 'Sunday',
};

const getBackground = (muscleGroup) =>
    MUSCLE_COLORS[muscleGroup?.toLowerCase()] ?? MUSCLE_COLORS.back;

const DayDetailModal = memo(({ isOpen, onClose, day }) => {

    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.dataset.scrollY = String(scrollY);
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.overflow = 'hidden';
        } else {
            const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            delete document.body.dataset.scrollY;
            window.scrollTo(0, scrollY);
        }
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !day) return null;

    const isRest = day.restDay;
    const dayName = DAY_NAMES[day.dayOfWeek] ?? day.dayOfWeek ?? '';
    const background = isRest ? MUSCLE_COLORS.rest : getBackground(day.muscleGroup);

    return createPortal(
        <>
            <div className="day-detail-blur" aria-hidden="true" />
            <div
                className="day-detail-overlay"
                onMouseDown={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <div
                    className="day-detail-modal"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div
                        className="day-detail-modal-header"
                        style={{ background }}
                    >
                        <div className="day-detail-modal-header-content">
                            <span className="day-detail-modal-header-day-label">{dayName}</span>
                            <span className="day-detail-modal-header-muscle">
                                {isRest ? 'REST' : day.muscleGroup}
                            </span>
                            {isRest && (
                                <span className="day-detail-modal-rest-label">Active Rest Day</span>
                            )}
                        </div>
                        <button
                            className="day-detail-modal-close"
                            onClick={onClose}
                            title="Close"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="day-detail-modal-body">

                        {!isRest && (
                            <div className="day-detail-modal-exercises">
                                {day.exercises && day.exercises.length > 0 ? (
                                    <>
                                        <p className="day-detail-modal-exercises-label">
                                            {day.exercises.length} exercise{day.exercises.length !== 1 ? 's' : ''}
                                        </p>
                                        <div className="day-detail-modal-exercise-list">
                                            {day.exercises.map((ex) => (
                                                <div key={ex.id} className="day-detail-modal-exercise-row">
                                                    <span className="day-detail-modal-exercise-name">{ex.name}</span>
                                                    <span className="day-detail-modal-exercise-sets">
                                                        {ex.sets}
                                                        <span className="day-detail-modal-exercise-x"> × </span>
                                                        {ex.reps}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="day-detail-modal-empty">No exercises listed.</p>
                                )}
                            </div>
                        )}

                        {isRest && (
                            <div className="day-detail-modal-rest-message">
                                <span className="day-detail-modal-rest-icon"><RiRestTimeLine /></span>
                                <p>This is a rest day. Recovery is part of the program!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
});

DayDetailModal.displayName = 'DayDetailModal';

export default DayDetailModal;