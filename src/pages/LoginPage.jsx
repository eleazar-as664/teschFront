import React, { useState,useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hook/useForm";
import axios from "axios"; // Importar Axios
import "../Components/LoginForm/LoginForm.css";
export const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const { name, password, onInputChange } = useForm({
    name: "",
    email: "",
    password: "",
  });

  let toast;
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (user) {
      const firstProfilePath = user.Profiles[0]?.Path;
      if (firstProfilePath) {
        return navigate(firstProfilePath);;
      }
    }
  }, [user,navigate]);
  const onLoginPrueba = async (e) => { 
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/v1/SignIn", {
        UserName: name,
        Password: password,
        SecretKey: "O6XcIjRgEOvvRyO0QFHzf5jllsuzCiLEZj9YftaOwg"
      });

      const user = response.data.data; 
       
      console.log('Lo LOGRASTE, TOMA PERRROOO',user)
      localStorage.setItem("user", JSON.stringify(user));
      const firstProfilePath = user.Profiles[0]?.Path;
      console.log('OLAAAAAAAAAA', firstProfilePath)
      navigate(firstProfilePath);
    } catch (error) {
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
      <form onSubmit={onLoginPrueba}>
    
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
