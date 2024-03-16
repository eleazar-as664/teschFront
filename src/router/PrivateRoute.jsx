import React from 'react';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ element, allowedProfiles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('************Los usuarios son: :b***************', element);
  console.log(user);
  if (user && allowedProfiles.includes(user.profile)) {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
};