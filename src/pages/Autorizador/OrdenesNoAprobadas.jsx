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
let companiesId = [];
let requestersId = [];
let authorizersId = [];
let statusId = [];
let docNumFilterValue = 0;
let globalSearchValue = "";

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
  const [requestersFilter, setRequestersFilter] = useState([]);
  const [authorizersFilter, setAuthorizersFilter] = useState([]);
  const [urlGlobalSearch, setUrlGlobalSearch] = useState("");
  // const [globalSearchValue, setGlobalSearchValue] = useState("");
  // const [docNumFilterValue, setDocNumFilterValue] = useState("");
  const [companiesFilterSelected, setCompaniesFilterSelected] = useState(null);
  const [statusFilterSelected, setstatusFilterSelected] = useState(null);
  const [requesterFilterSelected, setRequesterFilterSelected] = useState(null);
  const [authorizerFilterSelected, setAuthorizerFilterSelected] = useState(null);


  // const[companiesId, setCompaniesId] = useState([]);
  // const[requestersId, setRequestersId] = useState([]);
  // const[authorizersId, setAuthorizersId] = useState([]);
  // const[statusId, setStatusId] = useState([]);







const generarNumeroPagina= (incremento,totalRegistros) => {

  const array = {};
  let valorActual = 0;

  for (let i = 1; valorActual < totalRegistros; i++) {
      array[i] = valorActual;
      valorActual += incremento;
  }
  // console.log("NUMERO DE PAGINAS:", array);
  return array;
};

const handlePageChange = async (e) => {
  let nuevaPagina = e.page + 1;
  setNumeroPagina(nuevaPagina);
  if(urlGlobalSearch.length === 0){
    fetchDataPurchaseOrderHeadersPendingApproval(nuevaPagina);
  }else
  {
    await fetchSearchData(globalSearchValue,nuevaPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId);
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
      console.log("Companies filter:", purchaseFilters.companiesFilter);
      console.log("Status filter:", purchaseFilters.statusFilter);
      console.log("Autorizador filter:", purchaseFilters.authorizersFilter);
      console.log("Solicitante filter:", purchaseFilters.requestersFilter);
      setRequestersFilter(purchaseFilters.requestersFilter);
      setAuthorizersFilter(purchaseFilters.authorizersFilter);
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
      console.log("Cargando datos de la API...");
      const IdUsuario = user.UserId;
      const apiUrl = `${routes.BASE_URL_SERVER}/GetAllPurchaseOrdersPagination/${IdUsuario}/${NUMERO_REGISTROS_POR_PAGINA}/${numeroPagina}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      console.log(apiUrl);
      setUrlGlobalSearch(apiUrl);
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

  const fetchSearchData = async (globalSearchValue,numeroPagina=1,docNum=0,companies=[],requesters=[],authorizers=[],status=[]) => {
    try{
      console.log("BUSCANDO DATOS datos de la API POR MEDIO DE FILTROS...");
      console.log(`DATA TO SEARCH: ${globalSearchValue}`);
      console.log(`NUMERO DE DOCUMENTO: ${docNum}`);
      console.log(`COMPANIES: ${companies}`);
      console.log(`REQUESTERS: ${requesters}`);
      console.log(`AUTHORIZERS: ${authorizers}`);
      console.log(`STATUS: ${status}`);

      let urlFilters = "";

      
      if(globalSearchValue.length !== 0){
        urlFilters += `&SearchData=${globalSearchValue}&MainSearch=true`;
      }
      else
      {
        urlFilters += `&MainSearch=false`;
      }
      
      if(docNum != "" || docNum != 0){
        urlFilters += `&DocNum=${docNum}`;
      }
      if(companies.length > 0){
        urlFilters += `&Companies=${companies.join(",")}`;
      }

      if(requesters.length > 0){
        urlFilters += `&Requesters=${requesters.join(",")}`;
      }

      if(authorizers.length > 0){
        urlFilters += `&Authorizers=${authorizers.join(",")}`;
      }

      if(status.length > 0){
        urlFilters += `&Status=${status.join(",")}`;
      }


      
        let IdUsuario = user.UserId;
        let apiUrl = `${routes.BASE_URL_SERVER}/SearchPurchaseOrders?UserId=${IdUsuario}${urlFilters}&Limit=${NUMERO_REGISTROS_POR_PAGINA}&Offset=${numeroPagina}`;
        let config = {
          headers: {
            "x-access-token": token,
          },
        };
        console.log(apiUrl);
        let response = await axios.get(apiUrl, config);
        let { data: { data: { purchaseOrdersMapped,totalPurchaseOrders } } } = response;
        console.log("TOTAL DE ORDENES ENCONTRADAS:", totalPurchaseOrders);  
        // console.log("ORDENES ENCONTRADAS:", purchaseOrdersMapped);
        // console.log("TOTAL ORDENES ENCONTRADAS:", totalPurchaseOrders);
        // console.log("NUMERO DE PAGINA: ", numeroPagina);


        if(numeroPagina === 0){
          numeroPagina = 1;
        }
        console.log("NUMERO DE PAGINA: ", numeroPagina);
        setPurchaseOrderData(purchaseOrdersMapped);
        setTotalRecords(totalPurchaseOrders);
        let numeroPaginaDinamico = generarNumeroPagina(NUMERO_REGISTROS_POR_PAGINA, totalPurchaseOrders);      
        let numeroPaginasTotales = numeroPaginaDinamico[numeroPagina];
        console.log("NUMERO DE PAGINASTOTALES:", numeroPaginasTotales);
        setNumeroPagina(numeroPaginasTotales)
    } catch (error) {
      // console.log("Error al buscar datos:", error);
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
    // console.log("Valor del filtro global:", e.target.value);
    if(globalSearchValue.length === 0){
      companiesId = [];
      requestersId = [];
      authorizersId = [];
      statusId = [];
      docNumFilterValue = 0;
      setCompaniesFilterSelected(null);
      setRequesterFilterSelected(null);
      setAuthorizerFilterSelected(null);
      setstatusFilterSelected(null);
    }
    const value = e.target.value;
    globalSearchValue = value;
    // setGlobalSearchValue(value);
    if(value.length === 0){
      companiesId = [];
      requestersId = [];
      authorizersId = [];
      statusId = [];
      docNumFilterValue = 0;
      setCompaniesFilterSelected(null);
      setRequesterFilterSelected(null);
      setAuthorizerFilterSelected(null);
      setstatusFilterSelected(null);
      fetchDataPurchaseOrderHeadersPendingApproval();
    }
    else
    {
      fetchSearchData(value,numeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId);
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
            value={globalSearchValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar ..."
          />
        </IconField>
      </div>
    );
  };


const handleCompanyFilterChange = async (e) => {
  // console.log(`COMPANIA SELECCIONADA: ${e.value.length}`);
  if(e.value.length > 0)
  {
    // console.log(`ASIGNANDO COMPANIAS: ${Array.isArray(companiesId)}`);
    companiesId = e.value.map(item => item.CompanyId);
  }
  else
  {
    console.log("Limpiando compañias");
    companiesId = [];
  }
  
  // console.log(`COMPANIAS ASIGNADAS: ${companiesId}`);
  // console.log(`REQUESTERS SELECCIONADOS: ${requestersId}`);
  await fetchSearchData(globalSearchValue,numeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId);
  setCompaniesFilterSelected(e.value);

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
          onChange={handleCompanyFilterChange} 
          optionLabel="CompanyName"
          placeholder="Buscar por compañia"
          className="p-column-filter"
          maxSelectedLabels={1}
          style={{ minWidth: '14rem' }}
      />
  );
};

const handleRequesterFilterChange = (e) => {

  // console.log("Solicitante seleccionado:", e.value);
  setRequesterFilterSelected(e.value);
  if(e.value.length > 0){
    // console.log("Solicitante seleccionado:", e.value);
    requestersId = e.value.map(item => item.RequesterId);
    // setRequestersId(requestersId);
  }
  else
  {
    // console.log("Limpiando solicitantes");
    requestersId = [];
  }
  
  fetchSearchData(globalSearchValue,numeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId);
  
}

const rowFilterRequester = (option) => {
  return (
    <div className="flex align-items-center gap-2">
        <span>{option.Requester}</span>
    </div>
  );
}

const RequesterFilter = () => {
  return (
      <MultiSelect
          value={requesterFilterSelected}
          options={requestersFilter}
          itemTemplate={rowFilterRequester}
          onChange={handleRequesterFilterChange} 
          optionLabel="Requester"
          placeholder="Buscar por Solicitante"
          className="p-column-filter"
          maxSelectedLabels={1}
          style={{ minWidth: '14rem' }}
      />
  );
};


const handleStatusFilterChange = (e) => {
  setstatusFilterSelected(e.value);

  if(e.value.length > 0){
    statusId = e.value.map(item => item.StatusId);
  }
  else
  {
    statusId = [];
  }
  fetchSearchData(globalSearchValue,numeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId);
  
}

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
          value={statusFilterSelected}
          options={statusFilter}
          itemTemplate={rowFilterStatus}
          onChange={handleStatusFilterChange} 
          optionLabel="Status"
          placeholder="Buscar por Estatus"
          className="p-column-filter"
          maxSelectedLabels={1}
          style={{ minWidth: '14rem' }}
      />
  );
};


const handleAuthorizerFilterChange = (e) => {
  setAuthorizerFilterSelected(e.value);

  if(e.value.length > 0){
    authorizersId = e.value.map(item => item.AuthorizerId);
  }
  else
  {
    authorizersId = [];
  }
  fetchSearchData(globalSearchValue,numeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId);
}

const rowFilterAuthorizer = (option) => {
  return (
    <div className="flex align-items-center gap-2">
        <span>{option.Authorizer}</span>
    </div>
  );
}

const AuthorizerFilter = () => {
  return (
      <MultiSelect
          value={authorizerFilterSelected}
          options={authorizersFilter}
          itemTemplate={rowFilterAuthorizer}
          onChange={handleAuthorizerFilterChange} 
          optionLabel="Authorizer"
          placeholder="Buscar por Autorizador"
          className="p-column-filter"
          maxSelectedLabels={1}
          style={{ minWidth: '14rem' }}
      />
  );
};

  const handleDocNumInputChange = (e) => {
    // setDocNumFilterValue(e.value);
    if(e.value === null){
      e.value = 0;
    } 
    docNumFilterValue = e.value;
    fetchSearchData(globalSearchValue,numeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId);
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
              filter
              filterElement={RequesterFilter}
              style={{ width: "20%" }}
              sortable 
            ></Column>
            <Column
              field="UserAuthorizer"
              header="Autorizador"
              filter
              filterElement={AuthorizerFilter}
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
