import React, { useState, useEffect, useRef } from "react";

import { Card } from "primereact/card";
import { Button } from "primereact/button";

import { Layout } from "../../Components/Layout/Layout";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";

import { useNavigate } from "react-router-dom";

import routes from "../../utils/routes";
import axios from "axios";
function EditarUsuarios() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [businessPartners, setBusinessPartners] = useState([]);
  const [dialogVisibleNuevaCompra, setDialogVisibleNuevaCompra] =
    useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [empresasId, setEmpresasId] = useState();


  const [formErrors, setFormErrors] = useState({
    Email: false,
    ProfileId: false,
    UserName: false,
  });
  const [formDataAutorizador, setFormDataAutorizador] = useState({
    CompanyId: null,
  });
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const toast = useRef(null);
  // Agregar event listener al cambio de archivos
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user")).Token;
  const employeesEditar = JSON.parse(localStorage.getItem("empleadosEditar"));

  const fetchBusinessPartners = async (CompanyId) => {
    if (!CompanyId) {
      console.log("CompanyId is undefined");
      return;
    }
    const apiUrleGetBusinessPartners = `${routes.BASE_URL_SERVER}/GetBusinessPartners/${CompanyId}`;
    const config = {
      headers: {
        "x-access-token": token,
      },
    };
    setLoading(true);
    try {
      const response = await axios.get(apiUrleGetBusinessPartners, config);
      console.log("************  GetBusinessPartners  ****************");

      console.log(response.data.data);
      setBusinessPartners(response.data.data || []);
    } catch (error) {
      console.error("Error fetching business partners:", error);
      setBusinessPartners([]);
    }
    setLoading(false);
  };
  const fetchDataGetEmployees = async (CompanyId) => {
    if (!CompanyId) {
      console.log("GetEmployees is undefined");
      return;
    }

    const apiUrlEmpleados = `${routes.BASE_URL_SERVER}/GetEmployees/${CompanyId}`;
    console.log("urlGetEmployees: ", apiUrlEmpleados);
    try {
      
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const responseGetEmpleados = await axios.get(apiUrlEmpleados, config);
      console.log("responseGetEmpleadosaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa:", responseGetEmpleados.data.data);
      const updateEmployees = responseGetEmpleados.data.data.map((item) => ({
        ...item,
        nombreCompleto: `${item.FirstName} ${item.LastName}`,
      }));
      setEmployees(updateEmployees || []);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
      setEmployees([]);
    }
  };

  const fetchDataGetProfiles = async () => {
    try {
      const apiUrlGetProfiles = `${routes.BASE_URL_SERVER}/GetProfiles`;

      const config = {
        headers: {
          "x-access-token": token,
        },
      };

      const responseGetProfiles = await axios.get(apiUrlGetProfiles, config);

      setProfiles(responseGetProfiles.data.data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };
  const fetchDataGetCompanies = async () => {
    try {
      const apiUrlCompanies = `${routes.BASE_URL_SERVER}/GetCompanies`;

      const config = {
        headers: {
          "x-access-token": token,
        },
      };

      const responseGetCompanies = await axios.get(apiUrlCompanies, config);
      console.log(responseGetCompanies.data.data);
      setCompanies(responseGetCompanies.data.data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };

  useEffect(() => {
    fetchDataGetProfiles();
    fetchDataGetCompanies();
    if (empresasId && empresasId.Id) {
      fetchBusinessPartners(empresasId.Id);
      fetchDataGetEmployees(empresasId.Id);
    }
  }, [empresasId]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        //   console.clear();
        const requestData = buildRequestData();
        const response = await sendFormData(requestData);
        console.log(requestData);
        console.log(response);
        handleSuccessResponse(response);
      } catch (error) {
        handleErrorResponse(error);
      }
    } else {
      toast.current.show({
        severity: "warn",
        summary: "Notificación",
        detail: "El formulario tiene que ser completado, para ser enviado",
        life: 3000,
      });
    }
  };
  const buildRequestData = () => {
    console.log(formData);
    const requestData = {
      UserName: employeesEditar.UserName,
      Email: employeesEditar.UserEmail,
      ProfileId: formData.ProfileId.Id,
      UserId: employeesEditar.UserId,
    };
    if (requestData.ProfileId === 4) {
      requestData.BusinessPartnerId = formData.BusinessPartnerId.Id;
      requestData.CompanyId = formData.CompanyId.Id;
      //   requestData.EmployeeId = formData.EmployeeId.Id;
    } else if (requestData.ProfileId === 2) {
      requestData.BusinessPartnerId = 0;
      requestData.EmployeeId = formData.EmployeeId.Id;
      requestData.CompanyId = formData.CompanyId.Id;
    } else if (requestData.ProfileId === 3) {
      console.log(selectedCompanies);
      const newIdArray = selectedCompanies.map((item) => item.Id);
      console.log(newIdArray);
      requestData.CompanyId = newIdArray;
    } else {
      requestData.BusinessPartnerId = 0;
    }

    console.log(requestData);
    return requestData;
  };
  const sendFormData = async (data) => {
    console.clear();
    const config = {
      headers: {
        "x-access-token": token,
      },
    };

    const response = await axios.patch(
      `${routes.BASE_URL_SERVER}/UpdateUser`,
      data,
      config
    );

    return response.data;
  };

  const validateForm = () => {
    const errors = {};
    let formIsValid = true;

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
    toast.current.show({
      severity: "success",
      summary: "Exito",
      detail: "Usuario editado correctamente",
      life: 3000,
    })
    // Aquí podrías manejar la respuesta exitosa, por ejemplo, mostrar un mensaje de éxito al usuario
  };

  const handleErrorResponse = (error) => {
    console.log("Error al enviar el formulario:", error);
    toast.current.show({        
      severity: "error",
      summary: "Error",
      detail: "Error al enviar el formulario",
      life: 3000,
    })
  
  };

  const handleEnviarNavigate = () => {
    console.clear();

    setDialogVisibleNuevaCompra(false); // Cierra el modal
    navigate("/Administrador"); // Navega a la ruta "/Requisitor"
  };
  const handleCompanyChange = (e) => {
    console.log(e.value);
    const selectedCompany = companies.find((company) => company.Id === e.value);
    if (
      selectedCompany &&
      !selectedCompanies.some((company) => company.Id === selectedCompany.Id)
    ) {
      setSelectedCompanies([...selectedCompanies, selectedCompany]);
    }
    setFormDataAutorizador({ ...formDataAutorizador, CompanyId: e.value });
  };
  const handleEmpresasChange = (e) => {
    const newCompanyId = e.target.value;
    console.log(newCompanyId.Id);
    setEmpresasId({ Id: newCompanyId.Id });

    setFormData({
      ...formData,
      CompanyId: newCompanyId,
    });
  };
  const handleDelete = (rowData) => {
    const updatedItems = selectedCompanies.filter((item) => item !== rowData);
    setSelectedCompanies(updatedItems);

    console.log("Elemento eliminado:", rowData);
  };
  return (
    <Layout>
      <div class="body-ordenCompra">
        <Card className="card-header">
          <div class="row">
            <div className="p-card-title">Editar Usuarios</div>
          </div>
        </Card>
        <Toast ref={toast} />

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
                  {formData.ProfileId?.Id === 2 ||
                  formData.ProfileId?.Id === 4 ? (
                    <label>Empresa:</label>
                  ) : (
                    <label></label>
                  )}
                  {formData.ProfileId?.Id == 4 ||
                  formData.ProfileId?.Id == 2 ? (
                    <Dropdown
                      value={formData.CompanyId}
                      onChange={handleEmpresasChange}
                      options={companies}
                      optionLabel="Name"
                      placeholder="Seleccionar Compañia"
                      className="w-full md:w-14rem"
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <div className="p-field">
                  {formData.ProfileId?.Id === 2 && <label>Empleado:</label>}
                  {formData.ProfileId?.Id === 4 && (
                    <label> Socio de negocio:</label>
                  )}
                  {formData.ProfileId?.Id === 2 && (
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
                  <InputText value={employeesEditar.UserName} disabled />
                </div>
                <div className="p-field" style={{ width: "31.9%" }}>
                  <label>Correo:</label>

                  <InputText value={employeesEditar.UserEmail} disabled />
                </div>
              </div>

              <div className="row">
                <div className="p-field" style={{ width: "31.9%" }}>
                  {formData.ProfileId?.Id == 3 ? (
                    <Dropdown
                      value={formDataAutorizador.CompanyId}
                      onChange={handleCompanyChange}
                      options={companies.map((company) => ({
                        label: company.Name,
                        value: company.Id,
                      }))}
                      placeholder="Seleccionar Compañia"
                      className="w-full md:w-14rem"
                    />
                  ) : (
                    <></>
                  )}
                  {formData.ProfileId?.Id == 3 ? (
                    <DataTable value={selectedCompanies} className="mt-4">
                      <Column field="Id" header="ID" />
                      <Column field="Name" header="nombre" />
                      <Column
                        field=""
                        body={(rowData) => (
                          <div>
                            <Button
                              icon="pi pi-trash"
                              onClick={() => handleDelete(rowData)}
                              className="p-button-danger"
                            />
                          </div>
                        )}
                      />
                    </DataTable>
                  ) : (
                    <> </>
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

export default EditarUsuarios;
