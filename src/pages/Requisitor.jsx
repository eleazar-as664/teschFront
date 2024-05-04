import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import routes from "../utils/routes";
import "./Requisitor.css";
import "../Components/Styles/Global.css";
function Requisitor() {
  const msgs = useRef(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [data1, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleEnviarSAP, setVisibleEnviarSAP] = useState(false);
  const [rowDataToCancel, setRowDataToCancel] = useState(null);

  const [rowDataToEnviarSap, setRowDataToEnviarSap] = useState(null);
  let toast;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user")).Token
  const cancelarSolicitud = (rowData) => {
    setRowDataToCancel(rowData);
    setVisible(true); // Esto abre el Dialog
  };

  const handleDialogEnviarSap = async () => {
    const purchaseRequestId = rowDataToEnviarSap.PurchaseRequestId;
    console.log(purchaseRequestId);
    console.log(token)
    
    try {
      const apiUrl = `${routes.BASE_URL_SERVER}/SAPSyncSendSinglePurchaseRequest/${purchaseRequestId}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config); 
      console.log(response);
      fetchData();
          toast.show({
            severity: "success",
            summary: "Notificación",
            detail: "Se envio correctamente la solicitud a SAP",
            life: 2000,
          });
    } catch (error) {

      
    }
   
   
    console.log("handleDialogCancel", rowDataToEnviarSap.PurchaseRequestId);
    setRowDataToEnviarSap(null);
    setVisibleEnviarSAP(false); // Esto cierra el Dialog
  };
  const handleDialogCancel = () => {
    const purchaseRequestId = rowDataToCancel.PurchaseRequestId;

    axios
      .delete(
        `${routes.BASE_URL_SERVER}/DeletePurchaseRequest/${purchaseRequestId}`
      )
      .then((response) => {
        console.log("Solicitud de compra cancelada con éxito");
        fetchData();
        toast.show({
          severity: "success",
          summary: "Notificación",
          detail: "Solicitud de compra cancelada con éxito",
          life: 3000,
        });
        // Realizar cualquier acción adicional después de cancelar la solicitud, como actualizar la lista de solicitudes de compra
      })
      .catch((error) => {
        console.error("Error al cancelar la solicitud de compra:", error);
        // Manejar el error, como mostrar un mensaje al usuario
      });
    console.log("handleDialogCancel", rowDataToCancel.PurchaseRequestId);
    setRowDataToCancel(null);
    setVisible(false); // Esto cierra el Dialog
  };

  const fetchData = async () => {
    try {
      console.clear();
      console.log(user.UserId);
      const IdUsuario = user.UserId;
      const apiUrl = `${routes.BASE_URL_SERVER}/GetPurchaseRequestsHeadersByUser/${IdUsuario}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config);
      console.log(response.data.data.purchaseRequestsHeaders);
      setData(response.data.data.purchaseRequestsHeaders);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };
  useEffect(() => {
    localStorage.removeItem("datosRequisitor");
    fetchData();
  }, []);

  useEffect(() => {}, [fetchData]);

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
    localStorage.setItem("datosRequisitor", JSON.stringify(rowData));

    // Redirigir a la página de detalles
    navigate("./Requisitor/DetalleCompra");
  };
  const enviarSolicitudSap = (rowData) => {
    console.clear();
    console.log(rowData);
    setRowDataToEnviarSap(rowData);
    setVisibleEnviarSAP(true); // Esto abre el Dialog
    // localStorage.setItem("datosRequisitor", JSON.stringify(rowData));
    // navigate("./Requisitor/EnviarSap");
  };
  return (
    <Layout>
      <Card className="card-header">
        <Toast ref={(el) => (toast = el)} />
        <div class="row">
          <div className="p-card-title">Solicitudes</div>
          <div class="gorup-search">
            <div>
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
      <Dialog
        header="Enviar a SAP"
        visible={visibleEnviarSAP}
        style={{ width: "30vw" }}
        onHide={() => setVisibleEnviarSAP(false)}
      >
        {rowDataToEnviarSap && (
          <div className="">
            <div className="p-field-group">
              <div className="row">
                <div className="p-field">
                  <p>Nombre: {user.FirstName}</p>
                </div>
                <div className="p-field">
                  <p>
                    Numero de Solicitud: {rowDataToEnviarSap.PurchaseRequestId}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="p-field">
                  <p>Fecha Requerida: {rowDataToEnviarSap.DocDate}</p>
                </div>
                <div className="p-field">
                  <p>Referencia: {rowDataToEnviarSap.NumAtCard}</p>
                </div>
              </div>
            </div>

            <div class="row">
              <Button
                onClick={handleDialogEnviarSap}
                label="Enviar"
                className="p-button-secondary"
              />
            </div>
          </div>
        )}
      </Dialog>
      <Card className="cardSolicitante">
        <Dialog
          header="Cancelar Solicitud"
          visible={visible}
          style={{ width: "30vw" }}
          onHide={() => setVisible(false)}
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
          <Column sortable field="PurchaseRequestId" header="No." style={{ width: '10%' }}/>
          <Column field="Company" header="Empresa/No.SAP" />
          <Column
            header="Enviar"
            body={(rowData) => (
              <Button
                onClick={() => enviarSolicitudSap(rowData)}
                label="Enviar"
                severity="info"
              />
            )}
          ></Column>
          <Column field="DocDate" header="F.Creación" />

          <Column field="StatusSAP" header="Estatus" />
          <Column field="NumAtCard" header="Referencia" />
          <Column
            body={(rowData) => (
              <div>
              <Button
                onClick={() => cancelarSolicitud(rowData)}
                // label="Cancelar"
                // severity="secondary"
                icon="pi pi-times" rounded severity="danger" aria-label="Cancel"
              />
                            <Button
                onClick={() => redirectToEditar(rowData)}
                // label="Editar"
                // severity="success"
                icon="pi pi-pencil" rounded severity="success" aria-label="Search"
              />
              </div>
            )}
            style={{ width: '10%' }}
          ></Column>
        </DataTable>
      </Card>
    </Layout>
  );
}

export default Requisitor;
