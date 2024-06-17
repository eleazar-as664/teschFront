import React, { useEffect, useState, useRef } from "react";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";

import { Layout } from "../../Components/Layout/Layout";
import routes from "../../utils/routes";
import "./OrdenCompra.css";

import axios from "axios";

function NuevaCompra() {
  const toast = useRef(null);
  const [purchaseOrderDataDetail, setPurchaseOrderDataDetail] = useState([]);
  const [purchaseOrderDataHeader, setPurchaseOrderDataHeader] = useState([]);
  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);
  const [filesProceedor, setFilesProceedor] = useState([]);

  const ordenData = JSON.parse(localStorage.getItem("purchaseOrderData"));
  const token = JSON.parse(localStorage.getItem("user")).Token;
  const user = JSON.parse(localStorage.getItem("user"));
  const purschageOrderData = JSON.parse(
    localStorage.getItem("purchaseOrderData")
  );

  const fetchDataPurchaseOrderDetail = async () => {
    try {
      console.clear();
      const PurchaseOrderId = ordenData.PurchaseOrderId;
      const apiUrl = `${routes.BASE_URL_SERVER}/GetPurchaseOrder/${PurchaseOrderId}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config);

      setFilesProceedor(response.data.data.Files);

      setPurchaseOrderDataDetail(response.data.data.Detail);
      console.log(response.data.data);

      setPurchaseOrderDataHeader(response.data.data.purchaseOrderHeader);
      // setpurchaseRequesData(response.data.data.purchaseRequestsHeaders);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };
  useEffect(() => {
    fetchDataPurchaseOrderDetail();
  }, []);

  useEffect(() => {}, [fetchDataPurchaseOrderDetail]);

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
      PurchaseOrderId: purschageOrderData.PurchaseOrderId,
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
      console.log("Response:", response.data);

      toast.current.show({
        severity: "success",
        summary: "Notificación",
        detail: "Se envio correctamente la solicitud a SAP",
        life: 2000,
      });
    } catch (error) {
      console.error("Error:", error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al enviar la solicitud a SAP",
        life: 2000,
      });
    } finally {
      fetchDataPurchaseOrderDetail();
      setArchivosSeleccionados([]);
    }
  };
  return (
    <Layout>
      <div class="body-ordenCompra">
        <Toast ref={toast} />

        <Card className="card-header">
          <div class="row">
            <div className="p-card-title">Orden de compra</div>
          </div>
        </Card>

        <Card className="cardOrdenCompra">
          <div className="p-grid p-nogutter">
            <div className="row">
              <div className="p-col-field">
                <div className="p-field">
                  <span className="field-name">No. Orden: </span>
                  {purchaseOrderDataHeader.DocNum}
                </div>
                <div className="p-field">
                  <span className="field-name">Fecha Requerida: </span>
                  {purchaseOrderDataHeader.DocDate}
                </div>
                <div className="p-field">
                  <span className="field-name">Solicitó: </span>
                  {purchaseOrderDataHeader.FirstName}
                  {purschageOrderData.Files.length}
                </div>
              </div>
              <div className="p-col-field">
                <div className="p-field">
                  <span className="field-name">Comentarios: </span>
                  {purchaseOrderDataHeader.Comments}
                </div>
              </div>
            </div>
          </div>
          <DataTable
            value={purchaseOrderDataDetail}
            scrollable
            scrollHeight="200px"
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column field="ItemCode" header="Código" />
            <Column field="Description" header="Descripción" />
            <Column field="BuyUnitMsr" header="Unidad" />
            <Column field="Quantity" header="Cantidad" />
          </DataTable>
        </Card>

        {filesProceedor.length >= 3 ? (
          <Card title="Adjuntos" className="adjuntos">
            <div className="p-field-group">
              <div className="row align-right"></div>
              <div className="row">
                <div className="p-col-field">
                  <DataTable value={filesProceedor}>
                    <Column field="FileName" header="Nombre" />
                    <Column
                      header="Acción"
                      body={(rowData) => (
                        <a
                          href={rowData.SRC}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver
                        </a>
                      )}
                    />
                  </DataTable>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card title="Adjuntos" className="adjuntos">
            <div className="p-field-group">
              <div className="row align-right">
                {archivosSeleccionados.length < 3 ? (
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
                ) : (
                  <Button
                    onClick={enviarArchivosSAP}
                    className="pi pi-file-pdf"
                    rounded
                    label="Enviar Archivos"
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
          </Card>
        )}
      </div>
    </Layout>
  );
}

export default NuevaCompra;
