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
import { Calendar } from 'primereact/calendar';
        


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
let fechaOrdenInicio = "";
let fechaOrdenFin = "";
let fechaAutorizacionInicio = "";
let fechaAutorizacionFin = "";
let globalSearchValue = "";
let globalNumeroPagina = 1;
// let orderByGlobal = "";
// let orderDirectionGlobal = "";

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
  // const [numeroPagina, setNumeroPagina] = useState(1);
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
  const [fechasOrdenes, setFechasOrdenes] = useState(null);
  const [fechaAutorizacion, setFechaAutorizacion] = useState(null);
//   let orderByGlobal = "";
// let orderDirectionGlobal = "";
  const[orderByGlobal, setOrderByGlobal] = useState("");
  const[orderDirectionGlobal, setOrderDirectionGlobal] = useState("");

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
  globalNumeroPagina = e.page + 1;
  // setNumeroPagina(numeroPagina);
  if(urlGlobalSearch.length === 0){
    fetchDataPurchaseOrderHeadersPendingApproval(globalNumeroPagina);
  }else
  {
    await fetchSearchData(globalSearchValue,globalNumeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId,fechaOrdenInicio,fechaOrdenFin,fechaAutorizacionInicio,fechaAutorizacionFin,orderByGlobal,orderDirectionGlobal);
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
      console.log("Cargando datos de la API... fetchDataPurchaseOrderHeadersPendingApproval");
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
      // setNumeroPagina(numeroPaginasTotales)
      globalNumeroPagina = numeroPaginasTotales;

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

  const fetchSearchData = async (globalSearchValue,numeroPagina=1,docNum=0,companies=[],requesters=[],authorizers=[],status=[],fechaOrdenInicioSeleccionado="",fechaOrdenFinSeleccionado="",fechaAutorizacionInicioSeleccionado="",fechaAutorizacionFinSeleccionado="",orderBy="",orderDirection="") => {
    try{
      console.log("BUSCANDO DATOS datos de la API POR MEDIO DE FILTROS...");
      console.log(`DATA TO SEARCH: ${globalSearchValue}`);
      console.log(`NUMERO DE DOCUMENTO: ${docNum}`);
      console.log(`COMPANIES: ${companies}`);
      console.log(`REQUESTERS: ${requesters}`);
      console.log(`AUTHORIZERS: ${authorizers}`);
      console.log(`STATUS: ${status}`);
      console.log(`FECHA INICIO: ${fechaOrdenInicioSeleccionado}`);
      console.log(`FECHA FIN: ${fechaOrdenFinSeleccionado}`);
      console.log(`FECHA AUTORIZACION INICIO: ${fechaAutorizacionInicioSeleccionado}`);
      console.log(`FECHA AUTORIZACION FIN: ${fechaAutorizacionFinSeleccionado}`);

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
      console.log("FECHA INICIO:", fechaOrdenInicioSeleccionado);
      console.log("FECHA FIN:", fechaOrdenFinSeleccionado);
      if(fechaOrdenInicioSeleccionado != "")
      {
        urlFilters += `&DocDateStart=${fechaOrdenInicioSeleccionado}`;
      }

      if(fechaOrdenFinSeleccionado != "")
      {
        urlFilters += `&DocDateEnd=${fechaOrdenFinSeleccionado}`;
      }

      if(fechaAutorizacionInicioSeleccionado != "")
      {
        urlFilters += `&AuthorizationDateStart=${fechaAutorizacionInicioSeleccionado}`;
      }

      if(fechaAutorizacionFinSeleccionado != "")
      {
        urlFilters += `&AuthorizationDateEnd=${fechaAutorizacionFinSeleccionado}`;
      }

      if(orderBy != "" && orderDirection != ""){
        urlFilters += `&OrderBy=${orderBy}&OrderDirection=${orderDirection}`;
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
        console.log("ORDENES ENCONTRADAS:", purchaseOrderData);
        let numeroPaginaDinamico = generarNumeroPagina(NUMERO_REGISTROS_POR_PAGINA, totalPurchaseOrders);      
        console.log("NUMERO DE PAGINA DINAMICO:", numeroPaginaDinamico);
        let numeroPaginasTotales = numeroPaginaDinamico[numeroPagina];
        console.log("NUMERO DE PAGINASTOTALES:", numeroPaginasTotales);
        globalNumeroPagina = numeroPaginasTotales;
        // setNumeroPagina(numeroPaginasTotales)
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
      setFechasOrdenes(null);
      setFechaAutorizacion(null);
      globalNumeroPagina = 1
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
      setFechasOrdenes(null);
      setFechaAutorizacion(null);
      fetchDataPurchaseOrderHeadersPendingApproval();
      globalNumeroPagina = 1
    }
    else
    {
      globalNumeroPagina = 1;
      fetchSearchData(value,globalNumeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId,fechaOrdenInicio,fechaOrdenFin,fechaAutorizacionInicio,fechaAutorizacionFin,orderByGlobal,orderDirectionGlobal);
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
  globalNumeroPagina = 1;
  await fetchSearchData(globalSearchValue,globalNumeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId,fechaOrdenInicio,fechaOrdenFin,fechaAutorizacionInicio,fechaAutorizacionFin,orderByGlobal,orderDirectionGlobal);
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
          // style={{ minWidth: '14rem' }}
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
  globalNumeroPagina = 1;
  fetchSearchData(globalSearchValue,globalNumeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId,fechaOrdenInicio,fechaOrdenFin,fechaAutorizacionInicio,fechaAutorizacionFin,orderByGlobal,orderDirectionGlobal);
  
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
          // style={{ minWidth: '14rem' }}
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
  globalNumeroPagina = 1;
  fetchSearchData(globalSearchValue,globalNumeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId,fechaOrdenInicio,fechaOrdenFin,fechaAutorizacionInicio,fechaAutorizacionFin,orderByGlobal,orderDirectionGlobal);
  
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
          // style={{ minWidth: '14rem' }}
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
  globalNumeroPagina = 1;
  fetchSearchData(globalSearchValue,globalNumeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId,fechaOrdenInicio,fechaOrdenFin,fechaAutorizacionInicio,fechaAutorizacionFin,orderByGlobal,orderDirectionGlobal);
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
          // style={{ minWidth: '14rem' }}
      />
  );
};

  const handleDocNumInputChange = (e) => {
    // setDocNumFilterValue(e.value);
    if(e.value === null){
      e.value = 0;
    } 
    docNumFilterValue = e.value;
    globalNumeroPagina = 1;
    fetchSearchData(globalSearchValue,globalNumeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId,fechaOrdenInicio,fechaOrdenFin,fechaAutorizacionInicio,fechaAutorizacionFin,orderByGlobal,orderDirectionGlobal);
  }


  const DocNumBodyTemplate = () => {
    return (
      <InputNumber placeholder="Buscar Por numero de documento"  onChange={handleDocNumInputChange} />
    )
  };

  // const handleFechaInicioChange = (e) => {
  //   console.log("Fecha inicio:", e.value);
  //   fechaOrdenInicio = e.value;
  // }

  const handleChangeFechaOrden = (e) => {
    console.log("Fechas Ordenes:", e.value);
    setFechasOrdenes(e.value);
  }

  useEffect(() => {
    if(fechasOrdenes !== null){
      for(let i = 0; i < fechasOrdenes.length; i++)
      {
        if(fechasOrdenes[i] !== null){
          if(i === 0){
            fechaOrdenInicio = fechasOrdenes[i].toISOString();
          }
          else
          {
            fechaOrdenFin = fechasOrdenes[i].toISOString();
          }
        }
      }
      console.log("Fecha inicio:", fechaOrdenInicio);
      console.log("Fecha fin:", fechaOrdenFin);
      globalNumeroPagina = 1;
      if(fechaOrdenInicio !== "" && fechaOrdenFin !== "")
      {
        fetchSearchData(globalSearchValue,globalNumeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId,fechaOrdenInicio,fechaOrdenFin,fechaAutorizacionInicio,fechaAutorizacionFin,orderByGlobal,orderDirectionGlobal);
      }
      // console.log("fechasOrdenes:", fechasOrdenes[0].getDate());
    }
    console.log("fechasOrdenes actualizadas:", fechasOrdenes);
  }, [fechasOrdenes]);

  const handleDeleteFechaOrden = () => {
    setFechasOrdenes(null);
    fechaOrdenInicio = "";
    fechaOrdenFin = "";
    globalNumeroPagina = 1;
    fetchSearchData(globalSearchValue,globalNumeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId,fechaOrdenInicio,fechaOrdenFin,fechaAutorizacionInicio,fechaAutorizacionFin,orderByGlobal,orderDirectionGlobal);
  }
  
  const FechaOrdenFilter = () => {
    return (
      <div className="p-inputgroup flex-1">
        <Calendar placeholder="Fecha Inicial - Fecha Final" value={fechasOrdenes} onChange={handleChangeFechaOrden} selectionMode="range" readOnlyInput hideOnRangeSelection />
        <Button icon="pi pi-times" className="p-button-danger" onClick={handleDeleteFechaOrden} style={{ maxWidth: '2rem' }}/>
    </div>
    );
  };

  useEffect(() => {
    if(fechaAutorizacion !== null){
      for(let i = 0; i < fechaAutorizacion.length; i++)
      {
        if(fechaAutorizacion[i] !== null){
          if(i === 0){
            fechaAutorizacionInicio = fechaAutorizacion[i].toISOString();
          }
          else
          {
            fechaAutorizacionFin = fechaAutorizacion[i].toISOString();
          }
        }
      }
      console.log("Fecha Autorizacion inicio:", fechaAutorizacionInicio);
      console.log("Fecha Autorizacion fin:", fechaAutorizacionFin);
      globalNumeroPagina = 1;
      if(fechaAutorizacionInicio !== "" && fechaAutorizacionFin !== "")
      {
        fetchSearchData(globalSearchValue,globalNumeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId,fechaOrdenInicio,fechaOrdenFin,fechaAutorizacionInicio,fechaAutorizacionFin,orderByGlobal,orderDirectionGlobal);
      }
      // console.log("fechasOrdenes:", fechasOrdenes[0].getDate());
    }
    console.log("fechasOrdenes actualizadas:", fechaAutorizacion);
  }, [fechaAutorizacion]);

  const handleChangeFechaAutorizacion = (e) => {
    console.log("Fechas Ordenes:", e.value);
    setFechaAutorizacion(e.value);
  }


  const handleDeleteFechaAutorizacion = () => {
    setFechaAutorizacion(null);
    fechaAutorizacionInicio = "";
    fechaAutorizacionFin = "";
    globalNumeroPagina = 1;
    fetchSearchData(globalSearchValue,globalNumeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId,fechaOrdenInicio,fechaOrdenFin,fechaAutorizacionInicio,fechaAutorizacionFin,orderByGlobal,orderDirectionGlobal);
  }

  const FechaAutorizacionFilter = () => {
    return (
      <div className="p-inputgroup flex-1">
        <Calendar placeholder="Fecha Inicial - Fecha Final" value={fechaAutorizacion} onChange={handleChangeFechaAutorizacion} selectionMode="range" readOnlyInput hideOnRangeSelection />
        <Button icon="pi pi-times" className="p-button-danger" onClick={handleDeleteFechaAutorizacion} style={{ maxWidth: '2rem' }}/>
    </div>
    );
  };

  const headerDesign = () => {
    return (
      <div className="flex justify-content-between">
        <div className="flex align-items-center gap-2">
          <span className="p-float-label">
            <label htmlFor="docNum">Número de documento</label>
          </span>
        </div>
      </div>
    );
  };


  useEffect(() => {
    console.log(`ORDENANDO Y BUSCANDO DATOS`);
    fetchSearchData(globalSearchValue,globalNumeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId,fechaOrdenInicio,fechaOrdenFin,fechaAutorizacionInicio,fechaAutorizacionFin,orderByGlobal,orderDirectionGlobal,orderByGlobal,orderDirectionGlobal);
    // setPurchaseOrderData(purchaseOrderData);
  },[orderByGlobal,orderDirectionGlobal]);
  
  // const handleSort = async (e) => {
  //   console.log("Ordenando por:", orderByGlobal);
  //   console.log("Direccion de orden:", orderDirectionGlobal);
  //   // // globalNumeroPagina = 1;
  //   // setOrderByGlobal(e.field);
  //   // setOrderDirectionGlobal(e.order === 1 ? "ASC" : "DESC");
  //   await fetchSearchData(globalSearchValue,globalNumeroPagina,docNumFilterValue,companiesId,requestersId,authorizersId,statusId,fechaOrdenInicio,fechaOrdenFin,fechaAutorizacionInicio,fechaAutorizacionFin,e.field,e.order === 1 ? "ASC" : "DESC");
  //   // orderByGlobal = e.field;
  //   // orderDirectionGlobal = e.order === 1 ? "ASC" : "DESC";
  // }
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
            // tableStyle={{ minWidth: "50rem" }}
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
              style={{ width: "5%" }}
            ></Column>
            <Column
              field="CompanyName"
              header="Empresa"
              style={{ width: "10%" }}
              filter
              filterElement={CompanyFilter}
              sortable 
            ></Column>
            <Column
              field="DocDate"
              header="Fecha Orden"
              style={{ width: "30%" }}
              filter
              filterElement={FechaOrdenFilter}
              sortable 
            ></Column>
            <Column
              field="Requester"
              header="Solicitó"
              filter
              filterElement={RequesterFilter}
              style={{ width: "10%" }}
              sortable 
            ></Column>
            <Column
              field="UserAuthorizer"
              header="Autorizador"
              filter
              filterElement={AuthorizerFilter}
              style={{ width: "10%" }}
              sortable 
            ></Column>
            <Column
              field="AuthorizationDate"
              header="Fecha Autorización"
              style={{ width: "30%" }}
              filter
              filterElement={FechaAutorizacionFilter}
              sortable 
            ></Column>
            <Column
              field="ApprovalStatus"
              header="Estatus"
              style={{ width: "5%" }}
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
          </DataTable>
          <Paginator first={globalNumeroPagina}  rows={NUMERO_REGISTROS_POR_PAGINA} totalRecords={totalRecords} onPageChange={handlePageChange}  />
        </div>
      </Card>
    </Layout>
  );
}

export default OrdenesNoAprobadas;
