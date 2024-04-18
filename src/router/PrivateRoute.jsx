import React from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ element, allowedProfiles }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const hasRequiredProfiles = (userProfiles, requiredProfiles) => {
    return requiredProfiles.every((requiredProfile) => {
      return userProfiles.some((profile) => profile.Name === requiredProfile);
    });
  };

  if (!user) {
    return <Navigate to="/login" />;
  } else if (!hasRequiredProfiles(user.Profiles, allowedProfiles)) {
    return <p>No tienes permiso para acceder a esta página.</p>;
  }

  return element;
};
