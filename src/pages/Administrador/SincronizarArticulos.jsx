import React, { useRef, useState, useEffect } from "react";

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
  const [activeIndex] = useState(2);

  const [visibleEnviarSAP, setVisibleEnviarSAP] = useState(false);
  const [enviandoASAP, setEnviandoASAP] = useState(false);
  const [articulosAll, setArticulosAll] = useState([]);

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    CompanyName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    Tipo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    Estatus: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    ItemCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    UltimaActualizacion: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    CentroDeCosto: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

 
  const [companies, setCompanies] = useState([]);
  const [selectedEmpresas, setSelectedEmpresas] = useState(null);
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

  const fetchDataGetItems = async () => {
    try {
      console.clear();

      const config = {
        headers: {
          "x-access-token": token,
        },
      };

      const apiUrlGetItems = `${routes.BASE_URL_SERVER}/GetItems`;
      const responseGetItems = await axios.get(apiUrlGetItems, config);
      setArticulosAll(responseGetItems.data.data);
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

      const apiUrl = `${routes.BASE_URL_SERVER}/SAPSyncItems`;
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
        detail: "Se han sincronizado los artículos.",
        life: 3000,
      });
      fetchDataGetItems();
    } catch (error) {
      console.error("Error al enviar la solicitud a SAP:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al sincronizar los artículos.",
        life: 3000,
      });
    } finally {
      setEnviandoASAP(false);
    }

    setVisibleEnviarSAP(false);
  };
  useEffect(() => {
    fetchDataGetCompanies();
    fetchDataGetItems();
  }, []);

  useEffect(() => {}, [fetchDataGetItems, fetchDataGetCompanies]);

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
          <div className="p-card-title">Sincronización Proveedores</div>
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
        header="Sincronizar Art&iacute;culos"
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
          value={articulosAll}
          selectionMode="single"
          scrollable
          scrollHeight="400px"
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
          filters={filters}
          filterDisplay="row"
          globalFilterFields={[
            "ItemCode",
            "Description",
            "CompanyName",
            "Tipo",
            "CentroDeCosto",
            "UltimaActualizacion",
            "Estatus",
          ]}
          header={header}
          emptyMessage="No hay registros"
          paginator
          rows={5}
        >
          <Column
            sortable
            field="ItemCode"
            header="C&oacute;digo"
            style={{ width: "10%" }}
          />

          <Column
            field="Description"
            header="Descripci&oacute;n"
            style={{ width: "20%" }}
          />

          <Column
            field="CompanyName"
            header="Empresa"
            style={{ width: "20%" }}
          />
          <Column field="Tipo" header="Tipo" style={{ width: "20%" }} />
          <Column
            field="CentroDeCosto"
            header="Centro de costos"
            style={{ width: "20%" }}
          />
          <Column
            field="UltimaActualizacion"
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
