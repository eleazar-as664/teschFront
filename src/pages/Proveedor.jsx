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
import { Tag } from "primereact/tag";
import routes from "../utils/routes";

import "./Proveedor.css";
import "../Components/Styles/Global.css";
import axios from "axios";
function Proveedor() {
  const navigate = useNavigate();

  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [statuses] = useState(["Abierta", "Cerrada"]);
  const [PurchaseOrderId, setPurchaseOrderId] = useState([]);

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [visibleArchivosProveedor, setVvisibleArchivosProveedor] =
    useState(false);
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

  const fetchDataPurchaseOrder = async () => {
    try {
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

  const fetchSAPSyncPurchaseOrders = async () => {
    try {
      const data = {
        SAPToken: user.TokenSAP,
        CompanyId: user.CompanyId,
      };
      console.clear();
      console.log(
        "********************************1OQE***********************************************"
      );
      console.log(data);

      const apiUrl = `${routes.BASE_URL_SERVER}/SAPSyncPurchaseOrders`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.post(apiUrl, data, config);

      console.log(response.data);
    } catch (error) {
      console.log(
        "************************************ERROR************asasasa***********************************"
      );
      console.error("Error al obtener datos de la API:", error);
      console.log(
        "************************************ERROR***********************************************"
      );
    }
  };

  const handleFileSelect = (event) => {
    const nuevosArchivosPDF = Array.from(event.files);
    setArchivosSeleccionados([...archivosSeleccionados, ...nuevosArchivosPDF]);
  };
  const eliminarFiles = (rowData) => {
    console.log(rowData);
    const updatedItems = archivosSeleccionados.filter(
      (item) => item !== rowData
    );
    setArchivosSeleccionados(updatedItems);
  };

  const enviarArchivosSAP = async () => {
    const formData = new FormData();

    const data = {
      PurchaseOrderId: PurchaseOrderId,
      UserId: user.UserId,
      SAPToken: user.TokenSAP,
    };
    formData.append("data", JSON.stringify(data));
    formData.append("FilesToUpload", archivosSeleccionados);

    archivosSeleccionados.forEach((file, index) => {
      formData.append(`FilesToUpload`, file);
    });
    const config = {
      headers: {
        "x-access-token": token,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await axios.post(
        `${routes.BASE_URL_SERVER}/AddAttachmentsToPurchaseOrder`,
        formData,
        config
      );
      fetchDataPurchaseOrder();
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {}, [fetchDataPurchaseOrder]);
  useEffect(() => {
    fetchSAPSyncPurchaseOrders();
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

  const activarArchivosModal = (data) => {
    setPurchaseOrderId(data);
    setArchivosSeleccionados([]);
    setVvisibleArchivosProveedor(true);
  };
  return (
    <Layout>
      <Card className="card-header">
        <div class="row">
          <div className="p-card-title">Ordenes de compra</div>
        </div>
      </Card>
      <Card title="" className="cardProveedor">
        <Dialog
          header="Enviar a SAP"
          visible={visibleArchivosProveedor}
          style={{ width: "30vw" }}
          onHide={() => setVvisibleArchivosProveedor(false)}
        >
          <div className="p-field-group">
            <div className="row align-right">
              {archivosSeleccionados.length < 3 && (
                <FileUpload
                  mode="basic"
                  name="demo[]"
                  multiple
                  accept="image/*,.pdf,.xml"
                  maxFileSize={1000000}
                  onSelect={handleFileSelect}
                  auto
                  chooseLabel="Agregar"
                  className="upload-field-detail"
                />
              )}
              {archivosSeleccionados.length >= 3 && (
                <Button
                  onClick={() => enviarArchivosSAP()}
                  className="pi pi-file-pdf"
                  rounded
                  // severity="danger"
                  label="Enviar Archivos"
                  // aria-label="Enviar"
                />
                //   <Button
                //   label="Aceptar"
                //   icon="pi pi-check"
                //   onClick={handleSave}
                //   className="p-button-primary"
                // />
              )}
            </div>
            <div className="row">
              <div className="p-col-field">
                <DataTable value={archivosSeleccionados}>
                  <Column field="name" header="Nombre" />
                  <Column
                    header="Acción"
                    body={(rowData) => (
                      <a
                        href={rowData.objectURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver
                      </a>
                    )}
                  />
                  <Column
                    header=""
                    body={(rowData) => (
                      <Button
                        onClick={() => eliminarFiles(rowData)}
                        icon="pi pi-times"
                        rounded
                        severity="danger"
                        aria-label="Cancel"
                      />
                    )}
                  ></Column>
                </DataTable>
              </div>
            </div>
          </div>
        </Dialog>
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
          emptyMessage="No hay ordenes de compra"
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
            header="Ver"
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
            body={(rowData) => (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ display: "flex" }}
              >
                {!rowData.Files ||
                  (rowData.Files.length === 0 && ( // Verificar si Files está vacío
                    <Button
                      onClick={() =>
                        activarArchivosModal(rowData.PurchaseOrderId)
                      }
                      className="pi pi-file-import"
                      style={{ fontSize: "24px" }}
                      rounded
                      aria-label="Cancel"
                    />
                  ))}
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
