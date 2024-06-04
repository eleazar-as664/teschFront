import React, { useRef, useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Layout } from "../../Components/Layout/Layout";
import { FilterMatchMode } from "primereact/api";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

import { TabMenu } from "primereact/tabmenu";
import { InputNumber } from "primereact/inputnumber";

import { Toast } from "primereact/toast";
import axios from "axios";
import routes from "../../utils/routes";
import "../../Components/Styles/Global.css";
function Sincronizacion() {
  const navigate = useNavigate();
  const [activeIndex] = useState(0);

  const [visibleEnviarSAP, setVisibleEnviarSAP] = useState(false);
  const [companiesConfig, setCompaniesConfig] = useState([]);
  const [visibleConfiguracionEmpresa, setVisibleConfiguracionEmpresa] =
    useState(false);
  const [enviandoASAP, setEnviandoASAP] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [getCompanySettings, setGetCompanySettings] = useState([]);
  const [value1nventariable, setValue1] = useState();
  const [value2, setValue2] = useState();
  const [valorEdit, setValorEdit] = useState();
  const [inventoriable, setInventoriable] = useState();
  const [companySettingsId, setCompanySettingsId] = useState();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CompanyCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    Name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    DBName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
      label: "Artículos",
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

  const fetchDataCompanies = async () => {
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
      const data = {
        SAPToken: tokenSap,
      };

      const apiUrl = `${routes.BASE_URL_SERVER}/SAPSynCompanies`;
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
        detail: "Compañias sincronizadas correctamente",
        life: 3000,
      });
      fetchDataCompanies();

      // fetchData();
    } catch (error) {
      console.error("Error al enviar la solicitud a SAP:", error);
      toast.current.show({
        severity: "Error",
        summary: "Error",
        detail: "Error al sincronizar compañias",
        life: 3000,
      });
    } finally {
      setEnviandoASAP(false);
    }

    setVisibleEnviarSAP(false);
  };
  useEffect(() => {
    fetchDataCompanies();
  }, []);
  useEffect(() => {}, [fetchDataCompanies]);
  const fetchDataGetCompanySettings = async (getDatos) => {
    try {
      console.log("companiesConfig///////////", getDatos.Id);

      const apiUrlGetCompanySettings = `${routes.BASE_URL_SERVER}/GetCompanySettings/${getDatos.Id}`;

      const config = {
        headers: {
          "x-access-token": token,
        },
      };

      const responseGetCompanySettings = await axios.get(
        apiUrlGetCompanySettings,
        config
      );
      const data = responseGetCompanySettings.data.data;
      console.log(
        "::::::::::::::::::::::::::responseGetCompanySettings::::::::::::::::::::::::::::"
      );

      console.log(data);
      setValorEdit(data.Expense);
      setInventoriable(data.Inventoriable);
      setCompanySettingsId(data.CompanySettingsId);
      setGetCompanySettings((prevSettings) => [...prevSettings, data]);
      console.log("::::::::::::::::::::::::::::::::::::::::::::::::::::::");
      console.log(getCompanySettings);
      //   setPurchaseOrderData(updatedData);c
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
      setGetCompanySettings([]);
    }
  };
  const redirectToEditar = (datos) => {
    console.clear();
    const rowData = datos;
    setVisibleConfiguracionEmpresa(true);
    console.log(getCompanySettings.length);
    setCompaniesConfig(rowData);
    setValue2();
    setValue1();
    fetchDataGetCompanySettings(rowData);

    console.log(rowData);
  };

  const handleUpdateCompanySettings = async () => {
    setEnviandoASAP(true);
    try {
      const data = {
        Inventoriable: inventoriable,
        Expense: valorEdit,
        Id: companySettingsId,
      };

      const apiUrl = `${routes.BASE_URL_SERVER}/UpdateCompanySettings`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      console.log(data);
      const response = await axios.patch(apiUrl, data, config);
      console.log(response.data);
      toast.current.show({
        severity: "success",
        summary: "Enviado",
        detail: "Compañias actualizadas correctamente",
        life: 3000,
      });
      fetchDataCompanies();

      // fetchData();
    } catch (error) {
      console.error("Error al actualizar datos de SAP:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al actualizar compañias",
        life: 3000,
      });
    } finally {
      setVisibleConfiguracionEmpresa(false);
      setIsButtonDisabled(false);
      setEnviandoASAP(false);

    }
  };
  const handleCreateCompanySettings = async () => {
    setIsButtonDisabled(true);
    try {
      const data = {
        Inventoriable: value1nventariable,
        Expense: value2,
        CompanyId: companiesConfig.Id,
      };

      const apiUrl = `${routes.BASE_URL_SERVER}/CreateCompanySettings`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      console.log(data);
      const response = await axios.post(apiUrl, data, config);
      console.log(response.data.data);
      toast.current.show({
        severity: "success",
        summary: "Enviado",
        detail: "Configuración de empresa creada correctamente.",
        life: 3000,
      });
      // fetchDataCompanies();

      // fetchData();
    } catch (error) {
      console.error("Error al enviar la solicitud a SAP:", error);
      toast.current.show({
        severity: "Error",
        summary: "Error",
        detail: "Error al configurar empresa.",
        life: 3000,
      });
    } finally {
      setVisibleConfiguracionEmpresa(false);
      setIsButtonDisabled(false);
    }

    setVisibleEnviarSAP(false);
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
      <Card className="card-header">
        <Toast ref={toast} />
        <div class="row">
          <div className="p-card-title">Sincronización Empresas</div>
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
        header="Sincronizar Empresas"
        visible={visibleEnviarSAP}
        style={{ width: "30vw" }}
        onHide={() => setVisibleEnviarSAP(false)}
      >
        <div className="">
          <div className="p-field-group">
            <p>¿Deseas sincronizar las empresas de SAP?</p>
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
                label="Aceptar"
                className="p-button-secondary"
              />
            )}
          </div>
        </div>
      </Dialog>
      <Dialog
        header="Configuracion de Empresas"
        visible={visibleConfiguracionEmpresa}
        style={{ width: "30vw" }}
        onHide={() => setVisibleConfiguracionEmpresa(false)}
      >
        <div className="">
          <div className="p-field-group">
            <p>{companiesConfig.BusinessName}</p>

            <div className="row">
              <div className="p-field">
                <label>Limite Inventariable:</label>
                {getCompanySettings.length > 0 && (
                  <InputNumber
                    id="value1"
                    value={inventoriable}
                    onValueChange={(e) => setValue1(e.value)}
                  />
                )}
                {getCompanySettings.length <= 0 && (
                  <InputNumber
                    id="value1"
                    value={value1nventariable}
                    onValueChange={(e) => setValue1(e.value)}
                  />
                )}
              </div>
              <div className="p-field">
                <label>Limite de Gasto:</label>
                {getCompanySettings.length > 0 && (
                  <InputNumber
                    id="value1"
                    value={valorEdit}
                    onValueChange={(e) => setValue1(e.value)}
                  />
                )}
                {getCompanySettings.length <= 0 && (
                  <InputNumber
                    id="value2"
                    value={value2}
                    onValueChange={(e) => setValue2(e.value)}
                  />
                )}
              </div>
            </div>
          </div>

          <div class="row">
            {getCompanySettings.length <= 0 && (
              <Button
                onClick={handleCreateCompanySettings}
                label="Crear"
                className="p-button-secondary"
                disabled={isButtonDisabled}
              />
            )}
            {getCompanySettings.length > 0 && (
              <Button
                onClick={handleUpdateCompanySettings}
                label="Actualizar"
                className="p-button-secondary"
                // disabled={isButtonDisabled}
              />
            )}
          </div>
        </div>
      </Dialog>

      <Card className="cardSolicitante">
        <DataTable
          value={companies}
          selectionMode="single"
          scrollable
          scrollHeight="400px"
          stripedRows
          tableStyle={{ minWidth: "0rem" }}
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["CompanyCode", "Name", "DBName"]}
          header={header}
          emptyMessage="No hay empresas registradas"
          paginator
          rows={5}
        >
          <Column
            sortable
            field="CompanyCode"
            header="Código"
            style={{ width: "10%" }}
          />
          <Column field="Name" header="Empresa" style={{ width: "20%" }} />

          <Column
            field="DBName"
            header="Base de datos"
            style={{ width: "20%" }}
          />
          <Column
            style={{ width: "10%" }}
            body={(rowData) => (
              <div>
                <Button
                  onClick={() => redirectToEditar(rowData)}
                  icon="pi pi-cog"
                  rounded
                  severity="success"
                  aria-label="Search"
                />
              </div>
            )}
          ></Column>
        </DataTable>
      </Card>
    </Layout>
  );
}

export default Sincronizacion;
