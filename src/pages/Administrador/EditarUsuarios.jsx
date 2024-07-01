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
import { Divider } from "primereact/divider";
import { FilterMatchMode } from "primereact/api";
import { useNavigate } from "react-router-dom";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

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
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    Email: false,
    ProfileId: false,
    UserName: false,
  });
  const [formDataAutorizador, setFormDataAutorizador] = useState({
    CompanyId: null,
  });
  const [formDataProveedor, setFormDataProveedor] = useState({
    CompanyId: null,
  });

  const [formDataRequester, setFormDataRequester] = useState({
    CompanyId: null,
  });


  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    Id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
   
  });

  const [empresasId, setEmpresasId] = useState();

  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const toast = useRef(null);
  const centerToast = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const employeesEditar = JSON.parse(localStorage.getItem("empleadosEditar"));
  const token = JSON.parse(localStorage.getItem("user")).Token;
  const [globalFilterValue, setGlobalFilterValue] = useState("");
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
    try {
      const response = await axios.get(apiUrleGetBusinessPartners, config);

      setBusinessPartners(response.data.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(true);
      setBusinessPartners([]);
      console.log(loading);
    }
  };
  const fetchDataGetEmployees = async (CompanyId) => {
    if (!CompanyId) {
      console.log("GetEmployees is undefined");
      return;
    }

    const apiUrlEmpleados = `${routes.BASE_URL_SERVER}/GetEmployees/${CompanyId}`;
    try {
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const responseGetEmpleados = await axios.get(apiUrlEmpleados, config);

      console.log("************  GetEmployees  ****************");
      console.log(responseGetEmpleados.data.data);
      const updateEmployees = responseGetEmpleados.data.data.map((item) => ({
        ...item,
        nombreCompleto: `${item.FirstName} ${item.LastName}`,
      }));
      setEmployees(updateEmployees || []);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
      setLoading(true);
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
      // const apiUrlCompanies = `https://purchase.grupohormadi.com:446/api/v1/GetCompanies`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };

      const responseGetCompanies = await axios.get(apiUrlCompanies, config);
      setCompanies(responseGetCompanies.data.data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };

  const fetchDataClienteCompleta = async () => {
    try {
      const usuarioID = employeesEditar.UserId;
      const apiUrlClientesInfo = `${routes.BASE_URL_SERVER}/GetUserDataToUpdate/${usuarioID}`;
      // const apiUrlClientesInfo = `https://purchase.grupohormadi.com:446/api/v1/GetUserDataToUpdate/${usuarioID}`;

      const config = {
        headers: {
          "x-access-token": token,
        },
      };

      const responseGetCompanies = await axios.get(apiUrlClientesInfo, config);
      console.clear();
      const datosCliente = responseGetCompanies.data.data;
      console.log("************  GetUserDataToUpdate  ****************");
      console.log(datosCliente);
      const initialProfile = {
        Enabled: true,
        Id: datosCliente.ProfileId,
        Name: datosCliente.ProfileName,
        UpdateDate: "2024-01-15T00:00:00.000Z",
      };
      const BusinessPartner = {
        Enabled: true,
        Id: datosCliente.BusinessPartner.Id,
        CardName: datosCliente.BusinessPartner.CardName,
        UpdateDate: "2024-01-15T00:00:00.000Z",
      };

      const companiasCliente = datosCliente.Companies.map((company) => ({
        Id: company.CompanyId,
        Name: company.CompanyName,
      }));

      const nombreCompleto = `${datosCliente.Employee.FirstName} ${datosCliente.Employee.LastName}`;
      setFormData((prevData) => ({
        ...prevData,
        ProfileId: initialProfile,
        UserName: datosCliente.UserName,
        BusinessPartnerId: BusinessPartner,
        Email: datosCliente.Email,
        EmployeeId: nombreCompleto,
        EmployeeIdReal: datosCliente.Employee.Id
      }));
      setSelectedCompanies(companiasCliente);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };

  useEffect(() => {
    fetchDataGetProfiles();
    fetchDataGetCompanies();
    fetchDataClienteCompleta();
    if (empresasId && empresasId.Id) {
      fetchBusinessPartners(empresasId.Id);
      fetchDataGetEmployees(empresasId.Id);
    }
  }, [empresasId]);

  useEffect(() => {}, [fetchDataGetEmployees]);
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

  const handleProfileChange = (e) => {
    const Profile = e.target.value;
    console.log(Profile);
    setSelectedCompanies([]);
    setBusinessPartners([]);
    setEmployees([]);
    setFormDataAutorizador({ ...formDataAutorizador, CompanyId: null });
    setFormData({ ...formData, ProfileId: Profile });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        //   console.clear();
        const requestData = buildRequestData();
        console.clear();
        console.log("RequestDta: ", requestData);
        const response = await sendFormData(requestData);
        console.log(response);
        handleSuccessResponse(response);
      } catch (error) {
        let {
          response: {
            data: { message, detailMessage },
          },
        } = error;
        toast.current.show({
          severity: "warn",
          summary: message,
          detail: detailMessage,
          life: 3000,
        });
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
      UserName: formData.UserName,
      Email: formData.Email,
      ProfileId: formData.ProfileId.Id,
      UserId: employeesEditar.UserId,
      EmployeeId:0,
    };
    if (requestData.ProfileId === 4) {
      const newIdArray = selectedCompanies.map((item) => item.Id);
      requestData.CompanyId = newIdArray;
      requestData.BusinessPartnerId = formData.BusinessPartnerId.Id;
      // requestData.CompanyId = formData.CompanyId.Id;
      //   requestData.EmployeeId = formData.EmployeeId.Id;
    } else if (requestData.ProfileId === 2) {
      requestData.BusinessPartnerId = 0;
      requestData.EmployeeId = formData.EmployeeIdReal;
      const newIdArray = selectedCompanies.map((item) => item.Id);
      requestData.CompanyId = newIdArray;
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
    console.log(data);

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

    if (!formData.Email) {
      errors.Email = "El correo es obligatorio.";
      formIsValid = false;
    }
    if (formData.ProfileId?.Id === 2)
      if (!formData.UserName) {
        errors.UserName = "El nombre del  usuario es obligatorio.";
        formIsValid = false;
      }

    if (!formData.ProfileId) {
      errors.ProfileId = "Seleccione un perfil Usuario.";
      formIsValid = false;
    }

    console.log(formData.BusinessPartnerId);
    if (formData.ProfileId.Id == 4 && !formData.BusinessPartnerId) {
      errors.BusinessPartnerId = "Seleccione un Socio de Negocios.";
      formIsValid = false;
    }
    if (formData.ProfileId?.Id === 2 && !formData.EmployeeId) {
      errors.EmployeeId = "Seleccione un empleado.";
      formIsValid = false;
    }
    console.log(errors);
    setFormErrors(errors);
    return formIsValid;
  };

  const handleSuccessResponse = (response) => {
    console.log("Respuesta del servidor:", response);
    setDialogVisibleNuevaCompra(true);
    // Aquí podrías manejar la respuesta exitosa, por ejemplo, mostrar un mensaje de éxito al usuario
  };

  const handleErrorResponse = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Error al enviar el formulario",
      life: 3000,
    });
  };

  const handleEnviarNavigate = () => {
    setDialogVisibleNuevaCompra(false); // Cierra el modal
    navigate("/Administrador"); // Navega a la ruta "/Requisitor"
  };

  const handleCompanyChange = (e) => {
    const selectedCompany = companies.find((company) => company.Id === e.value);
    if (
      selectedCompany &&
      !selectedCompanies.some((company) => company.Id === selectedCompany.Id)
    ) {
      setSelectedCompanies([...selectedCompanies, selectedCompany]);
    }
    setFormDataAutorizador({ ...formDataAutorizador, CompanyId: e.value });
  };

  const handleCompanyProveedorChange = (e) => {
    const selectedCompany = companies.find((company) => company.Id === e.value);
    if (
      selectedCompany &&
      !selectedCompanies.some((company) => company.Id === selectedCompany.Id)
    ) {
      console.log(selectedCompany);
      if (businessPartners.length === 0) {
        fetchBusinessPartners(selectedCompany.Id);
      }
      setSelectedCompanies([...selectedCompanies, selectedCompany]);
    }
    setFormDataProveedor({ ...formDataProveedor, CompanyId: e.value });
  };

  const handleCompanyRequesterChange = (e) => {
    const selectedCompany = companies.find((company) => company.Id === e.value);
    if (
      selectedCompany &&
      !selectedCompanies.some((company) => company.Id === selectedCompany.Id)
    ) {
      console.log(selectedCompany);
      if (employees.length === 0) {
        fetchDataGetEmployees(selectedCompany.Id);
      }
      setSelectedCompanies([...selectedCompanies, selectedCompany]);
    }
    setFormDataRequester({ ...formDataRequester, CompanyId: e.value });
  };

  const handleEmpresasChange = (e) => {
    const newCompanyId = e.target.value;

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
  const alertaPassword = async () => {
    centerToast.current.show({
      severity: "success",
      summary: "Can you send me the report?",
      sticky: true,
      content: (props) => (
        <div
          className="flex flex-column align-items-left"
          style={{ flex: "1" }}
        >
          <div className="flex align-items-center gap-2">
            <span className="font-bold text-900">
              ¿Desea cambiar la contraseña?
            </span>
          </div>
          <div className="flex align-items-center gap-2">
            <Button
              className="p-button-sm flex"
              label="Cambiar contraseña"
              severity="success"
              onClick={updatePassword}
            ></Button>
          </div>
        </div>
      ),
    });
  };
  const updatePassword = async () => {
    centerToast.current.clear();
    try {
      console.clear();

      const UserId = ""; // employeesEditar.UserId;
      const data = {
        UserId: UserId,
      };
      console.log(data);
      const apiUrl = `${routes.BASE_URL_SERVER}/RessetPassword`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.post(apiUrl, data, config);
      console.log(response.data);

      toast.current.show({
        severity: "success",
        summary: "Exito",
        detail: "Contraseña cambiada correctamente",
        life: 3000,
      });
    } catch (error) {
      let {
        response: {
          data: { detailMessage, message },
        },
      } = error;
      console.error("Error al obtener datos de la API:", error);
      toast.current.show({
        severity: "warn",
        summary: "Atención",
        detail: message,
        life: 3000,
      });
    } finally {
    }
  };



  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const renderHeader = () => {
    return (
      <div className="global-filter">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar ..."
          />
        </IconField>
      </div>
    );
  };

  const header = renderHeader();
  return (
    <Layout>
      <div class="body-ordenCompra">
        <Card className="card-header">
          <div class="row">
            <div className="p-card-title">Editar Usuarios</div>
          </div>
        </Card>
        <Toast ref={toast} />
        <Toast ref={centerToast} position="center" />

        <Card className="cardOrdenCompra">
          <Dialog
            visible={dialogVisibleNuevaCompra}
            onHide={handleEnviarNavigate}
            header="Éxito"
            modal
            footer={<Button label="Cerrar" onClick={handleEnviarNavigate} />}
          >
            <div>¡Se ha actualizado el usuario exitosamente.!</div>
          </Dialog>
          {/* <form onSubmit={handleSubmit}> */}
            <div className="p-field-group">
              <div className="row">
                <div className="p-field">
                  <label>Perfil de usuario:</label>
                  <Dropdown
                    value={formData.ProfileId}
                    onChange={handleProfileChange}
                    options={profiles}
                    optionLabel="Name"
                    placeholder="Seleccionar Perfil"
                    className="w-full md:w-14rem"
                    disabled
                  />
                  {formErrors.ProfileId && (
                    <small style={{ color: "red" }}>
                      {formErrors.ProfileId}
                    </small>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="p-field">
                  <label>Usuario:</label>
                  <InputText value={employeesEditar.UserName} disabled />
                  {/* <InputText
                    value={formData.UserName}
                    onChange={(e) =>
                      setFormData({ ...formData, UserName: e.target.value })
                    }
                  /> */}
                  {formErrors.UserName && (
                    <small style={{ color: "red" }}>
                      {formErrors.UserName}
                    </small>
                  )}
                </div>
                <div className="p-field">
                  <label>Correo:</label>
                  {/* <InputText value={employeesEditar.UserEmail} disabled /> */}

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
              <Divider type="solid" />

              {/* Asignacion de empresas para el proveedor */}
              <div className="row">
                <div className="p-field">
                  {formData.ProfileId?.Id === 4 && <label>Compañias:</label>}
                  {formData.ProfileId?.Id == 4 ? (
                    <Dropdown
                      value={formDataAutorizador.CompanyId}
                      onChange={handleCompanyProveedorChange}
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
                </div>
                <div className="p-field">
                  {formData.ProfileId?.Id === 4 && (
                    <label> Socio de negocio:</label>
                  )}
                  {formData.ProfileId?.Id === 4 && (
                      <InputText value={formData.BusinessPartnerId?.CardName} disabled />
                    // <Dropdown
                    //   value={formData.BusinessPartnerId}
                    //   onChange={(e) =>
                    //     setFormData({
                    //       ...formData,
                    //       BusinessPartnerId: e.target.value,
                    //     })
                    //   }
                    //   options={businessPartners}
                    //   virtualScrollerOptions={{ itemSize: 38 }}
                    //   filter
                    //   valueTemplate={selectedCentroCostosTemplate}
                    //   itemTemplate={centroCostosOpcionTemplate}
                    //   optionLabel="CardName"
                    //   disabled
                    //   placeholder="Seleccionar socio de negocio"
                    //   className="w-full md:w-14rem"
                    // />
                  )}
                </div>
              </div>

              {/* ASIGNACION DE LAS EMPRESAS PARA EL REQUISITOR */}
              <div className="row">
                <div className="p-field">
                  {formData.ProfileId?.Id === 2 && <label>Compañias:</label>}
                  {formData.ProfileId?.Id == 2 ? (
                    <Dropdown
                      value={formDataAutorizador.CompanyId}
                      onChange={handleCompanyRequesterChange}
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
                </div>
                <div className="p-field">
                  {formData.ProfileId?.Id === 2 && <label> Empleado:</label>}
                  {formData.ProfileId?.Id === 2 && (
                    <InputText value={formData.EmployeeId} disabled />
                    // <Dropdown
                    //   value={formData.EmployeeId}
                    //   onChange={(e) =>
                    //     setFormData({
                    //       ...formData,
                    //       EmployeeId: e.target.value,
                    //     })
                    //   }
                    //   options={employees}
                    //   filter
                    //   valueTemplate={selectedEmpleadoTemplate}
                    //   itemTemplate={empleadoOpcionTemplate}
                    //   optionLabel="nombreCompleto"
                    //   disabled={loading}
                    //   placeholder="Seleccionar empleado"
                    //   className="w-full md:w-14rem"
                    // />
                  )}
                </div>
              </div>
              <div className="row"></div>
              <div className="row">
                <div className="p-field">
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
                </div>
                <div className="p-field"></div>
              </div>
              <div className="row">
                <div className="p-field">
                  {formData.ProfileId?.Id == 3 ||
                  formData.ProfileId?.Id == 4 ||
                  formData.ProfileId?.Id == 2 ? (
                    <DataTable
                      value={selectedCompanies}
                      className="mt-4"
                      scrollable
                      scrollHeight="400px"
                      stripedRows
                      tableStyle={{ minWidth: "50rem" }}
                      filters={filters}
                      filterDisplay="row"
                      globalFilterFields={["Id", "Name"]}
                      header={header}
                      emptyMessage="No hay empleados registrados"
                      paginator
                      rows={5}
                    >
                      <Column field="Id" header="ID" />
                      <Column field="Name" header="Nombre" />
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
                <div
                  className="p-field button-conteiner"
                  style={{ justifyContent: "flex-start" }}
                >
                  <div className="botonEnviar">
                    <Button
                      label="Restablecer contraseña"
                      type="button"
                      onClick={alertaPassword}
                      icon="pi pi-undo"
                      className="p-button-warning"
                    />
                  </div>
                </div>
                <div className="p-field button-conteiner">
                  <div className="botonCancelar">
                    <Button
                      label="Guardar"
                      type="submit"
                      icon="pi pi-check"
                      className="p-button-primary"
                      onClick={handleSubmit}
                    />
                  </div>
                  <div className="botonEnviar">
                    <Button
                      label="Cancelar"
                      type="button"
                      onClick={handleEnviarNavigate}
                      className="p-button-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>
          {/* </form> */}
        </Card>
      </div>
    </Layout>
  );
}

export default EditarUsuarios;
