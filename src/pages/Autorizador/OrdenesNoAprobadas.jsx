import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";

import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { FilterService } from "primereact/api";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../Components/Layout/Layout";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { TabMenu } from "primereact/tabmenu";
import { Paginator } from "primereact/paginator";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";


import { Toast } from "primereact/toast";

import { Tag } from "primereact/tag";
// import routes from "../../routes../utils/routes";
import routes from "../../utils/routes";

import "../../Components/Styles/Global.css";
import axios from "axios";
function OrdenesNoAprobadas() {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [activeIndex] = useState(1);

  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [statuses] = useState(["Abierto", "Cerrado", "Cancelado", "Pendiente"]);

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    DocNum: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    concatenatedInfo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    DocDueDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    StatusSAP: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user")).Token;
  const[DocNumToSearch, setDocNumToSearch] = useState("");
  const NUMERO_REGISTROS_POR_PAGINA = 30;
  const [numeroPagina, setNumeroPagina] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [companiesFilter, setCompaniesFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [urlGlobalSearch, setUrlGlobalSearch] = useState("");
  const [globalSearchValue, setGlobalSearchValue] = useState("");
  const [docNumFilterValue, setDocNumFilterValue] = useState("");
  const [companiesFilterSelected, setCompaniesFilterSelected] = useState(null);
  const [statusFilterSelected, setstatusFilterSelected] = useState(null);




const generarNumeroPagina= (incremento,totalRegistros) => {

  const array = {};
  let valorActual = 0;

  for (let i = 1; valorActual < totalRegistros; i++) {
      array[i] = valorActual;
      valorActual += incremento;
  }

  return array;
};

const handlePageChange = (e) => {
  let nuevaPagina = e.page + 1;
  setNumeroPagina(nuevaPagina);
  if(globalSearchValue.length === 0){
    fetchDataPurchaseOrderHeadersPendingApproval(nuevaPagina);
  }else
  {
    fetchSearchData(globalSearchValue,nuevaPagina);
  }
};

const fetchDataFilters = async () => {
  try{
    const IdUsuario = user.UserId;
      const apiUrl = `${routes.BASE_URL_SERVER}/GetPurchaseOrdersFilters/${IdUsuario}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      console.log(apiUrl);
      const response = await axios.get(apiUrl, config);
      let { data: { data: { purchaseFilters } } } = response;
      console.log("Companies filter:", companiesFilter);
      console.log("Status filter:", statusFilter);
      setCompaniesFilter(purchaseFilters.companiesFilter);
      setStatusFilter(purchaseFilters.statusFilter);
  } catch (error) {
    let { response: { data: { detailMessage, message } } } = error;
    toast.current.show({
      severity: "error",
      summary: message,
      detail: detailMessage,
      life: 8000,
    });
    console.error(
      "Error al obtener datos de la API:",
      error.response.data.message
    );
  }
}

  const fetchDataPurchaseOrderHeadersPendingApproval = async (numeroPagina=1) => {
    try {
      console.clear();
      console.log("Cargando datos de la API...");
      const IdUsuario = user.UserId;
      const apiUrl = `${routes.BASE_URL_SERVER}/GetAllPurchaseOrdersPagination/${IdUsuario}/${NUMERO_REGISTROS_POR_PAGINA}/${numeroPagina}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      console.log(apiUrl);
      const response = await axios.get(apiUrl, config);
      console.log("Respuesta de la API:", response);
      setTotalRecords(response.data.data.totalPurchaseOrders);
      // setpurchaseOrderData(response.data.data);
      const updatedData = response.data.data.purchaseOrdersMapped.map((item) => ({
        ...item,
        concatenatedInfo: `${item.BusinessName} - ${item.DocDate}`,
      }));
      console.log(updatedData);
      console.log("Total de registros:", totalRecords);
      setPurchaseOrderData(updatedData);
      const numeroPaginaDinamico = generarNumeroPagina(NUMERO_REGISTROS_POR_PAGINA, response.data.data.totalPurchaseOrders);      
      const numeroPaginasTotales = numeroPaginaDinamico[numeroPagina];
      setNumeroPagina(numeroPaginasTotales)

      // setpurchaseOrderData(response.data.data.purchaseRequestsHeaders);
    } catch (error) {
      let { response: { data: { detailMessage, message } } } = error;
      toast.current.show({
        severity: "error",
        summary: message,
        detail: detailMessage,
        life: 8000,
      });
      console.error(
        "Error al obtener datos de la API:",
        error.response.data.message
      );
    }
  };



  useEffect(() => {
    localStorage.removeItem("purchaseOrderData");
    fetchDataFilters();
    fetchDataPurchaseOrderHeadersPendingApproval();
  }, []);

  const handleRowClick = (event) => {
    console.clear();
    console.log("Clic en la fila", event.data);
    const rowData = event.data;
    localStorage.setItem("purchaseOrderData", JSON.stringify(rowData));

    // Redirigir a la página de detalles
    navigate("/Autorizador/Autorizador/AutorizadorOrdenCompra");
  };



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

  const fetchSearchData = async (dataToSearch,numeroPagina=1) => {
    try{
      console.clear();
      console.log("BUSCANDO DATOS datos de la API...");
      const IdUsuario = user.UserId;
        const apiUrl = `${routes.BASE_URL_SERVER}/SearchPurchaseOrders?UserId=${IdUsuario}&SearchData=${dataToSearch}&MainSearch=true&Limit=${NUMERO_REGISTROS_POR_PAGINA}&Offset=${numeroPagina}`;
        const config = {
          headers: {
            "x-access-token": token,
          },
        };
        console.log(apiUrl);
        const response = await axios.get(apiUrl, config);
        let { data: { data: { purchaseOrdersMapped,totalPurchaseOrders } } } = response;
        console.log("ORDENES ENCONTRADAS:", purchaseOrdersMapped);
        console.log("TOTAL ORDENES ENCONTRADAS:", totalPurchaseOrders);
        console.log("NUMERO DE PAGINA: ", numeroPagina);
        setPurchaseOrderData(purchaseOrdersMapped);
        setTotalRecords(totalPurchaseOrders);
        const numeroPaginaDinamico = generarNumeroPagina(NUMERO_REGISTROS_POR_PAGINA, totalPurchaseOrders);      
        const numeroPaginasTotales = numeroPaginaDinamico[numeroPagina];
      setNumeroPagina(numeroPaginasTotales)
    } catch (error) {
      console.log("Error al buscar datos:", error);
      let { response: { data: { detailMessage, message,code } } } = error;
      if(code === 404){
        setPurchaseOrderData([]);
      }
      toast.current.show({
        severity: "error",
        summary: message,
        detail: detailMessage,
        life: 8000,
      });
      console.error(
        "Error al obtener datos de la API:",
        error.response.data.message
      );
    }
  }

  const onGlobalFilterChange = (e) => {
    console.log("Valor del filtro global:", e.target.value);
    const value = e.target.value;
    setGlobalSearchValue(value);
    if(value.length === 0){
      fetchDataPurchaseOrderHeadersPendingApproval();
    }
    else
    {
      fetchSearchData(value);
    }

    // let _filters = { ...filters };

    // _filters["global"].value = value;

    // setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            className="search-input"
            value={DocNumToSearch}
            onChange={onGlobalFilterChange}
            placeholder="Buscar ..."
          />
        </IconField>
      </div>
    );
  };


  const handleCompanyFilterChange = (e) => {
    setCompaniesFilterSelected(e.value);
    console.log("Valor del filtro de compañia:", companiesFilterSelected);
  }
  
  const rowFilterCompany = (option) => {
    return (
      <div className="flex align-items-center gap-2">
          <span>{option.CompanyName}</span>
      </div>
    );
  }
  const CompanyFilter = () => {
    return (
        <MultiSelect
            value={companiesFilterSelected}
            options={companiesFilter}
            itemTemplate={rowFilterCompany}
            onChange={(e) => setCompaniesFilterSelected(e.value)} 
            optionLabel="CompanyName"
            placeholder="Buscar por compañia"
            className="p-column-filter"
            maxSelectedLabels={1}
            style={{ minWidth: '14rem' }}
        />
    );
};

const rowFilterStatus = (option) => {
  return (
    <div className="flex align-items-center gap-2">
        <span>{option.Status}</span>
    </div>
  );
}
const StatusFilter = () => {
  return (
      <MultiSelect
          value={companiesFilterSelected}
          options={statusFilter}
          itemTemplate={rowFilterStatus}
          onChange={(e) => setstatusFilterSelected(e.value)} 
          optionLabel="Status"
          placeholder="Buscar por Estatus"
          className="p-column-filter"
          maxSelectedLabels={1}
          style={{ minWidth: '14rem' }}
      />
  );
};

  const handleDocNumInputChange = (e) => {
    setDocNumFilterValue(e.value);
    console.log("Valor del filtro DocNum:", docNumFilterValue);
  }


  const DocNumBodyTemplate = () => {
    return (
      <InputNumber placeholder="Buscar Por numero de documento"  onChange={handleDocNumInputChange} />
    )
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

  return (
    <Layout>
      <Card className="card-header">
        <div class="row">
          <div className="p-card-title">Ordenes de compra</div>
        </div>
      </Card>
      <Card title="" className="cardProveedor">
        <Toast ref={toast} />
        <TabMenu model={items} activeIndex={activeIndex} />
        <div className="p-grid p-fluid">
          <DataTable
            value={purchaseOrderData}
            selectionMode="single"
            // selection={selectedItem}
            onRowClick={handleRowClick} // Capturar el clic en la fila
            scrollable
            scrollHeight="400px"
            stripedRows
            tableStyle={{ minWidth: "50rem" }}
            filters={filters}
            filterDisplay="row"
            globalFilterFields={[
              "DocNum",
              "CompanyName",
              "DocDate",
              "StatusSAP",
            ]}
            emptyMessage="No hay resultados"
            header={header}
          >
            <Column
              field="DocNum"
              header="Orden"
              sortable 
              filter
              filterElement={DocNumBodyTemplate} 
              style={{ width: "10%" }}
            ></Column>
            <Column
              field="CompanyName"
              header="Empresa"
              style={{ width: "20%" }}
              filter
              filterElement={CompanyFilter}
              sortable 
            ></Column>
            <Column
              field="DocDate"
              header="Fecha Orden"
              style={{ width: "20%" }}
              sortable 
            ></Column>
            <Column
              field="Requester"
              header="Solicitó"
              style={{ width: "20%" }}
              sortable 
            ></Column>
            <Column
              field="UserAuthorizer"
              header="Autorizador"
              style={{ width: "20%" }}
              sortable 
            ></Column>
            <Column
              field="AuthorizationDate"
              header="Fecha Autorización"
              style={{ width: "20%" }}
              sortable 
            ></Column>
            <Column
              field="ApprovalStatus"
              header="Estatus"
              style={{ width: "20%" }}
              sortable 
              filter
              filterElement={StatusFilter}
              body={(rowData) => {
                switch (rowData.ApprovalStatus) {
                  case "Para Autorizar":
                    return (
                      <div>
                        <i
                          className="pi pi-exclamation-triangle"
                          style={{ color: "orange" }}
                        ></i>
                        {rowData.ApprovalStatus}
                      </div>
                    );
                  case "Abierto":
                    return (
                      <div>
                        <i
                          className="pi pi-lock-open"
                          style={{ color: "purple" }}
                        ></i>
                        {rowData.ApprovalStatus}
                      </div>
                    );
                  case "Cerrado":
                    return (
                      <div>
                        <i
                          className="pi pi-check-circle"
                          style={{ color: "green" }}
                        ></i>
                        {rowData.ApprovalStatus}
                      </div>
                    );
                  case "Cancelado":
                    return (
                      <div>
                        <i
                          className="pi pi-times-circle"
                          style={{ color: "red" }}
                        ></i>
                        {rowData.ApprovalStatus}
                      </div>
                    );
                  default:
                    return rowData.ApprovalStatus;
                }
              }}
            ></Column>
            <Column
              headerStyle={{ width: "5%", minWidth: "5rem" }}
              bodyStyle={{ textAlign: "center" }}
            ></Column>
          </DataTable>
          <Paginator first={numeroPagina}  rows={NUMERO_REGISTROS_POR_PAGINA} totalRecords={totalRecords} onPageChange={handlePageChange}  />
        </div>
      </Card>
    </Layout>
  );
}

export default OrdenesNoAprobadas;
