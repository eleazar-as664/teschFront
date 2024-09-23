import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { ProgressBar } from 'primereact/progressbar';

import { Badge } from 'primereact/badge';
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
import { Toast } from "primereact/toast";
// import generatePDF from './generatePDF'; 
import generatePDF from "../Components/PDFDocumento";
import routes from "../utils/routes";

import "./Proveedor.css";
import "../Components/Styles/Global.css";
import axios from "axios";
function Proveedor() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [statuses] = useState(["Abierto", "Cerrado", "Pendiente", "Cancelado"]);
  const [PurchaseOrderId, setPurchaseOrderId] = useState([]);
  const [loadingSpinner, setLoadingSpinner] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [visibleArchivosProveedor, setVisibleArchivosProveedor] =
    useState(false);
  const[visibleDifereciasEnMontos, setVisibleDifereciasEnMontos] = useState(false); 
  const [diferenciaMontosXMLMensaje, setDiferenciaMontosXMLMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);
  const [pdfInstance, setPdfInstance] = useState(null);
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

      const updatedData = response.data.data.map((item) => ({
        ...item,
        concatenatedInfo: `${item.BusinessName} - ${item.DocDate}`,
      }));

      console.log(updatedData);
      setPurchaseOrderData(updatedData);
      // setpurchaseOrderData(response.data.data.purchaseRequestsHeaders);
   
    } catch (error) {
      let {
        response: {
          data: { detailMessage, message },
        },
      } = error;
      console.error("Error al obtener datos de la API:", error);
      toast.current.show({
        severity: "warn",
        summary: message,
        detail: detailMessage,
        life: 3000,
      });
    }
    finally {
      setLoadingSpinner(false);
    }
  };

  const fetchSAPSyncPurchaseOrders = async () => {
    try {
      const data = {
        SAPToken: user.TokenSAP,
        CompanyId: user.CompanyId,
      };
      console.clear();

      const apiUrl = `${routes.BASE_URL_SERVER}/SAPSyncPurchaseOrders`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.post(apiUrl, data, config);

      console.log(response.data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error.response.data);

      if (error.response.data.code == 401) {
        toast.current.show({
          severity: "warn",
          summary: "Información",
          detail: `${error.response.data.detailMessage}`,
          life: 3000,
        });
      }
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

  const cancelarEnviarArchivosSAP = () => {
    setVisibleArchivosProveedor(false);
    setVisibleDifereciasEnMontos(false);
  };

  const enviarArchivosSAP = async (XMLAuthorized=false) => {

    setLoading(true);
    const formData = new FormData();

    const data = {
      PurchaseOrderId: PurchaseOrderId,
      UserId: user.UserId,
      SAPToken: user.TokenSAP,
      XMLAuthorized
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

      console.log("Respuesta de envio de documentos a SAP")
      console.log(response);
      let { data: { code,message, detailMessage } } = response;
      if(code == 201)
      {
        setLoading(false);
        setVisibleArchivosProveedor(false);
        setDiferenciaMontosXMLMensaje(detailMessage);
        setVisibleDifereciasEnMontos(true);
        return;
      }
      setLoading(false);
      fetchDataPurchaseOrder();
      setVisibleArchivosProveedor(false);
      setVisibleDifereciasEnMontos(false);
      toast.current.show({
        severity: "success",
        summary: message,
        detail: detailMessage,
        life: 8000,
      });
    } catch (error) {
      setLoading(false);
      let { response: { data: { detailMessage, message } } } = error;
      console.error("Error al enviar la solicitud a SAP:", error);
      setVisibleArchivosProveedor(false);
      setVisibleDifereciasEnMontos(false);
      toast.current.show({
        severity: "error",
        summary: message,
        detail: detailMessage,
        life: 8000,
      });
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

  const redirectToDetalle = async (event) => {
    console.clear();
        // console.log(event);
    const dataPDF = event;
    const PurchaseOrderId = event.PurchaseOrderId;
    const apiUrl = `${routes.BASE_URL_SERVER}/GetPurchaseOrder/${PurchaseOrderId}`;
    const config = {
      headers: {
        "x-access-token": token,
      },
    };
    const response = await axios.get(apiUrl, config);
    console.log(response.data.data);
    const datosPDf = response.data.data.purchaseOrderHeader;
    const detail = response.data.data.Detail;
    datosPDf.details = detail;
    console.clear();
    console.log(datosPDf);
     generatePDF(datosPDf);// Generar el PDF con los datos del rowData
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

  const activarArchivosModal = (data) => {
    setPurchaseOrderId(data);
    setArchivosSeleccionados([]);
    setVisibleArchivosProveedor(true);
  };
 
  return (
    <Layout>
      <Card className="card-header">
        <div class="row">
          <div className="p-card-title">Ordenes de compra</div>
        
        </div>
      </Card>
      <Card title="" className="cardProveedor">
        <Toast ref={toast} />

        <Dialog
          header="Enviar a SAP"
          visible={visibleArchivosProveedor}
          style={{ width: "30vw" }}
          onHide={() => setVisibleArchivosProveedor(false)}
        >
          <div className="p-field-group">
            <div className="row align-right">
              {archivosSeleccionados.length < 3 && (
                <FileUpload
                  mode="basic"
                  name="demo[]"
                  multiple
                  accept="image/*,.pdf,.xml"
                  maxFileSize={20000000}
                  onSelect={handleFileSelect}
                  auto
                  chooseLabel="Agregar"
                  className="upload-field-detail"
                />
              )}
              {archivosSeleccionados.length >= 3 && (
              
                  <Button
                  onClick={() => enviarArchivosSAP()}
                  loading={loading}
                  className={loading ? "" : "pi pi-file-pdf"}
                  rounded
                  label=" Enviar"
                />
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

        <Dialog
          header="Atención"
          visible={visibleDifereciasEnMontos}
          style={{ width: "30vw" }}
          onHide={() => setVisibleDifereciasEnMontos(false)}
        >
          <div className="p-field-group">
            <div className="row align-center mb-2">
              <p>{diferenciaMontosXMLMensaje}</p>
            </div>

            <div className="p-field-group  mb-2">
              <h3>¿Deseas continuar?</h3>
            </div>
          </div>
          <div className="p-field-group">
            <div className="row align-right">
            <Button
                onClick={() => cancelarEnviarArchivosSAP()}
                className="p-button-secondary"
                disabled={loading}
                label="Cancelar"
              />              
              <Button
                onClick={() => enviarArchivosSAP(true)}
                className={loading ? "" : "p-button-primary"}
                loading={loading}
                label="Continuar"
              />
            </div>
          </div>
        </Dialog>
        {loadingSpinner ? (
            <div className="spinner-container">
               <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
            </div>
        ) : (
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
            sortable 
            style={{ width: "10%" }}
          ></Column>
          <Column
            field="concatenatedInfo"
            header="Empresa/Fecha Solicitud"
            style={{ width: "40%" }}
            sortable 
          ></Column>
          <Column
            field="DocDueDate"
            header="Fecha Requerida"
            style={{ width: "10%" }}
            sortable 
          ></Column>
          <Column
            field="StatusSAP"
            header="Estatus"
            style={{ width: "20%" }}
            body={statusBodyTemplate}
            sortable 
            filter
            filterElement={statusRowFilterTemplate}
          ></Column>
          <Column
            header="Ver"
            style={{ width: "10%" }}
            body={(rowData) => (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ display: "flex" }}
              >
                <Button
                  onClick={() => redirectToDetalle(rowData)} // Agrega la función para redireccionar a la página de detalle
                  label={
                    <i
                      className="pi pi-file-pdf ff"
                      style={{ fontSize: "24px", color: "#f73164" }}
                    />
                  }
                  text
                />
              </div>
            )}
          ></Column>
         
          <Column
            header="Subir Factura"
            style={{ width: "10%" }}
            body={(rowData) => (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ display: "flex" }}
              >
                {(rowData.Files.length < 2 || rowData.IsAnualPurchaseOrder === true) && 
                      (rowData.StatusSAP === "Abierto" && (   
                          <Button
                            onClick={() =>
                              activarArchivosModal(rowData.PurchaseOrderId)
                            }
                            aria-label="Cancel"                          
                            icon="pi pi-file-import"
                            rounded
                            severity="info"                        
                          />
                        )
                      )
                }
                {rowData.IsAnualPurchaseOrder === true && (   
                          <Badge value="+" />
                        )
                }

              </div>
            )}
          />
        </DataTable>
          )}
      </Card>
    </Layout>
  );
}

export default Proveedor;
