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

import { Toast } from "primereact/toast";
import axios from "axios";
import routes from "../../utils/routes";
import "../../Components/Styles/Global.css";
function SincronizarEmpleados() {
  const navigate = useNavigate();
  const [activeIndex] = useState(1);

  const [visibleEnviarSAP, setVisibleEnviarSAP] = useState(false);
  const [enviandoASAP, setEnviandoASAP] = useState(false);
  const [businessPartners, setBusinessPartners] = useState([]);

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

  const fetchDataGetAllBusinessPartners = async () => {
    try {
      console.clear();

      const config = {
        headers: {
          "x-access-token": token,
        },
      };

      const apiUrlGetAllBusinessPartners = `${routes.BASE_URL_SERVER}/GetAllBusinessPartners`;
      const responseGetAllBusinessPartners = await axios.get(
        apiUrlGetAllBusinessPartners,
        config
      );
      setBusinessPartners(responseGetAllBusinessPartners.data.data);
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

      const apiUrl = `${routes.BASE_URL_SERVER}/SAPSyncBusinessPartners`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      console.log(data);
      const response = await axios.post(apiUrl, data, config);
      toast.current.show({
        severity: "success",
        summary: "Enviado",
        detail: "Proveedores sincronizados correctamente.",
        life: 3000,
      });
      fetchDataGetAllBusinessPartners();
    } catch (error) {
      console.error("Error al enviar la solicitud a SAP:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al sincronizar Proveedores.",
        life: 3000,
      });
    } finally {
      setEnviandoASAP(false);
    }

    setVisibleEnviarSAP(false);
  };
  useEffect(() => {
    fetchDataGetCompanies();
    fetchDataGetAllBusinessPartners();
  }, []);

  useEffect(() => {}, [fetchDataGetAllBusinessPartners, fetchDataGetCompanies]);
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
        header="Sincronizar Proveedores"
        visible={visibleEnviarSAP}
        style={{ width: "30vw" }}
        onHide={() => setVisibleEnviarSAP(false)}
      >
        <div className="">
          <div className="p-field-group">
            <Dropdown
              value={selectedEmpresas}
              onChange={(e) => setSelectedEmpresas(e.value)}
              options={companies}
              optionLabel="Name"
              placeholder="Seleccionar Compañia"
              className="w-full md:w-14rem"
            />
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
                label="Enviar"
                className="p-button-secondary"
              />
            )}
          </div>
        </div>
      </Dialog>

      <Card className="cardSolicitante">
        <DataTable
          value={businessPartners}
          selectionMode="single"
          scrollable
          scrollHeight="400px"
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
          emptyMessage="No hay registros"
          paginator
          rows={5}
        >
          <Column
            sortable
            field="CardCode"
            header="Codigo"
            style={{ width: "10%" }}
          />

          <Column field="CardName" header="Nombre" style={{ width: "20%" }} />

          <Column field="LicTradNum" header="RFC" style={{ width: "20%" }} />
          <Column
            field="CompanyName"
            header="Empresas"
            style={{ width: "20%" }}
          />
          <Column field="Status" header="Estatus" style={{ width: "20%" }} />
        </DataTable>
      </Card>
    </Layout>
  );
}

export default SincronizarEmpleados;
