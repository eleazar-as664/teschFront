import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

import { useNavigate } from "react-router-dom";

function NotFount() {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const header = (
    <div>
      <h1> 404 </h1>
      <h2>Error 404 - Página no encontrada</h2>
    </div>
  );
 const  handleGoBack = () => {
  if (user && user.Profiles && user.Profiles.length > 0) {
    const firstProfilePath = user.Profiles[0].Path;
    console.log('firstProfilePath', firstProfilePath);
    if (firstProfilePath) {
      return navigate(firstProfilePath);
    } else {
      return navigate("/login");
    }
  } else {
    return navigate("/login");
  }
  };
  const footer = (
    <Button
      label="Regresar"
      icon="pi pi-arrow-left"
       onClick={handleGoBack}
    />
  );
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <Card title={header} footer={footer} style={{ width: "400px" }}>
        <p>Lo sentimos, la página que estás buscando no existe.</p>
      </Card>
    </div>
  );
}

export default NotFount;
