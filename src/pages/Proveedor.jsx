import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";

import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Layout } from "../Components/Layout/Layout";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Tag } from "primereact/tag";
import routes from "../utils/routes";

import "./Proveedor.css";
import "../Components/Styles/Global.css";
import axios from "axios";
function Proveedor() {
  const navigate = useNavigate();

  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [statuses] = useState(["Abierta", "Cerrada"]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    DocNum: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    concatenatedInfo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    DocDueDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    StatusSAP: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user")).Token;

  const fetchDataPurchaseOrder = async () => {
    try {
      console.clear();
      console.log(user.UserId);
      const IdUsuario = user.UserId;
      const apiUrl = `${routes.BASE_URL_SERVER}/GetPurchaseOrdersHeadersForSupplier/${IdUsuario}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config);
      // console.log(response.data.data);
      // setpurchaseOrderData(response.data.data);
      const updatedData = response.data.data.map((item) => ({
        ...item,
        concatenatedInfo: `${item.BusinessName} - ${item.DocDate}`,
      }));
      console.log(updatedData);

      setPurchaseOrderData(updatedData);
      // setpurchaseOrderData(response.data.data.purchaseRequestsHeaders);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };
  useEffect(() => {
    localStorage.removeItem("purchaseOrderData");
    fetchDataPurchaseOrder();
  }, []);

  const handleRowClick = (event) => {
    const rowData = event.data;
    localStorage.setItem("purchaseOrderData", JSON.stringify(rowData));

    // Redirigir a la página de detalles
    navigate("./Proveedor/OrdenCompra");
  };

  const redirectToDetalle = (event) => {
    console.log("HOLAAAAAAAAAAAAAAAAAAAA ELEAZAR :b");
  };

  // Función para obtener el estado de la orden
  const getSeverity = (status) => {
    switch (status) {
      case "Cerrada":
        return "danger";

      case "Abierta":
        return "success";

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
          <div class="gorup-search">
            <div className="p-field">
              <Dropdown id="Filtros" name="Filtros" placeholder="Filtros" />
            </div>
            <div className="p-field">
              <InputText id="nombre" name="nombre" />
            </div>
          </div>
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
          globalFilterFields={[
            "DocNum",
            "concatenatedInfo",
            "DocDueDate",
            "StatusSAP",
          ]}
          emptyMessage="No hay solicitudes de compra registradas"
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
            field="concatenatedInfo"
            header="Empresa/Fecha Solicitud"
            style={{ width: "40%" }}
          ></Column>
          <Column
            field="DocDueDate"
            header="Fecha Requerida"
            style={{ width: "40%" }}
          ></Column>
          <Column
            field="StatusSAP"
            header="Estatus"
            style={{ width: "10%" }}
            body={statusBodyTemplate}
            filter
            filterElement={statusRowFilterTemplate}
          ></Column>
          <Column
            header="Descargar"
            body={(rowData) => (
              <Button
                onClick={() => redirectToDetalle(rowData.id)} // Agrega la función para redireccionar a la página de detalle
                label={
                  <i
                    className="pi pi-file-pdf"
                    style={{ fontSize: "24px", color: "#f73164" }}
                  />
                }
                text
              />
            )}
          ></Column>

          <Column
            header="Subir Factura"
            style={{ width: "30%" }}
            body={() => (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ display: "flex" }}
              >
                <FileUpload
                  mode="basic"
                  chooseLabel={
                    <i
                      className="pi pi-file-pdf"
                      style={{ fontSize: "24px" }}
                    />
                  }
                  uploadLabel="Subir"
                  cancelLabel="Cancelar"
                  customUpload
                  // onUpload={onPDFUpload}
                  accept="application/pdf"
                />
                <FileUpload
                  mode="basic"
                  chooseLabel={
                    <i
                      className="pi pi-file-excel"
                      style={{ fontSize: "24px" }}
                    />
                  }
                  uploadLabel="Subir"
                  cancelLabel="Cancelar"
                  customUpload
                  // onUpload={onPDFUpload}
                  accept="application/xml"
                  style={{ width: "80px", height: "50px" }}
                />
              </div>
            )}
          />
          <Column
            headerStyle={{ width: "5%", minWidth: "5rem" }}
            bodyStyle={{ textAlign: "center" }}
          ></Column>
        </DataTable>
      </Card>
    </Layout>
  );
}

export default Proveedor;
