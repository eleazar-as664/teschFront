import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMountEffect } from "primereact/hooks";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Layout } from "../Components/Layout/Layout";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import axios from "axios";
import routes from "../utils/routes";
import "../Components/Styles/Global.css";
function Administrador() {
  const msgs = useRef(null);

  const [employees, setEmployees] = useState([]);
  const [enviandoASAP, setEnviandoASAP] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleEnviarSAP, setVisibleEnviarSAP] = useState(false);
  const [rowDataToCancel, setRowDataToCancel] = useState(null);
  const [rowDataToEnviarSap, setRowDataToEnviarSap] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [statuses] = useState(["Abierta", "Cerrada"]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    PurchaseRequestId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    Company: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    DocDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    StatusSAP: { value: null, matchMode: FilterMatchMode.EQUALS },
    NumAtCard: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  let toast;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user")).Token;
  const tokenSap = JSON.parse(localStorage.getItem("user")).TokenSAP;

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
  const cancelarSolicitud = (rowData) => {
    setRowDataToCancel(rowData);
    setVisible(true); // Esto abre el Dialog
  };

  const handleDialogEnviarSap = async () => {
    const purchaseRequestId = rowDataToEnviarSap.PurchaseRequestId;

    setEnviandoASAP(true);

    try {
      const data = {
        SAPToken: tokenSap,
        BusinessName: user.CompanyName,
      };

      const apiUrl = `${routes.BASE_URL_SERVER}/SAPSyncSendSinglePurchaseRequest/${purchaseRequestId}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.post(apiUrl, data, config);
      console.log("Response:", response);
    


    } catch (error) {
      console.error("Error al enviar la solicitud a SAP:", error);
    } finally {
      // Indicar que se ha completado el envío a SAP
      setEnviandoASAP(false);
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

  const fetchDataGetEmployees = async () => {
    try {
      console.clear();
      const CompanyId = user.CompanyId;
      const apiUrl = `${routes.BASE_URL_SERVER}/GetEmployees/${CompanyId}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config);
      setEmployees(response.data.data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };
  useEffect(() => {
    localStorage.removeItem("datosRequisitor");
    fetchDataGetEmployees();
  }, []);

  useEffect(() => {}, [fetchDataGetEmployees]);

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

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const renderHeader = () => {
    return (
      <div className="global-filter">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar ..."
          />
        </IconField>
      </div>
    );
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
  const header = renderHeader();

  return (
    <Layout>
      <Card className="card-header">
        <Toast ref={(el) => (toast = el)} />
        <div class="row">
          <div className="p-card-title">Solicitudes</div>
          <div class="gorup-search">
            <div>
              <Link to="./Administrador/NuevoUsuario">
                <Button
                  label="Nueva usuario"
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
              {enviandoASAP ? (
                <Button
                  icon="pi pi-spin pi-spinner"
                  className="p-button-secondary"
                />
              ) : (
                <Button
                  onClick={handleDialogEnviarSap}
                  label="Enviar"
                  className="p-button-secondary"
                />
              )}
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
          value={employees}
          selectionMode="single"
          onRowClick={handleRowClick}
          scrollable
          scrollHeight="400px"
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
          filters={filters}
          filterDisplay="row"
          globalFilterFields={[
            "PurchaseRequestId",
            "Company",
            "DocDate",
            "StatusSAP",
            "NumAtCard",
          ]}
          emptyMessage="No hay solicitudes de compra registradas"
          header={header}
          paginator
          rows={5}
        >
          <Column
            sortable
            field="FirstName"
            header="Nombre de usuario"
            style={{ width: "10%" }}
          />
          <Column
            field="email"
            header="Email"
            style={{ width: "20%" }}
          />
          
          <Column
            field="empresa"
            header="Empresa"
            style={{ width: "20%" }}
          />

          <Column
            field="FirstName"
            header="Empleado"
            showFilterMenu={false}
            filterMenuStyle={{ width: "14rem" }}
            style={{ width: "10%", padding: "8px" }}
           
          />
          <Column field="NumAtCard" header="Referencia" />
          <Column
            style={{ width: "10%" }}
            body={(rowData) =>
              rowData.Sent ? (
                <span></span>
              ) : (
                <div>
                  <Button
                    outlined
                    onClick={() => cancelarSolicitud(rowData)}
                    icon="pi pi-times"
                    rounded
                    severity="danger"
                    aria-label="Cancel"
                  />
                  <Button
                    onClick={() => redirectToEditar(rowData)}
                    icon="pi pi-pencil"
                    rounded
                    severity="success"
                    aria-label="Search"
                  />
                </div>
              )
            }
          ></Column>
        </DataTable>
      </Card>
    </Layout>
  );
}

export default Administrador;
