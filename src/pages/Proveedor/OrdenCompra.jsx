import React, { useEffect, useState } from "react";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from 'primereact/inputtext';
import { FileUpload } from "primereact/fileupload";
import "./OrdenCompra.css";
import { Layout } from "../../Components/Layout/Layout";
import routes from "../../utils/routes";

import axios from "axios";

function NuevaCompra() {
  const [purchaseOrderDataDetail, setPurchaseOrderDataDetail] = useState([]);
  const [purchaseOrderDataHeader, setPurchaseOrderDataHeader] = useState([]);

  

  const ordenData = JSON.parse(localStorage.getItem("purchaseOrderData"));
  const token = JSON.parse(localStorage.getItem("user")).Token;

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

  const dataq = [
    {
      ID_Solicitud: 10,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
    {
      ID_Solicitud: 20,
      No_Requisicion_SAP: "DEF456",
      Fecha_Hora_Creacion: "2024-03-19 11:45:00",
      Fecha_Vencimiento: "2024-04-12",
      No_referencia: "REF002",
      Centro_de_costo: "CC002",
      Empresa: "Empresa B",
      Comentarios: "Comentario 2",
      No_OC_SAP: "OC456",
      Sincronizado: false,
      Adjunto1: "",
      Adjunto2: "",
      Notas_autorizacion: "Notas de autorización 2",
      Notas_requisitor: "Notas del requisitor 2",
    },
    {
      ID_Solicitud: 30,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
    {
      ID_Solicitud: 40,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
    {
      ID_Solicitud: 50,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
    {
      ID_Solicitud: 60,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
  ];
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

        <Card title="Notas" className="adjuntos">
          <div className="p-grid p-nogutter">
            <div>
              <ul>
                {notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
            <div className="p-inputgroup">
              <InputText
                value={note}
                onChange={handleNoteChange}
                placeholder="Agregar nota"
              />
              <Button icon="pi pi-plus" onClick={handleAddNote} />
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default NuevaCompra;
