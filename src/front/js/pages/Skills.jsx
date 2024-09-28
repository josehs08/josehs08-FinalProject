import React, { useContext } from 'react';
import { ShowSkills } from '../component/ShowSkills.jsx';
import { Navigate } from 'react-router-dom';
import { Context } from '../store/appContext.js';

export const Skills = () => {
  const { store } = useContext(Context);
  if (store.user) {
    return (
      <div className='d-flex m-5 '>
        <ShowSkills />
      </div>
    );
  } else {
    return <Navigate to='/' />;
  }
};
