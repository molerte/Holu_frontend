import React, { useEffect, useState } from "react";
import "./MyRoutines.css";

/* ---------------------- 1. Muscle Group Modal ---------------------- */
function MuscleGroupModal({ visible, onClose, onSelect }) {
  if (!visible) return null;

  const muscleGroups = [
    "Chest",
    "Back",
    "Shoulders",
    "Legs",
    "Arms",
    "Core",
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Muscle Group</h2>

        {muscleGroups.map((g) => (
          <div
            key={g}
            className="routine-option"
            onClick={() => onSelect(g)}
          >
            {g}
          </div>
        ))}

        <button className="close-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ---------------------- 2. Exercise List Modal ---------------------- */
function ExerciseModal({ visible, onClose, day, exercises, onAddExercise }) {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{day} Exercises</h2>

        {exercises.length === 0 && <p>No exercises yet.</p>}

        <ul>
          {exercises.map((ex) => (
            <li key={ex.id}>
              {ex.name} — {ex.sets}x{ex.reps}
            </li>
          ))}
        </ul>

        <button onClick={onAddExercise}>Add Exercise</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

/* -------------------- 3. Add Exercise Modal ---------------------- */
function AddExerciseModal({ visible, onClose, exercises, onSelect }) {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Exercise</h2>

        {exercises.map((ex) => (
          <div
            key={ex.id}
            className="routine-option"
            onClick={() => onSelect(ex)}
          >
            {ex.name}
          </div>
        ))}

        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

/* ---------------------- MAIN ROUTINES ---------------------- */
function MyRoutines() {
  const [routines, setRoutines] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const [showMuscleModal, setShowMuscleModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [dayExercises, setDayExercises] = useState([]);

  const [addExerciseModalVisible, setAddExerciseModalVisible] = useState(false);
  const [exerciseLibrary, setExerciseLibrary] = useState([]);

  const [routineId, setRoutineId] = useState(null);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  /* ---------------------- Load User Routine ---------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/routines", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setRoutineId(data[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (!routineId) return;

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/routines/${routineId}/days`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRoutines(
          data.map((d) => ({
            id: d.id,
            day: d.dayOfWeek.charAt(0) + d.dayOfWeek.slice(1).toLowerCase(),
            name: d.muscleGroup,
            routineId: routineId,
          }))
        );
      });
  }, [routineId]);

  /* ---------------------- Handle Day Click ---------------------- */
  const handleDayClick = (day) => {
    if (editMode) {
      setSelectedDay(day);
      setShowMuscleModal(true);
    } else {
      openExerciseModal(day);
    }
  };

  /* ---------------------- Assign Muscle Group to Day ---------------------- */
  const handleSelectMuscleGroup = (group) => {
    const token = localStorage.getItem("token");

    const existing = routines.find(
      (r) => r.day.toLowerCase() === selectedDay.toLowerCase()
    );

    const payload = {
      dayOfWeek: selectedDay.toUpperCase(),
      muscleGroup: group,
      restDay: false,
    };

    const url = existing
      ? `http://localhost:8080/api/routines/${routineId}/days/${existing.id}`
      : `http://localhost:8080/api/routines/${routineId}/days`;

    const method = existing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((newDay) => {
        const normalized = newDay.dayOfWeek.toLowerCase();

        setRoutines((prev) =>
          prev
            .filter((d) => d.day.toLowerCase() !== normalized)
            .concat({
              id: newDay.id,
              day: normalized.charAt(0).toUpperCase() + normalized.slice(1),
              name: newDay.muscleGroup,
              routineId,
            })
        );

        setShowMuscleModal(false);
      });
  };

  /* ---------------------- Open Exercise Modal ---------------------- */
  const openExerciseModal = (day) => {
    const token = localStorage.getItem("token");

    const dayObj = routines.find(
      (r) => r.day.toLowerCase() === day.toLowerCase()
    );
    if (!dayObj) return;

    fetch(
      `http://localhost:8080/api/routines/${dayObj.routineId}/days/${dayObj.id}/exercises`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then((data) => {
        setDayExercises(data);
        setSelectedDay(day);
        setSelectedDayId(dayObj.id);
        setExerciseModalVisible(true);
      });
  };

  /* ---------------------- Open Add Exercise Modal ---------------------- */
 const openAddExerciseModal = () => {
  const assigned = routines.find(
    (r) => r.day.toLowerCase() === selectedDay.toLowerCase()
  );

  if (!assigned) return;

  fetch(
    `http://localhost:8080/api/exercise-library?muscleGroup=${assigned.name}`
  )
    .then((res) => res.json())
    .then((data) => {
      setExerciseLibrary(data);
      setAddExerciseModalVisible(true);
    });
};
  /* ---------------------- Add Exercise ---------------------- */
 const addExercise = (exercise) => {
  const token = localStorage.getItem("token");

  const assigned = routines.find(
    (r) => r.day.toLowerCase() === selectedDay.toLowerCase()
  );

  if (!assigned) return;

  fetch(
    `http://localhost:8080/api/routines/${assigned.routineId}/days/${selectedDayId}/exercises`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exerciseLibraryId: exercise.id,
        sets: 3,
        reps: 10,
      }),
    }
  )
    .then((res) => res.json())
    .then((newEx) => {
      setDayExercises((prev) => [...prev, newEx]);
      setAddExerciseModalVisible(false);
    });
};
  /* ---------------------- Render ---------------------- */
  return (
    <div className="routine-wrapper">
      <h1 className="routine-title">My Routine</h1>
      <div className="routine-divider"></div>

      <div className="routine-grid">
        {days.map((day) => {
          const assigned = routines.find(
            (r) => r.day.toLowerCase() === day.toLowerCase()
          );

          return (
            <div
              key={day}
              className={`routine-card ${editMode ? "editable" : ""}`}
              onClick={() => handleDayClick(day)}
            >
              <strong>{day}</strong>
              <div className="routine-label">
                {assigned ? assigned.name : "No routine"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="routine-actions">
        <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Done" : "Edit"}
        </button>
        <button className="publish-btn">Publish</button>
      </div>

      /* Muscle Group Modal */
      <MuscleGroupModal
        visible={showMuscleModal}
        onClose={() => setShowMuscleModal(false)}
        onSelect={handleSelectMuscleGroup}
      />

      /* Exercise List Modal */
      <ExerciseModal
        visible={exerciseModalVisible}
        day={selectedDay}
        exercises={dayExercises}
        onAddExercise={openAddExerciseModal}
        onClose={() => setExerciseModalVisible(false)}
      />

      /* Add Exercise Modal */
      <AddExerciseModal
        visible={addExerciseModalVisible}
        exercises={exerciseLibrary}
        onSelect={addExercise}
        onClose={() => setAddExerciseModalVisible(false)}
      />
    </div>
  );
}

export default MyRoutines;