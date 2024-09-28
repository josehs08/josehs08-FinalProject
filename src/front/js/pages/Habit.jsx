import React, { useContext } from 'react';
import { ShowHabits } from '../component/ShowHabits.jsx';
import { Context } from '../store/appContext.js';
import { Navigate } from 'react-router-dom';

export const Habit = () => {
  const { store } = useContext(Context);

  if (store.user) {
    return (
      <div className='d-flex m-5 gap-3'>
        <ShowHabits />
      </div>
    );
  }
  return <Navigate to='/' />;
};
