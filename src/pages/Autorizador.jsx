import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";

import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Layout } from "../Components/Layout/Layout";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Toast } from "primereact/toast";

import { Tag } from "primereact/tag";
import routes from "../utils/routes";

import "./Proveedor.css";
import "../Components/Styles/Global.css";
import axios from "axios";
function Autorizador() {
  const navigate = useNavigate();

  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [statuses] = useState(["Abierto", "Cerrado", "Cancelado", "Pendiente"]);

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    DocNum: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    concatenatedInfo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    DocDueDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    StatusSAP: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user")).Token;

  const fetchDataPurchaseOrderHeadersPendingApproval = async () => {
    try {
      console.clear();
      console.log("Cargando datos de la API...");
      const IdUsuario = user.UserId;
      const apiUrl = `${routes.BASE_URL_SERVER}/GetPurchaseOrderHeadersPendingApproval/${IdUsuario}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      console.log(apiUrl);
      const response = await axios.get(apiUrl, config);
      console.log(response.data.data);
      // setpurchaseOrderData(response.data.data);
      const updatedData = response.data.data.map((item) => ({
        ...item,
        concatenatedInfo: `${item.BusinessName} - ${item.DocDate}`,
      }));
      console.log(updatedData);

      setPurchaseOrderData(updatedData);
      // setpurchaseOrderData(response.data.data.purchaseRequestsHeaders);
    } catch (error) {
      console.error(
        "Error al obtener datos de la API:",
        error.response.data.message
      );
    }
  };

  const handleFileSelect = (event) => {
    const nuevosArchivosPDF = Array.from(event.files);
    setArchivosSeleccionados([...archivosSeleccionados, ...nuevosArchivosPDF]);
  };

  useEffect(() => {
    localStorage.removeItem("purchaseOrderData");
    fetchDataPurchaseOrderHeadersPendingApproval();
  }, []);

  const handleRowClick = (event) => {
    console.clear();
    console.log("Clic en la fila", event.data);
    const rowData = event.data;
    localStorage.setItem("purchaseOrderData", JSON.stringify(rowData));

    // Redirigir a la página de detalles
    navigate("/Autorizador/Autorizador/AutorizadorOrdenCompra");
  };

  const redirectToDetalle = (datos) => {
    console.clear();
    console.log("Boton presionado");
    console.log(datos.Id);
  };

  // Función para obtener el estado de la orden
  const getSeverity = (status) => {
    switch (status) {
      case "Cerrado":
        return "danger";

      case "Abierto":
        return "success";
      case "Pendiente":
        return "warning";

      case "Cancelado":
        return "danger";

      default:
        return null;
    }
  };
  const statusItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Seleciona un estado"
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };
  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.StatusSAP}
        severity={getSeverity(rowData.StatusSAP)}
      />
    );
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
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            className="search-input"
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
        <div class="row">
          <div className="p-card-title">Ordenes de compra</div>
        </div>
      </Card>
      <Card title="" className="cardProveedor">
        <DataTable
          value={purchaseOrderData}
          selectionMode="single"
          // selection={selectedItem}
          onRowClick={handleRowClick} // Capturar el clic en la fila
          scrollable
          scrollHeight="400px"
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["DocNum", "CompanyName", "DocDate", "StatusSAP"]}
          emptyMessage="No hay resultados"
          header={header}
          paginator
          rows={5}
        >
          <Column
            field="DocNum"
            header="Orden"
            style={{ width: "10%" }}
          ></Column>
          <Column
            field="CompanyName"
            header="Empresa"
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="DocDate"
            header="Fecha Orden"
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="Requester"
            header="Solicitó"
            style={{ width: "20%" }}
          ></Column>
          <Column
            field="ApprovalStatus"
            header="Estatus"
            style={{ width: "20%" }}
            body={(rowData) => {
              switch (rowData.ApprovalStatus) {
                case "Para Autorizar":
                  return (
                    <div>
                      <i
                        className="pi pi-exclamation-triangle"
                        style={{ color: "orange" }}
                      ></i>
                      {rowData.ApprovalStatus}
                    </div>
                  );
                case "Abierto":
                  return (
                    <div>
                      <i
                        className="pi pi-lock-open"
                        style={{ color: "purple" }}
                      ></i>
                      {rowData.ApprovalStatus}
                    </div>
                  );
                case "Cerrado":
                  return (
                    <div>
                      <i
                        className="pi pi-check-circle"
                        style={{ color: "green" }}
                      ></i>
                      {rowData.ApprovalStatus}
                    </div>
                  );
                case "Cancelado":
                  return (
                    <div>
                      <i
                        className="pi pi-times-circle"
                        style={{ color: "red" }}
                      ></i>
                      {rowData.ApprovalStatus}
                    </div>
                  );
                default:
                  return rowData.ApprovalStatus;
              }
            }}
          ></Column>
          <Column
            headerStyle={{ width: "5%", minWidth: "5rem" }}
            bodyStyle={{ textAlign: "center" }}
          ></Column>
        </DataTable>
      </Card>
    </Layout>
  );
}

export default Autorizador;
