import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMountEffect } from "primereact/hooks";
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
import { Toast } from "primereact/toast";
import axios from "axios";
import routes from "../utils/routes";
import "../Components/Styles/Global.css";
function Administrador() {
  const msgs = useRef(null);

  const [employees, setEmployees] = useState([]);
  const [enviandoASAP, setEnviandoASAP] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleActiveUser, setVisibleActiveUser] = useState(false);
  const [visibleEnviarSAP, setVisibleEnviarSAP] = useState(false);
  const [rowDataToCancel, setRowDataToCancel] = useState(null);
  const [rowDataToEnviarSap, setRowDataToEnviarSap] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    UserName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    UserEmail: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    CompanyName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    UserEmployeeName: { value: null, matchMode: FilterMatchMode.EQUALS },
    UserProfileName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const toast = useRef(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user")).Token;
  const tokenSap = JSON.parse(localStorage.getItem("user")).TokenSAP;

  const desactivarUsuario = (rowData) => {
    let {UserActive} = rowData;
    console.log("rowData", rowData);
    console.log(UserActive);
    setRowDataToCancel(rowData);
    if(UserActive === "Activo")
    {
      setVisible(true); // Esto abre el Dialog
    }
    else
    {
      setVisibleActiveUser(true);
    }
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
    const purchaseRequestId = rowDataToCancel.UserId;

    axios
      .patch(`${routes.BASE_URL_SERVER}/DeactivateUser/${purchaseRequestId}`)
      .then((response) => {
        console.log("Solicitud de compra cancelada con éxito");
        toast.current.show({
          severity: "success",
          summary: "Notificación",
          detail: "El usuario ha sido desactivado con exito",
          life: 3000,
        });
        // navigate("/Administrador");
        fetchDataGetEmployees()
        // Realizar cualquier acción adicional después de cancelar la solicitud, como actualizar la lista de solicitudes de compra
      })
      .catch((error) => {
        console.error("Error al cancelar la solicitud de compra:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error al desactivar el usuario",
          life: 3000,
        });
        // Manejar el error, como mostrar un mensaje al usuario
      });
    setRowDataToCancel(null);
    setVisible(false); // Esto cierra el Dialog
    setVisibleActiveUser(false); // Esto cierra el Dialog
  };

  const fetchDataGetEmployees = async () => {
    try {
      console.clear();

      const apiUrl = `${routes.BASE_URL_SERVER}/GetUsers`;
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
    localStorage.removeItem("empleadosEditar");
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
    localStorage.setItem("empleadosEditar", JSON.stringify(rowData));
    navigate("/Administrador/Administrador/EditarUsuarios");
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

  const header = renderHeader();

  return (
    <Layout>
      <Card className="card-header">
        <Toast ref={toast} />

        <div class="row">
          <div className="p-card-title">Nuevo Usuario</div>
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
          header="Desactivar usuario"
          visible={visible}
          style={{ width: "30vw" }}
          onHide={() => setVisible(false)}
        >
          {rowDataToCancel && (
            <div>
              <p>¿Estás seguro que deseas descativar el usuario?</p>
              <p> {rowDataToCancel.UserName}</p>
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

        <Dialog
          header="Activar usuario"
          visible={visibleActiveUser}
          style={{ width: "30vw" }}
          onHide={() => setVisibleActiveUser(false)}
        >
          {rowDataToCancel && (
            <div>
              <p>¿Estás seguro que deseas activar el usuario?</p>
              <p> {rowDataToCancel.UserName}</p>
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
          scrollable
          scrollHeight="400px"
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
          filters={filters}
          filterDisplay="row"
          globalFilterFields={[
            "UserName",
            "UserEmail",
            "CompanyName",
            "UserEmployeeName",
            "UserProfileName",
          ]}
          header={header}
          emptyMessage="No hay empleados registrados"

          paginator
          rows={5}
        >
          <Column
            sortable
            field="UserName"
            header="Nombre de usuario"
            style={{ width: "10%" }}
          />
          <Column field="UserEmail" header="Email" style={{ width: "20%" }} />

          <Column
            field="CompanyName"
            header="Empresa"
            style={{ width: "20%" }}
          />

          <Column
            field="UserEmployeeName"
            header="Empleado"
            showFilterMenu={false}
            filterMenuStyle={{ width: "14rem" }}
            style={{ width: "10%", padding: "8px" }}
          />
          <Column field="UserProfileName" header="Perfil" />
          <Column field="UserActive" header="Estatus" />

          <Column
            style={{ width: "10%" }}
            className="column-action"
            body={(rowData) =>
              rowData.Sent ? (
                <span></span>
              ) : (
                <div>
                  <Button
                    outlined
                    onClick={() => desactivarUsuario(rowData)}
                    icon={rowData.UserActive === "Activo" ? "pi pi-times" : "pi pi-check"}
                    rounded
                    severity={rowData.UserActive === "Activo" ? "danger" : ""}
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
