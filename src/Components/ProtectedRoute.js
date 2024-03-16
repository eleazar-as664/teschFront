// En ProtectedRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedProfiles, ...props }) => {
  // Verificar si el usuario está autenticado y tiene el perfil correcto
  if (!user || !allowedProfiles.includes(user.profile)) {
    // Si no está autenticado o no tiene el perfil correcto, redirigir al inicio de sesión
    return <Navigate to="/login" />;
  }

  // Si está autenticado y tiene el perfil correcto, renderizar la ruta
  return <Route {...props} />;
};

export default ProtectedRoute;
