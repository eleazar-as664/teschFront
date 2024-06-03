import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hook/useForm";
import axios from "axios"; // Importar Axios
import "../Components/LoginForm/LoginForm.css";

import routes from "../utils/routes";
export const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const { name, password, onInputChange } = useForm({
    name: "",
    password: "",
  });

  const toast = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (user) {
      const firstProfilePath = user.Profiles[0]?.Path;
      if (firstProfilePath) {
        return navigate(firstProfilePath);
      }
    }
  }, [user, navigate]);
  const onLoginPrueba = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${routes.BASE_URL_SERVER}/SignIn`, {
        UserName: name,
        Password: password,
        SecretKey: "O6XcIjRgEOvvRyO0QFHzf5jllsuzCiLEZj9YftaOwg",
      });
      console.log(response);
      const user = response.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      const firstProfilePath = user.Profiles[0]?.Path;
      navigate(firstProfilePath);
    } catch (error) {
      console.log(error);
      let {response: {data: {detailMessage, message}}} = error;
      setError(detailMessage);
      toast.current.show({
        severity: "warn",
        summary: message,
        detail: detailMessage,
        life: 3000,
      });
    }
  };

  return (
    <div className="general">
      <Toast ref={toast} />

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
