import React, { useEffect, useState } from "react";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import "./OrdenCompra.css";
import { Layout } from "../../Components/Layout/Layout";
import routes from "../../utils/routes";

import axios from "axios";

function NuevaCompra() {
  const [purchaseOrderDataDetail, setPurchaseOrderDataDetail] = useState([]);
  const [purchaseOrderDataHeader, setPurchaseOrderDataHeader] = useState([]);
  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);

  const ordenData = JSON.parse(localStorage.getItem("purchaseOrderData"));
  const token = JSON.parse(localStorage.getItem("user")).Token;
  const user = JSON.parse(localStorage.getItem("user"));
  const purschageOrderData = JSON.parse(localStorage.getItem("purchaseOrderData"));

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

      setPurchaseOrderDataDetail(response.data.data.Detail);
      console.log(response.data.data.purchaseOrderHeader);
      setPurchaseOrderDataHeader(response.data.data.purchaseOrderHeader);
      // setpurchaseRequesData(response.data.data.purchaseRequestsHeaders);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };
  useEffect(() => {
    // localStorage.removeItem("datosRequisitor");
    fetchDataPurchaseOrderDetail();
  }, []);


  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };
  const handleAddNote = () => {
    if (note.trim() !== "") {
      setNotes([...notes, note]);
      setNote("");
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
      PurchaseOrderId: purschageOrderData.PurchaseOrderId,
      UserId: user.UserId,
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
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <Layout>
      <div class="body-ordenCompra">
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
                </div>
              </div>
              <div className="p-col-field">
                <div className="p-field">
                  <span className="field-name">Comentarios: </span>
                  {purchaseOrderDataHeader.Comments}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="p-field button-conteiner upload-field-detail">
                <FileUpload
                  mode="basic"
                  name="demo[]"
                  url="/api/upload"
                  accept="image/*"
                  maxFileSize={1000000}
                  chooseLabel="Agregar factura PDF"
                />
                <FileUpload
                  mode="basic"
                  name="demo[]"
                  url="/api/upload"
                  accept="image/*"
                  maxFileSize={1000000}
                  chooseLabel="Agregar factura XML"
                />
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
            <Column field="Quantity" header="Unidad" />
            <Column field="Quantity" header="Cantidad" />
          </DataTable>
        </Card>

        <Card title="Adjuntos" className="adjuntos">
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
      </div>
    </Layout>
  );
}

export default NuevaCompra;
