import React, { useRef, useState } from "react";
import { redirect } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { Navbar } from "../../Navbar";
import "./NuevaCompra.css";
function EditarRequisicion() {

    const detallesEditarRequisicion = JSON.parse(localStorage.getItem('datosRequisitor'));
    console.log('Holaa datosRequisitor', detallesEditarRequisicion)


    const toast = useRef(null);
    const [value, setValue] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
  
    const onUpload = (event) => {
      // Aquí puedes manejar la lógica cuando se cargan los archivos
      setUploadedFiles(event.files);
    };
    const footer = (
      <div>{/* <Button label="Guardar" icon="pi pi-check" /> */}</div>
    );
    const accept = () => {
      toast.current.show({
        severity: "info",
        summary: "Confirmed",
        detail: "",
        life: 3000,
      });
      return redirect("../Solicitante");
    };
  
    const reject = () => {
      toast.current.show({
        severity: "warn",
        summary: "Rejected",
        detail: "You have rejected",
        life: 3000,
      });
    };
  
    const confirm1 = () => {
      confirmDialog({
        message: "Confirmar la solicitud de compra",
        header: "Nueva Compra",
        icon: "pi pi-exclamation-triangle",
        defaultFocus: "accept",
        accept,
        reject,
      });
    };
  
    const data = [
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
    const almacenOptions = [
      { label: "Distribuidora Tonsa", value: "almacen1" },
      { label: "Grupo Logistico MM", value: "almacen2" },
      { label: "Distribuidora 3", value: "almacen3" },
    ];
  
    const [formData, setFormData] = React.useState({
      nombre: "",
      almacen: "",
      proveedor: "",
      cantidad: "",
      precio: "",
    });
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    };
    const handleDropdownChange = (name, value) => {
      setFormData({ ...formData, [name]: value });
    };
    const handleDateChange = (name, value) => {
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
  return (
    <div>
      <Navbar />
      <div className="card flex justify-content-center">
      <Card title="Editar Solicitud" footer={footer} className="cardNuevaCompra">
          <div className="botonEnviar">
            <Toast ref={toast} />
            <ConfirmDialog />
            <Button label="Guardar" onClick={confirm1} icon="pi pi-check" />
          </div>
          <div className="botonCancelar">
            <Button label="Cancelar" severity="danger"  icon="pi pi-times" />
          </div>
          <div className="p-field-group">
            <div className="row">
              <div className="p-field">
                <label htmlFor="fecha">Fecha de Vencimiento:</label>
                <Calendar
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={(e) => handleDateChange("fecha", e.value)}
                  dateFormat="dd/mm/yy"
                  placeholder="Seleccione una fecha"
                />
              </div>
              <div className="p-field">
                <label htmlFor="nombre">No. referencia:</label>
                <InputText
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </div>

              <div className="p-field">
                <label htmlFor="almacen">Empresa:</label>
                <Dropdown
                  id="almacen"
                  name="almacen"
                  value={formData.almacen}
                  options={almacenOptions}
                  onChange={(e) => handleDropdownChange("almacen", e.value)}
                  placeholder="Seleccione un almacén"
                />
              </div>
            </div>
            <div className="row">
              <div className="p-field">
                <label htmlFor="proveedor">Comentarios</label>
                <InputTextarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  rows={1}
                  cols={10}
                />
              </div>
              <div className="p-field">
                <label htmlFor="proveedor">Subir adjuntos</label>

                <FileUpload
                  mode="basic"
                  name="demo[]"
                  url="/api/upload"
                  accept="image/*"
                  customUpload
                  onUpload={onUpload}
                />
              </div>
            </div>
          </div>
          <DataTable
            value={data}
            scrollable
            scrollHeight="200px"
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column field="No_Requisicion_SAP" header="Código" />
            <Column field="Fecha_Hora_Creacion" header="Descripción" />
            <Column field="Fecha_Vencimiento" header="Unidad" />
            <Column field="Centro_de_costo" header="Cantidad" />
          </DataTable>
        </Card>
      </div>
    </div>
  );
}

export default EditarRequisicion;
