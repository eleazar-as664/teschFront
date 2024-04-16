import React, { useRef, useState } from "react";
import { BrowserRouter as router, Link } from "react-router-dom";
import { useMountEffect } from "primereact/hooks";
import { Navbar } from "../Navbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
// import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import "./Requisitor.css";
function Requisitor() {
  const msgs = useRef(null);
  const data = [
    {
      ID_Solicitud: 1,
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
      ID_Solicitud: 49,
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
      ID_Solicitud: 16,
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
      ID_Solicitud: 15,
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
      ID_Solicitud: 14,
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
      ID_Solicitud: 2,
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
  ];

  const [expandedRows] = useState(null);

  const [visible, setVisible] = useState(false);
  const [rowDataToCancel, setRowDataToCancel] = useState(null);

  const cancelarSolicitud = (rowData) => {

    setRowDataToCancel(rowData);
    setVisible(true); // Esto abre el Dialog
  };

  const handleDialogCancel = () => {
  
    setRowDataToCancel(null);
    setVisible(false); // Esto cierra el Dialog
  };

  const navigate = useNavigate();

  useMountEffect(() => {
    if (msgs.current) {
      msgs.current.clear();
      msgs.current.show({
        id: "1",
        sticky: true,
        severity: "info",
        summary: "Info",
        detail: "Solicitante paguina :b",
        closable: false,
      });
    }
  });

  const redirectToEditar = (datos) => {   
    const rowData = datos;
    localStorage.setItem("datosRequisitor", JSON.stringify(rowData));
    navigate("./Requisitor/EditarRequisicion");
  };


  return (
    <div className="card flex justify-content-center">
      <Navbar />
      <Card title="Grupo Hormadi" className="cardSolicitante">
      <Dialog
        header="Cancelar Solicitud"
        visible={visible}
        style={{ width: '50vw' }}
        onHide={handleDialogCancel}
      >
        {rowDataToCancel && (
          <div>
            <p>¿Estás seguro que deseas cancelar la solicitud?</p>
            <p>Detalles de la solicitud: {rowDataToCancel.No_OC_SAP}</p>
            <Button
              onClick={handleDialogCancel}
              label="Cancelar"
              className="p-button-secondary"
            />
            {/* Agregar aquí el botón para confirmar la cancelación si es necesario */}
          </div>
        )}
      </Dialog>

        <Link to="./Requisitor/NuevaCompra">
          <Button
            label="Nuevo"
            severity="info"
            raised
            icon="pi pi-plus"
            iconPos="right"
            className="botonInsertarRequisitor"
          />
        </Link>

        <DataTable
          value={data}
          expandedRows={expandedRows}
       
          scrollable
          scrollHeight="400px"
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column sortable field="ID_Solicitud" header="No." />
          <Column field="No_Requisicion_SAP" header="Empresa/No.SAP" />
          <Column field="Fecha_Hora_Creacion" header="Fecha de Creación" />

          <Column field="Centro_de_costo" header="Estatus" />
          <Column field="Empresa" header="Referencia" />
          <Column
            header="Cancelar"
            body={(rowData) => (
              <Button
                onClick={() => cancelarSolicitud(rowData)}
                label="Cancelar"
                severity="danger"
              />
            )}
          ></Column>
          <Column
            header="Editar"
            body={(rowData) => (
              <Button
                onClick={() => redirectToEditar(rowData)}
                label="Editar"
              />
            )}
          ></Column>
        </DataTable>
      </Card>
    </div>
  );
}

export default Requisitor;
