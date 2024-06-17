import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { DataTable } from "primereact/datatable";

import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Layout } from "../../Components/Layout/Layout";
import { TabMenu } from "primereact/tabmenu";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from "primereact/api";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import axios from "axios";
import routes from "../../utils/routes";
import "../../Components/Styles/Global.css";
function SincronizarEmpleados() {
  const navigate = useNavigate();
  const [activeIndex] = useState(3);

  const [visibleEnviarSAP, setVisibleEnviarSAP] = useState(false);
  const [enviandoASAP, setEnviandoASAP] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedEmpresas, setSelectedEmpresas] = useState(null);

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    EmpId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    FirstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    BirthDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    Sexo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    CompanyName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    OcrCode: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    UpdateDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    Estatus: { value: null, matchMode: FilterMatchMode.STARTS_WITH },

  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user")).Token;
  const tokenSap = JSON.parse(localStorage.getItem("user")).TokenSAP;
  const toast = useRef(null);

  const items = [
    {
      label: "Empresas ",
      icon: "pi pi-home",
      command: () => {
        navigate("/Administrador/Administrador/Sincronizacion");
      },
    },
    {
      label: "Proveedores",
      icon: "pi pi-palette",
      command: () => {
        navigate("/Administrador/Administrador/SincronizarProvedores");
      },
    },
    {
      label: "Articulos",
      icon: "pi pi-link",
      command: () => {
        navigate("/Administrador/Administrador/SincronizarArticulos");
      },
    },

    {
      label: "Empleados",
      icon: "pi pi-users",
      command: () => {
        navigate("/Administrador/Administrador/SincronizarEmpleados");
      },
    },
  ];
  const enviarSolicitudSap = () => {
    console.clear();

    setVisibleEnviarSAP(true);
  };

  const fetchDataGetEmpleados = async () => {
    try {
      console.clear();

      const config = {
        headers: {
          "x-access-token": token,
        },
      };

      const apiUrlEmpleados = `${routes.BASE_URL_SERVER}/GetAllEmployees`;
      const responseGetEmpleados = await axios.get(apiUrlEmpleados, config);
      setEmployees(responseGetEmpleados.data.data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };

  const fetchDataGetCompanies = async () => {
    try {
      console.clear();

      const apiUrlCompanies = `${routes.BASE_URL_SERVER}/GetCompanies`;

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

  const handleDialogEnviarSap = async () => {
    setEnviandoASAP(true);
    try {
      console.log("Enviando a SAP", selectedEmpresas.BusinessName);
      const data = {
        SAPToken: tokenSap,
        BusinessName: selectedEmpresas.BusinessName,
      };

      const apiUrl = `${routes.BASE_URL_SERVER}/SAPSyncEmployees`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      console.log(data);
      const response = await axios.post(apiUrl, data, config);
      console.log("Response:", response);
      toast.current.show({
        severity: "success",
        summary: "Enviado",
        detail: "Empleados sincronizados correctamente",
        life: 3000,
      });
      fetchDataGetEmpleados();
      // fetchData();
    } catch (error) {
      console.error("Error al enviar la solicitud a SAP:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al sincronizar empleados",
        life: 3000,
      });
    } finally {
      setEnviandoASAP(false);
    }

    setVisibleEnviarSAP(false);
  };
  useEffect(() => {
    fetchDataGetCompanies();
    fetchDataGetEmpleados();
  }, []);

  useEffect(() => {}, [fetchDataGetEmpleados, fetchDataGetCompanies]);

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
      <Card className="card-header">
        <Toast ref={toast} />

        <div class="row">
          <div className="p-card-title">Sincronización Empleados</div>
          <TabMenu model={items} activeIndex={activeIndex} />
          <div class="gorup-search">
            <div>
              <Button
                label="Sincronizar"
                severity="primary"
                raised
                icon="pi pi-plus-circle"
                iconPos="left"
                onClick={enviarSolicitudSap}
                className="botonInsertarRequisitor"
              />
            </div>
          </div>
        </div>
      </Card>
      <Dialog
        header="Sincronizar Empleados"
        visible={visibleEnviarSAP}
        style={{ width: "30vw" }}
        onHide={() => setVisibleEnviarSAP(false)}
      >
        <div className="p-field-group">
          <div className="row">
            <div className="p-field">
              <Dropdown
                value={selectedEmpresas}
                onChange={(e) => setSelectedEmpresas(e.value)}
                options={companies}
                optionLabel="Name"
                placeholder="Seleccionar Compañ&iacute;a"
                className="w-full md:w-14rem"
              />
              </div>
            <div className="p-field"></div>
          </div>

          <div class="row">
            {enviandoASAP ? (
              <Button
                icon="pi pi-spin pi-spinner"
                className="p-button-secondary"
              />
            ) : (
              <Button
                onClick={handleDialogEnviarSap}
                label="Sincronizar"
                className="p-button-secondary"
              />
            )}
          </div>
        </div>
      </Dialog>

      <Card className="cardSolicitante">
        <DataTable
          value={employees}
          selectionMode="single"
          scrollable
          scrollHeight="400px"
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
          filters={filters}
          filterDisplay="row"
          globalFilterFields={[
            "EmpId",
            "FirstName",  
            "BirthDate",
            "Sexo",
            "CompanyName",
            "OcrCode",
            "UpdateDate",
            "Estatus",
           
          ]}
          header={header}
          emptyMessage="No hay empleados registrados"
          paginator
          rows={5}
        >
          <Column
            sortable
            field="EmpId"
            header="No. Empleado"
            style={{ width: "10%" }}
          />
          <Column field="FirstName" header="Nombre" style={{ width: "20%" }} />

          <Column
            field="BirthDate"
            header="Fecha de nacimiento"
            style={{ width: "20%" }}
          />
          <Column field="Sexo" header="Sexo" style={{ width: "20%" }} />
          <Column
            field="CompanyName"
            header="Empresa"
            style={{ width: "20%" }}
          />
          <Column
            field="OcrCode"
            header="Centro de costo"
            style={{ width: "20%" }}
          />
          <Column
            field="UpdateDate"
            header="&Uacute;ltima actualizaci&oacute;n"
            style={{ width: "20%" }}
          />
          <Column field="Estatus" header="Estatus" style={{ width: "20%" }} />
        </DataTable>
      </Card>
    </Layout>
  );
}

export default SincronizarEmpleados;
