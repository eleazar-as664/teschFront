import React from 'react';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ element, allowedProfiles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('Current location:', window.location.pathname);
  console.log('User profile:', user ? user.profile : 'No user found');
  console.log('Allowed profiles:', allowedProfiles);
  if (user && allowedProfiles.includes(user.profile)) {
    return element;
  } else {
    console.log('Redirecting to /login')
    return <Navigate to="/login" />;
  }
};