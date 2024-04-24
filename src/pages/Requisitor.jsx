import React, { useRef, useState, useEffect } from "react";
import { BrowserRouter as router, Link } from "react-router-dom";
import { useMountEffect } from "primereact/hooks";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Layout } from "../Components/Layout/Layout";
import { Toast } from "primereact/toast";
import axios from "axios";
import "./Requisitor.css";
import "../Components/Styles/Global.css";
function Requisitor() {
  const msgs = useRef(null);


  const [selectedItem, setSelectedItem] = useState(null);
  const [data1, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [rowDataToCancel, setRowDataToCancel] = useState(null);
  let toast;
  const cancelarSolicitud = (rowData) => {
    setRowDataToCancel(rowData);
    setVisible(true); // Esto abre el Dialog
  };

  const handleDialogCancel = () => {
    const purchaseRequestId = rowDataToCancel.PurchaseRequestId;
  
    axios.delete(`http://localhost:3000/api/v1/DeletePurchaseRequest/${purchaseRequestId}`)
      .then(response => {
        console.log('Solicitud de compra cancelada con éxito');
        fetchData();
        toast.show({
          severity: "success",
          summary: "Notificación",
          detail: "Solicitud de compra cancelada con éxito",
          life: 3000,
        });
        // Realizar cualquier acción adicional después de cancelar la solicitud, como actualizar la lista de solicitudes de compra
      })
      .catch(error => {
        console.error('Error al cancelar la solicitud de compra:', error);
        // Manejar el error, como mostrar un mensaje al usuario
      });
    console.log("handleDialogCancel",rowDataToCancel.PurchaseRequestId  );
    setRowDataToCancel(null);
    setVisible(false); // Esto cierra el Dialog
  };

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const fetchData = async () => {
    try {
      const apiUrl = `http://localhost:3000/api/v1/GetPurchaseRequestsByUser/${user.UserId}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config);
      const purchaseRequests = response.data.data.purchaseRequests;
      console.log(purchaseRequests);

      // Mapear los purchaseRequests y extraer los detalles necesarios
      const data = purchaseRequests.map((request) => {
        return {
          PurchaseRequestId: request.purchaseRequestHeader.PurchaseRequestId,
          Company: request.purchaseRequestHeader.Company,
          Comments: request.purchaseRequestHeader.Comments,
          DocDate: request.purchaseRequestHeader.DocDate,
          StatusSAP: request.purchaseRequestHeader.StatusSAP,
          NumAtCard: request.purchaseRequestHeader.NumAtCard,
          // Aquí puedes agregar más propiedades del objeto `purchaseRequestHeader` según tus necesidades
        };
      });
      console.log("Responseasaaaaaaaaaaaaaaaaaaaaaaaaaa:", data);

      setData(data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };
  useEffect(() => {
    

    fetchData();
  }, []);
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
    localStorage.removeItem("datosRequisitor");
    localStorage.setItem("datosRequisitor", JSON.stringify(rowData));
    navigate("./Requisitor/EditarRequisicion");
  };

  const handleRowClick = (event) => {
    // Obtener los datos de la fila seleccionada
    const rowData = event.data;
    console.clear();
    console.log(rowData);

    // // Guardar solo los datos necesarios en el localStorage
    // const selectedItem = {
    //   orden: rowData.orden,
    //   empresa: rowData.empresa,
    //   // Añade más propiedades según sea necesario
    // };
    // localStorage.setItem("selectedItem", JSON.stringify(selectedItem));

    // Redirigir a la página de detalles
    navigate("./Requisitor/DetalleCompra");
  };

  return (
    <Layout>
      <Card className="card-header">
      <Toast ref={(el) => (toast = el)} />
        <div class="row">
          <div className="p-card-title">Solicitudes</div>
          <div class="gorup-search">
            <div className="p-field">
              <Link to="./Requisitor/NuevaCompra">
                <Button
                  label="Nueva Solicitud"
                  severity="primary"
                  raised
                  icon="pi pi-plus-circle"
                  iconPos="left"
                  className="botonInsertarRequisitor"
                />
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <Card className="cardSolicitante">
        <Dialog
          header="Cancelar Solicitud"
          visible={visible}
          style={{ width: "30vw" }}
          onHide={() =>setVisible(false)}
        >
          {rowDataToCancel && (
            <div>
              <p>¿Estás seguro que deseas cancelar la solicitud?</p>
              <p>Detalles de la solicitud: {rowDataToCancel.NumAtCard}</p>
              <div class="row">
                <Button
                  onClick={handleDialogCancel}
                  label="Si"
                  className="p-button-secondary"
                />
                {/* Agregar aquí el botón para confirmar la cancelación si es necesario */}
              </div>
            </div>
          )}
        </Dialog>
        <DataTable
          value={data1}
          selectionMode="single"
          selection={selectedItem}
          onRowClick={handleRowClick} 
          scrollable
          scrollHeight="400px"
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column sortable field="PurchaseRequestId" header="No." />
          <Column field="Company" header="Empresa/No.SAP" />
          <Column field="DocDate" header="F.Creación" />

          <Column field="StatusSAP" header="Estatus" />
          <Column field="NumAtCard" header="Referencia" />
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
                severity="success"
              />
            )}
          ></Column>
        </DataTable>
        
      </Card>
    </Layout>
  );
}

export default Requisitor;
