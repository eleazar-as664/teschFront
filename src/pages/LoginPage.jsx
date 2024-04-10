import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hook/useForm";
import "../Components/LoginForm/LoginForm.css";
export const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const { name, email, password, onInputChange } = useForm({
    name: "",
    email: "",
    password: "",
  });

  let toast;
  const onLogin = (e) => {
    e.preventDefault();

    const allowedUsers = [
      {
        email: "admin@example.com",
        password: "admin123",
        name: "Admin",
        profile: "admin",
        redirectPath: "/Administrador",
      },
      {
        email: "solicitante@example.com",
        password: "123",
        name: "Solicitante",
        profile: "solicitante",
        redirectPath: "/Requisitor",
      },
      {
        email: "proveedor@example.com",
        password: "1234",
        name: "Proveedor",
        profile: "proveedor",
        redirectPath: "/Proveedor",
      },
    ];

    const user = allowedUsers.find(
      (u) => u.name === name && u.password === password
    );
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      navigate(user.redirectPath);
    } else {
      // Realizar alguna acción si las credenciales no son válidas, como mostrar un mensaje de error
    
      setError("Credenciales incorrectas");
      toast.show({
        severity: "warn",
        summary: "Notificación",
        detail: "¡Credenciales incorrectas!",
        life: 3000,
      });
    }
  };
  return (
    <div className="general">
      <Toast ref={(el) => (toast = el)} />
      <form onSubmit={onLogin}>
    
        <div className="login-container">
          <h2>TeschConsulting</h2>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user" />
            </span>
            <InputText
              placeholder="Username"
              name="name"
              id="name"
              value={name}
              onChange={onInputChange}
              autoComplete="off"
            />
          </div>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-lock" />
            </span>
            <InputText
              placeholder="Password"
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={onInputChange}
              required
              autoComplete="off"
            />
          </div>
          <Button type="submit" label="Iniciar sesión" />
          {error && <div className="error-message">{error}</div>}
        </div>
      </form>
    </div>
  );
};
