import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";

import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Layout } from "../Components/Layout/Layout";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { TabMenu } from "primereact/tabmenu";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";

import { Tag } from "primereact/tag";
import routes from "../utils/routes";

// import "../Proveedor.css";
import axios from "axios";
function Autorizador() {

  const hideDialog = (id) => {
    setShowModal({ ...showModal, [id]: false });
  };


  const toast = useRef(null);

  const formatCurrency = (value) => {
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD' 
    }).format(value);

    return formattedValue;
  };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.TotalWithoutTaxes);
  };

    const priceBodyTemplateU = (Details) => {
    return formatCurrency(Details.PriceByUnit);
  };

  const navigate = useNavigate();
  const [activeIndex] = useState(0);

  const [statuses] = useState(["Abierto", "Cerrado", "Cancelado", "Pendiente"]);

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [showModal, setShowModal] = useState({});
  const [rejectReason, setRejectReason] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    DocNum: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    BusinessPartnerCardName: {
      value: null,
      matchMode: FilterMatchMode.STARTS_WITH,
    },
    DocDueDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    BusinessPartnerCardCode: { value: null, matchMode: FilterMatchMode.EQUALS },
    CompanyName: { value: null, matchMode: FilterMatchMode.EQUALS },
    TotalWithoutTaxes: { value: null, matchMode: FilterMatchMode.EQUALS },
    Comments: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user")).Token;

  const [expandedRows, setExpandedRows] = useState(null);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [rejectedProducts, setRejectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [enviandoASAP, setEnviandoASAP] = useState(false);
  const [error, setError] = useState(false);
  const fetchDataGetPurchaseOrdersPendingApproval = async () => {
    try {
      console.clear();
      console.log("Cargando datos de la API...");
      const IdUsuario = user.UserId;
      const apiUrl = `${routes.BASE_URL_SERVER}/GetPurchaseOrdersPendingApproval/${IdUsuario}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      console.log(apiUrl);
      const response = await axios.get(apiUrl, config);
       const data = response.data.data;
    ;
      console.log(data);

      setProducts(data);
      console.log(data);
    } catch (error) {
      console.error(
        "Error al obtener datos de la API:",
        error.response.data.message
      );
    }
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-grid p-dir-col">
        <div className="p-col-12">
          <h5>Articulos de {data.DocNum}</h5>
          <DataTable value={data.Details}>
            <Column field="Id" header="Id"></Column>
            <Column
              field="PurchaseOrderId"
              header="Codigo del articulo"
            ></Column>
            <Column field="ItemDescription" header="Descrpcion"></Column>
            <Column field="ItemBuyUnitMsr" header="Unidad"></Column>
            <Column field="ItemQuantity" header="Cantidad"></Column>
            <Column field="PriceByUnit" body={priceBodyTemplateU} header="Precio Por Unidad"></Column>
            <Column field="ItemOcrCode" header="Centro de Costo"></Column>
          </DataTable>
        </div>
      </div>
    );
  };

  useEffect(() => {
    localStorage.removeItem("purchaseOrderData");
    const authorizedIds = products
      .filter((product) => product.ApprovalStatus === "Autorizar")
      .map((product) => product.Id);
    // const rejectedIds = products
    //   .filter((product) => product.ApprovalStatus === "Rechazar")
    //   .map((product) => product.Id);

    const rejectedProducts = products
      .filter((product) => product.ApprovalStatus === "Rechazar")
      .map((product) => ({
        PurchaseOrderId: product.Id,
        Reason: product.RejectReason,
      }));
    setApprovedProducts(authorizedIds);
    setRejectedProducts(rejectedProducts);
  }, [products]);

  useEffect(() => {
    fetchDataGetPurchaseOrdersPendingApproval();
  }, []);

  // Función para obtener el estado de la orden
  const getSeverity = (status) => {
    switch (status) {
      case "Cerrado":
        return "danger";

      case "Abierto":
        return "success";
      case "Pendiente":
        return "warning";

      case "Cancelado":
        return "danger";

      default:
        return null;
    }
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

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            className="search-input"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar ..."
          />
        </IconField>
      </div>
    );
  };

  const header = renderHeader();

  const items = [
    {
      label: "Por aprobar",
      icon: "pi pi-check",
      command: () => {
        navigate("/Autorizador");
      },
    },
    {
      label: "Todas",
      icon: "pi pi-file-edit",
      command: () => {
        navigate("/Autorizador/Autorizador/OrdenesNoAprobadas");
      },
    },
  ];

  const approvalStatusTemplate = (rowData) => {
    const statuses = ["Pendiente", "Autorizar", "Rechazar"];

    // const handleRadioChange = (e) => {
    //   const updatedProducts = products.map((product) =>
    //     product.Id === rowData.Id
    //       ? { ...product, ApprovalStatus: e.value }
    //       : product
    //   );
    //   setProducts(updatedProducts);
    // };
    const handleRadioChange = (rowData, e) => {
      const { value } = e.target;
    
      if (value === "Rechazar") {
        setShowModal({ ...showModal, [rowData.Id]: true });
      } else {
        setShowModal({ ...showModal, [rowData.Id]: false });
    
        const updatedProducts = products.map((product) =>
          product.Id === rowData.Id ? { ...product, ApprovalStatus: value } : product
        );
        setProducts(updatedProducts);
      }
    };

    const handleReject = () => {
      if (rejectReason.trim() !== "") {
        // Validación de comentario no vacío
        const updatedProducts = products.map((product) =>
          product.Id === rowData.Id
            ? {
                ...product,
                ApprovalStatus: "Rechazar",
                RejectReason: rejectReason,
              }
            : product
        );
        setProducts(updatedProducts);
        resetModal();
      } else {
        setError(true); // Mostrar error si el comentario está vacío
      }
    };

    const resetModal = () => {
      setShowModal({ });
      setRejectReason("");
      setError(false);
    };

    return (
      <>
        <div>
          {statuses.map((status) => (
            <div key={status} className="p-field-radiobutton">
              <RadioButton
                inputId={status + rowData.Id}
                name={"status" + rowData.Id}
                value={status}
                //  onChange={handleRadioChange}
                onChange={(e) => handleRadioChange(rowData, e)}
                checked={rowData.ApprovalStatus === status}
                // checked={rowData.ApprovalStatus === status}
                // checked={rowData.ApprovalStatus === status || (status === "Rechazar" && showModal)}
              />
              <label htmlFor={status + rowData.Id}>{status}</label>
            </div>
          ))}
        </div>

        <Dialog
        visible={showModal[rowData.Id] || false}
        onHide={() => hideDialog(rowData.Id)}
        header="Motivo de Rechazo"
        modal
        footer={
          <div class="row">
            <Button
              label="Aceptar"
              icon="pi pi-check"
              onClick={handleReject}
                 className="p-button-primary forty-percent"
            />
            <Button
            label="Cancelar"
            onClick={() => hideDialog(rowData.Id)}
            className="p-button-secondary forty-percent"
          />
          </div>
        }
        closable={false}
      >
        <div className="p-grid p-fluid">
          <div className="p-col-12">
            <label htmlFor="rejectReason">Motivo de rechazo:</label>
            <InputText
              id="rejectReason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Motivo de rechazo"
              className={error ? "p-invalid" : ""}
            />
            {error && (
              <small className="p-error">
                Debe ingresar un motivo de rechazo
              </small>
            )}
          </div>
        </div>
      </Dialog>
      </>
    );
  };

  const statusTemplate = (rowData) => {
    return <span>{rowData.ApprovalStatus}</span>;
  };
  const enviarAutorizaciones = async () => {
    console.clear();
    setEnviandoASAP(true);
    try {
      const data = {
        Authorized: approvedProducts,
        Rejected: rejectedProducts,
        UserId: user.UserId,
        SAPToken: user.TokenSAP,
      };

      console.log("data:", data);

      const apiUrl = `${routes.BASE_URL_SERVER}/MassivePurchaseOrderAuthorization`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.post(apiUrl, data, config);
      console.log("Response:", response);
      toast.current.show({
        severity: "success",
        summary: "Notificación",
        detail: "Se envio correctamente la auditorizaciones a SAP",
        life: 4000,
      });
      fetchDataGetPurchaseOrdersPendingApproval();
    } catch (error) {
      console.error("Error al enviar en auditorizaciones a SAP:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al enviar la solicitud a SAP",
        life: 1000,
      });
    } finally {
      setEnviandoASAP(false);
    }
  };
  return (
    <Layout>
      <Card className="card-header">
        <Toast ref={toast} />
        <div class="row">
          <div className="p-card-title">Ordenes de compra</div>
          <div class="gorup-search">
            <div>
              {enviandoASAP ? (
                <Button
                  icon="pi pi-spin pi-spinner"
                  className="botonInsertarRequisitor"
                  severity="primary"
                />
              ) : (
                <Button
                  label="Enviar autorizaciones"
                  severity="primary"
                  raised
                  icon="pi pi-plus-circle"
                  iconPos="left"
                  onClick={enviarAutorizaciones}
                  className="botonInsertarRequisitor"
                />
              )}
            </div>
          </div>
        </div>
      </Card>
      <Card title="" className="cardProveedor">
        <TabMenu model={items} activeIndex={activeIndex} />
        <div className="p-grid p-fluid">
          <DataTable
            value={products}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="Id"
            scrollable
            scrollHeight="400px"
            filters={filters}
            filterDisplay="row"
            globalFilterFields={[
              "DocNum",
              "BusinessPartnerCardName",
              "DocDueDate",
              "BusinessPartnerCardCode",
              "CompanyName",
              "TotalWithoutTaxes",
              "Comments",
            ]}
            emptyMessage="No hay resultados"
            header={header}
            stripedRows
            tableStyle={{ minWidth: "50rem" }}
            paginator
            rows={5}
          >
            <Column expander style={{ width: "3em" }} />
            <Column field="DocNum" header="Orden"></Column>
            <Column field="BusinessPartnerCardName" header="Proveedor"></Column>
            <Column field="DocDueDate" header="Fecha de orden"></Column>
            <Column field="OcrCode" header="Centro Costo"></Column>
            <Column field="CompanyName" header="Empresa"></Column>
            <Column field="TotalWithoutTaxes" body={priceBodyTemplate} header="Importe antes de IVA"></Column>
            <Column field="Comments" header="Comentarios"></Column>
            <Column header="Estatus" body={statusTemplate}></Column>
            <Column
              header="Autorizacion"
              body={approvalStatusTemplate}
            ></Column>
          </DataTable>
        </div>
      </Card>
    </Layout>
  );
}

export default Autorizador;
