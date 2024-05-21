import React, { useState, useEffect } from "react";

import { Card } from "primereact/card";
import { Button } from "primereact/button";

import { Layout } from "../../Components/Layout/Layout";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";

import { useNavigate } from "react-router-dom";

import routes from "../../utils/routes";
import axios from "axios";
function NuevoUsuario() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [businessPartners, setBusinessPartners] = useState([]);
  const [dialogVisibleNuevaCompra, setDialogVisibleNuevaCompra] =
    useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    Email: false,
    ProfileId: false,
    UserName: false,
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  let toast;

  // Agregar event listener al cambio de archivos
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user")).Token;
  const fetchDataUsuario = async () => {
    try {
      console.clear();
      const CompanyId = user.CompanyId;
      const apiUrlEmpleados = `${routes.BASE_URL_SERVER}/GetEmployees/${CompanyId}`;

      const apiUrlCompanies = `${routes.BASE_URL_SERVER}/GetCompanies`;
      const apiUrlGetProfiles = `${routes.BASE_URL_SERVER}/GetProfiles`;

      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const responseGetEmpleados = await axios.get(apiUrlEmpleados, config);
      const responseGetCompanies = await axios.get(apiUrlCompanies, config);
      const responseGetProfiles = await axios.get(apiUrlGetProfiles, config);

      const updateEmployees = responseGetEmpleados.data.data.map((item) => ({
        ...item,
        nombreCompleto: `${item.FirstName} ${item.LastName}`,
      }));
      setEmployees(updateEmployees);
      setCompanies(responseGetCompanies.data.data);
      setProfiles(responseGetProfiles.data.data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };

  useEffect(() => {
    const fetchBusinessPartners = async () => {
      const CompanyId = user.CompanyId;

      const apiUrleGetBusinessPartners = `${routes.BASE_URL_SERVER}/GetBusinessPartners/${CompanyId}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      try {
        const response = await axios.get(apiUrleGetBusinessPartners, config);
        setBusinessPartners(
          response.data.data.map((partner) => ({
            label: partner.CardName,
            value: partner.Id,
          }))
        );
      } catch (error) {
        console.error("Error fetching business partners:", error);
      }
      setLoading(false);
    };

    fetchBusinessPartners();
    fetchDataUsuario();
  }, []);
  const selectedEmpleadoTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.nombreCompleto}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const empleadoOpcionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.nombreCompleto}</div>
      </div>
    );
  };

  const selectedCentroCostosTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.CardName}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const centroCostosOpcionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.CardName}</div>
      </div>
    );
  };
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, Email: email });

    if (!validateEmail(email)) {
      setError("Por favor, ingrese un correo electrónico válido.");
    } else {
      setError("");
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.clear();

    if (validateForm()) {
      try {
        //   console.clear();
        const requestData = buildRequestData();
        const response = await sendFormData(requestData);
        handleSuccessResponse(response);
      } catch (error) {
        handleErrorResponse(error);
      }
    } else {
      toast.show({
        severity: "warn",
        summary: "Notificación",
        detail: "El formulario tiene que ser completado, para ser enviado",
        life: 3000,
      });
    }
  };
  const buildRequestData = () => {
    const requestData = {
      UserName: formData.UserName,
      Email: formData.Email,
      ProfileId: formData.ProfileId.Id,

      CompanyId: 20,
    };
    // Verificar si el ProfileId es 4 (proveedor) y si tiene centro de costos
    if (requestData.ProfileId === 4) {
      requestData.BusinessPartnerId = formData.BusinessPartnerId.Id;
      //   requestData.EmployeeId = formData.EmployeeId.Id;
    } else {
      // Para otros ProfileId, establecer BusinessPartnerId a 6621
      requestData.BusinessPartnerId = 0;
      requestData.EmployeeId = formData.EmployeeId.Id;
    }
    return requestData;
  };
  const sendFormData = async (data) => {
    console.clear();
    console.log(data);

    const config = {
      headers: {
        "x-access-token": token,
      },
    };

    const response = await axios.post(
      `${routes.BASE_URL_SERVER}/CreateUser`,
      data,
      config
    );
    return response.data;
  };

  const validateForm = () => {
    const errors = {};
    let formIsValid = true;

    if (!formData.Email) {
      errors.Email = "El correo es obligatoria.";
      formIsValid = false;
    }

    if (!formData.UserName) {
      errors.UserName = "El nombre del  usuario es obligatorio.";
      formIsValid = false;
    }

    if (!formData.ProfileId) {
      errors.ProfileId = "Seleccione un perfil Usuario.";
      formIsValid = false;
    }

    setFormErrors(errors);
    return formIsValid;
  };

  const handleSuccessResponse = (response) => {
    console.log("Respuesta del servidor:", response);
    setDialogVisibleNuevaCompra(true);
    // Aquí podrías manejar la respuesta exitosa, por ejemplo, mostrar un mensaje de éxito al usuario
  };

  const handleErrorResponse = (error) => {
    console.error("Error al enviar el formulario:", error);
  };

  const handleEnviarNavigate = () => {
    console.clear();

    setDialogVisibleNuevaCompra(false); // Cierra el modal
    navigate("/Administrador"); // Navega a la ruta "/Requisitor"
  };

  return (
    <Layout>
      <div class="body-ordenCompra">
        <Card className="card-header">
          <div class="row">
            <div className="p-card-title">Nuevo usuario</div>
          </div>
        </Card>
        <Toast ref={(el) => (toast = el)} />

        <Card className="cardOrdenCompra">
          <Dialog
            visible={dialogVisibleNuevaCompra}
            onHide={handleEnviarNavigate}
            header="Éxito"
            modal
            footer={<Button label="Cerrar" onClick={handleEnviarNavigate} />}
          >
            <div>¡Se ha agregado el usuario exitosamente.!</div>
          </Dialog>
          <form onSubmit={handleSubmit}>
            <div className="p-field-group">
              <div className="row">
                <div className="p-field">
                  <label>Perfil Usuario:</label>
                  <Dropdown
                    value={formData.ProfileId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ProfileId: e.target.value,
                      })
                    }
                    options={profiles}
                    optionLabel="Name"
                    placeholder="Seleccionar Perfil"
                    className="w-full md:w-14rem"
                  />
                  {formErrors.ProfileId && (
                    <small style={{ color: "red" }}>
                      {formErrors.ProfileId}
                    </small>
                  )}
                </div>
                <div className="p-field">
                  <label>Empresa:</label>
                  <Dropdown
                    value={formData.CompanyId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        CompanyId: e.target.value,
                      })
                    }
                    options={companies}
                    optionLabel="Name"
                    placeholder="Seleccionar Compañia"
                    className="w-full md:w-14rem"
                  />
                </div>
                <div className="p-field">
                  {formData.ProfileId?.Id != 4 && <label>Empleado:</label>}
                  {formData.ProfileId?.Id === 4 && (
                    <label> Socio de negocio:</label>
                  )}
                  {formData.ProfileId?.Id != 4 && (
                    <Dropdown
                      value={formData.EmployeeId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          EmployeeId: e.target.value,
                        })
                      }
                      options={employees}
                      filter
                      valueTemplate={selectedEmpleadoTemplate}
                      itemTemplate={empleadoOpcionTemplate}
                      optionLabel="nombreCompleto"
                      placeholder="Seleccionar empleado"
                      className="w-full md:w-14rem"
                    />
                  )}
                  {formData.ProfileId?.Id === 4 && (
                    <Dropdown
                      value={formData.BusinessPartnerId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          BusinessPartnerId: e.target.value,
                        })
                      }
                      options={businessPartners}
                      virtualScrollerOptions={{ itemSize: 38 }}
                      filter
                      valueTemplate={selectedCentroCostosTemplate}
                      itemTemplate={centroCostosOpcionTemplate}
                      optionLabel="CardName"
                      disabled={loading}
                      placeholder="Seleccionar socio de negocio"
                      className="w-full md:w-14rem"
                    />
                  )}
                </div>
              </div>
              <div className="row">
                <div className="p-field">
                  <label>Usuario:</label>
                  <InputText
                    value={formData.UserName}
                    onChange={(e) =>
                      setFormData({ ...formData, UserName: e.target.value })
                    }
                  />
                  {formErrors.UserName && (
                    <small style={{ color: "red" }}>
                      {formErrors.UserName}
                    </small>
                  )}
                </div>
                <div className="p-field" style={{ width: "31.9%" }}>
                  <label>Correo:</label>

                  <InputText
                    value={formData.Email}
                    onChange={handleEmailChange}
                  />
                  {error && <small style={{ color: "red" }}>{error}</small>}
                  {formErrors.Email && (
                    <small style={{ color: "red" }}>{formErrors.Email}</small>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="p-field" style={{ margin: "20px" }}></div>
                <div className="p-field button-conteiner">
                  <div className="botonEnviar">
                    <Button
                      label="Guardar"
                      type="submit"
                      icon="pi pi-check"
                      className="p-button-primary"
                    />
                  </div>
                  <div className="botonCancelar">
                    <Button
                      label="Cancelar"
                      type="button"
                      // onClick={handleEnviarNavigate}
                      className="p-button-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

export default NuevoUsuario;
