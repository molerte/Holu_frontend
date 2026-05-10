import { useState } from 'react';
import { useMyRoutines } from '../hooks/useRoutines';
import { useAuth } from '../context/AuthContext';
import RoutineCard from '../components/routine/RoutineCard';
import CreateRoutineModal from '../components/routine/CreateRoutineModal';
import { createRoutine } from '../api/routineApi';
import { addDay } from '../api/workoutDayApi';
import { GiWeightLiftingUp } from "react-icons/gi";
import './MyRoutines.css';

/* This is myRoutines page! This page does the magic of this app.
   What this page does it allows users to create their own routine and manage them 
   by editing or deleting them */

// To make the loading state modern and less boring, I made this skeleton
// (thats whats it called in the design world) with I set it to 5 days to make 
// it less akward (I tried 7 and its ugly)
const RoutineCardSkeleton = () => (
  <div className="my-routines-skeleton">
    <div className="my-routines-skeleton-title" />
    <div className="my-routines-skeleton-days">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="my-routines-skeleton-day" />
      ))}
    </div>
  </div>
);

const MyRoutines = () => {
  const { token } = useAuth();
  const { routines, loading, error, remove, refetch } = useMyRoutines();
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);


  const handleCreate = async ({ title, description, tags, workoutDays }) => {
    setCreating(true);
    setCreateError(null);

    try {
      const routine = await createRoutine({ title, description, tags }, token);


      for (const day of workoutDays) {
        await addDay(routine.id, day, token);
      }
      setShowCreate(false);
      await refetch();
    } catch (err) {
      console.error('[MyRoutines] handleCreate error:', err);
      setCreateError(err.message || 'Failed to create routine.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this routine?')) {
      try {
        await remove(id);
      } catch (err) {
        console.error('[MyRoutines] handleDelete error:', err);
      }
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="my-routines-page-list">
          {[...Array(2)].map((_, i) => <RoutineCardSkeleton key={i} />)}
        </div>
      );
    }

    if (error) {
      return <div className="my-routines-page-error">{error}</div>;
    }

    if (routines.length === 0) {
      return (
        <div className="my-routines-page-empty">
          <div className="my-routines-page-empty-icon"><GiWeightLiftingUp /></div>
          <p>You haven't created any routines yet.</p>
          <button
            className="my-routines-page-empty-btn"
            onClick={() => setShowCreate(true)}
          >
            Create your first routine
          </button>
        </div>
      );
    }

    return (
      <div className="my-routines-page-list">
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            isOwner={true}
            onDelete={handleDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="my-routines-page">
      <div className="my-routines-page-header">
        <div>
          <h1 className="my-routines-page-heading">My<br /> Routines</h1>
          <p className="my-routines-page-sub">
            {loading
              ? 'Loading...'
              : `${routines.length} routine${routines.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          className="my-routines-page-create-btn"
          onClick={() => {
            setCreateError(null);
            setShowCreate(true);
          }}
        >
          <span>+</span> Create Routine
        </button>
      </div>

      {createError && (
        <div className="my-routines-page-error">{createError}</div>
      )}
      {renderContent()}

      <CreateRoutineModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
        loading={creating}
      />
    </div>
  );
};

export default MyRoutines;



