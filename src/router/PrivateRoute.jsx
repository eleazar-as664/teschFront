import React from "react";
import { Navigate,   } from "react-router-dom";

export const PrivateRoute = ({ element, allowedProfiles }) => {
 
  // console.log('ENTROO PERROOOOO EN EL PRIVATE RUTA')
  // const user = JSON.parse(localStorage.getItem("user"));

  // // Función para verificar si el usuario tiene los perfiles necesarios
  // const hasRequiredProfiles = (userProfiles, requiredProfiles) => {
  //   console.log("Perfiles del usuario:", userProfiles);
  //   console.log("Perfiles requeridos para la ruta:", requiredProfiles);
  //   return requiredProfiles.every((requiredProfile) => {
  //     return userProfiles.some((profile) => profile.Name === requiredProfile);
  //   });
  // };

  // // En tu componente PrivateRoute
  // if (user && hasRequiredProfiles(user.Profiles, allowedProfiles)) {
  //   return element;
  // } else {
  //   console.log("Redirecting to /login");
  //   return <Navigate to="/login" />;
  // }

  const user = JSON.parse(localStorage.getItem("user"));


  // Función para verificar si el usuario tiene los perfiles necesarios
  const hasRequiredProfiles = (userProfiles, requiredProfiles) => {
    return requiredProfiles.every((requiredProfile) => {
      return userProfiles.some((profile) => profile.Name === requiredProfile);
    });
  };

  // Verificar si el usuario ya ha iniciado sesión
  if (!user) {
    // Si el usuario no ha iniciado sesión, redirigirlo a la página de inicio de sesión
    return <Navigate to="/login" />;
  } else if (!hasRequiredProfiles(user.Profiles, allowedProfiles)) {
    // Si el usuario no tiene los perfiles necesarios para acceder a la ruta, mostrar un mensaje
    return <p>No tienes permiso para acceder a esta página.</p>;
  }

  // Si el usuario tiene los perfiles necesarios, permitir el acceso a la ruta
  return element;
};
