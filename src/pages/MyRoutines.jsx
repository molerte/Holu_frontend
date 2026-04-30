import { useState } from 'react';
import { useMyRoutines } from '../hooks/useRoutines';
import { useAuth } from '../context/AuthContext';
import RoutineCard from '../components/routine/RoutineCard';
import CreateRoutineModal from '../components/routine/CreateRoutineModal';
import { createRoutine } from '../api/routineApi';
import { addDay } from '../api/workoutDayApi';
import { GiWeightLiftingUp } from "react-icons/gi";
import './MyRoutines.css';


const RoutineCardSkeleton = () => (
 <div className="my-routines-skeleton">
   <div className="my-routines-skeleton-title" />
   <div className="my-routines-skeleton-days">
     {[...Array(5)].map((_, i) => (
       <div key={i} className="my-routines-skeleton-day" />
     ))}
   </div>
 </div>
);


const MyRoutinesPage = () => {
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
     console.log('[MyRoutinesPage] routine created:', routine.id);


     for (const day of workoutDays) {
       await addDay(routine.id, day, token);
       console.log('[MyRoutinesPage] day added:', day.dayOfWeek);
     }


     setShowCreate(false);


     await refetch();
     console.log('[MyRoutinesPage] refetch complete');


   } catch (err) {
     console.error('[MyRoutinesPage] handleCreate error:', err);
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
       console.error('[MyRoutinesPage] handleDelete error:', err);
     }
   }
 };


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
         + Create Routine
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


export default MyRoutinesPage;



