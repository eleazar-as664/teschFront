// En LoginForm.js
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useHistory } from "react-router-dom";

import "./LoginForm.css";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí puedes realizar la autenticación verificando las credenciales
    
    if (username === "admin" && password === "admin") {
      // Si las credenciales son correctas, llamar a la función onLogin
      // Pasando los datos del usuario
      onLogin({ username, profile: "admin" });

      // Redirigir al usuario a la página de administrador
      history.push("/admin");
    } else if (username === "solicitante" && password === "solicitante") {
      // Autenticación para solicitantes
      onLogin({ username, profile: "solicitante" });

      // Redirigir al usuario a la página de solicitante
      history.push("/solicitante");
    } else {
      // Mostrar un mensaje de error si las credenciales son incorrectas
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="general">
      <Toast />
      <form onSubmit={handleSubmit}>
        <div className="login-container">
          <h2>TechsConsulting</h2>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user" />
            </span>
            <InputText
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-lock" />
            </span>
            <InputText
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" label="Iniciar sesión" />
          {error && <div className="error-message">{error}</div>}
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
