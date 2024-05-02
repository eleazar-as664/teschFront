import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Layout } from '../Components/Layout/Layout';
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import "./Proveedor.css";
import "../Components/Styles/Global.css";

function Proveedor() {
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();
  const arrayObjetos = [
    {
      orden: 1,
      empresa: "Empresa A",
      fechaRequerida: new Date(2024, 3, 1), // Año, mes (0-indexed), día
      estatus: "En proceso",
      rutaPDF: "../assets/pdfs/prueba.pdf",
    },
    {
      orden: 2,
      empresa: "Empresa B",
      fechaRequerida: new Date(2024, 2, 15),
      estatus: "Completado",
    },
    {
      orden: 3,
      empresa: "Empresa C",
      fechaRequerida: new Date(2024, 1, 20),
      estatus: "Cancelado",
    },
    {
      orden: 4,
      empresa: "Empresa D",
      fechaRequerida: new Date(2024, 0, 10),
      estatus: "En proceso",
    },
    {
      orden: 5,
      empresa: "Empresa E",
      fechaRequerida: new Date(2023, 11, 5),
      estatus: "Completado",
    },
    {
      orden: 6,
      empresa: "Empresa F",
      fechaRequerida: new Date(2023, 10, 25),
      estatus: "En proceso",
    },
    {
      orden: 7,
      empresa: "Empresa G",
      fechaRequerida: new Date(2023, 9, 15),
      estatus: "Cancelado",
    },
    {
      orden: 8,
      empresa: "Empresa H",
      fechaRequerida: new Date(2023, 8, 7),
      estatus: "Completado",
    },
    {
      orden: 9,
      empresa: "Empresa I",
      fechaRequerida: new Date(2023, 7, 2),
      estatus: "En proceso",
    },
    {
      orden: 10,
      empresa: "Empresa J",
      fechaRequerida: new Date(2023, 6, 30),
      estatus: "En proceso",
    },
    {
      orden: 11,
      empresa: "Empresa K",
      fechaRequerida: new Date(2023, 5, 20),
      estatus: "Completado",
    },
    {
      orden: 12,
      empresa: "Empresa L",
      fechaRequerida: new Date(2023, 4, 12),
      estatus: "En proceso",
    },
    {
      orden: 13,
      empresa: "Empresa M",
      fechaRequerida: new Date(2023, 3, 6),
      estatus: "Cancelado",
    },
    {
      orden: 14,
      empresa: "Empresa N",
      fechaRequerida: new Date(2023, 2, 25),
      estatus: "Completado",
    },
    {
      orden: 15,
      empresa: "Empresa O",
      fechaRequerida: new Date(2023, 1, 15),
      estatus: "En proceso",
    },
    {
      orden: 16,
      empresa: "Empresa P",
      fechaRequerida: new Date(2023, 0, 8),
      estatus: "Completado",
    },
    {
      orden: 17,
      empresa: "Empresa Q",
      fechaRequerida: new Date(2022, 11, 30),
      estatus: "Cancelado",
    },
    {
      orden: 18,
      empresa: "Empresa R",
      fechaRequerida: new Date(2022, 10, 20),
      estatus: "En proceso",
    },
    {
      orden: 19,
      empresa: "Empresa S",
      fechaRequerida: new Date(2022, 9, 10),
      estatus: "En proceso",
    },
    {
      orden: 20,
      empresa: "Empresa T",
      fechaRequerida: new Date(2022, 8, 5),
      estatus: "Completado",
    },
  ];
  const onPDFUpload = (event) => {
    // const file = event.files[0];
    // const newFile = { name: file.name, size: file.size, type: file.type };
    // setUploadedFiles([...uploadedFiles, newFile]);
  };
  const onXMLUpload = (event) => {
    // const file = event.files[0];
    // setUploadedXML(file);
  };
  const handleRowClick = (event) => {
    // Obtener los datos de la fila seleccionada
    const rowData = event.data;

    // Guardar solo los datos necesarios en el localStorage
    const selectedItem = {
      orden: rowData.orden,
      empresa: rowData.empresa,
      // Añade más propiedades según sea necesario
    };
    localStorage.setItem("selectedItem", JSON.stringify(selectedItem));

    // Redirigir a la página de detalles
    navigate("./Proveedor/OrdenCompra");
  };

  const redirectToDetalle = (event) =>{
    console.log('HOLAAAAAAAAAAAAAAAAAAAA ELEAZAR :b')
  }

  return (
    <Layout>
      <Card className="card-header">
        <div class="row"> 
        <div className="p-card-title">Ordenes de compra</div>
           <div class="gorup-search">
              <div className="p-field">
                <Dropdown
                          id="Filtros"
                          name="Filtros"
                          placeholder="Filtros"
                        />
              </div>
              <div className="p-field">
                <InputText
                  id="nombre"
                  name="nombre"
                />
              </div>
          </div>    
        </div>
      </Card>
      <Card title="" className="cardProveedor">
        <DataTable
          value={arrayObjetos}
          selectionMode="single"
          selection={selectedItem}
          onRowClick={handleRowClick} // Capturar el clic en la fila
          scrollable
          scrollHeight="400px"
        >
          <Column field="orden" header="Orden" style={{ width: '10%'}}></Column>
          <Column field="empresa" header="Empresa/Fecha Solicitud" style={{ width: '40%'}} ></Column>
          <Column field="empresa" header="Fecha Requerida" style={{ width: '40%'}} ></Column>
          <Column field="estatus" header="Estatus" style={{ width: '10%'}}></Column>
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
            style={{ width: '30%'}}
            body={() => (
              <div onClick={(e) => e.stopPropagation()} style={{ display:"flex" }}>
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
                  onUpload={onPDFUpload}
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
                  onUpload={onPDFUpload}
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
