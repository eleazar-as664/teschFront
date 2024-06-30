import React, { useState, useEffect, useRef } from "react";

import { Card } from "primereact/card";
import { Button } from "primereact/button";

import { Layout } from "../../Components/Layout/Layout";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
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
function DetalleUsuario() {
  const navigate = useNavigate();


  const [dialogVisibleNuevaCompra, setDialogVisibleNuevaCompra] =
    useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    Id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const toast = useRef(null);
  const centerToast = useRef(null);

  const employeesEditar = JSON.parse(localStorage.getItem("empleadosEditar"));
  const token = JSON.parse(localStorage.getItem("user")).Token;
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const fetchDataClienteCompleta = async () => {
    try {
      const usuarioID = employeesEditar.UserId;
      // const apiUrlCompanies = `${routes.BASE_URL_SERVER}/GetUserDataToUpdate/${usuarioID}`;
      const apiUrlClientesInfo = `${routes.BASE_URL_SERVER}/GetUserDataToUpdate/${usuarioID}`;

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
        // Enabled: true,
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
      }));
      setSelectedCompanies(companiasCliente);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };

  useEffect(() => {
    fetchDataClienteCompleta();
  }, []);

  const handleEnviarNavigate = () => {
    setDialogVisibleNuevaCompra(false); // Cierra el modal
    navigate("/Administrador"); // Navega a la ruta "/Requisitor"
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
const handleSubmit = (event) => {
  event.preventDefault();
  console.log(formData);
//   setDialogVisibleNuevaCompra(true);
}
  const header = renderHeader();
  return (
    <Layout>
      <div class="body-ordenCompra">
        <Card className="card-header">
          <div class="row">
            <div className="p-card-title">Detalle Usuario</div>
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
            <div>¡Se ha agregado el usuario exitosamente.!</div>
          </Dialog>
          <form onSubmit={handleSubmit}>
            <div className="p-field-group">
              <div className="row">
                <div className="p-field">
                  <label>Perfil de usuario:</label>
                  <InputText value={formData.ProfileId?.Name} disabled />
                </div>
              </div>
              <div className="row">
                <div className="p-field">
                  <label>Usuario:</label>
                  <InputText value={employeesEditar.UserName} disabled />
                </div>
                <div className="p-field">
                  <label>Correo:</label>
                  <InputText value={employeesEditar.UserEmail} disabled />
                </div>
              </div>
              <Divider type="solid" />
              <div className="row">
               
                <div className="p-field">
                  {formData.ProfileId?.Id === 4 && (
                    <label> Socio de negocio:</label>
                  )}
                  {formData.ProfileId?.Id === 4 && (
                      <InputText value={formData.BusinessPartnerId?.CardName} disabled />
                 
                  )}
                </div>
              </div>

              {/* ASIGNACION DE LAS EMPRESAS PARA EL REQUISITOR */}
              <div className="row">
                <div className="p-field">
                  {formData.ProfileId?.Id === 2 && <label> Empleado:</label>}
                  {formData.ProfileId?.Id === 2 && (
                    <InputText value={formData.EmployeeId} disabled />
                  )}
                </div>
              </div>
              <div className="row"></div>

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
                    </DataTable>
                  ) : (
                    <> </>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

export default DetalleUsuario;
