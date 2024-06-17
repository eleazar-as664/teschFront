import React, { useRef, useState, useEffect } from "react";

import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Layout } from "../../Components/Layout/Layout";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Avatar } from 'primereact/avatar';
import routes from "../../utils/routes";
import axios from "axios";
function  AutorizadorOrdenCompra() {
  const [files, setFiles] = useState([]);

  let toast = useRef(null);
  const navigate = useNavigate();
  const datosRequisitor = JSON.parse(localStorage.getItem("datosRequisitor"));
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user")).Token;
  const[purchaseOrderData,setPurchaseOrderData] = useState([{}]);
  const[purchaseOrderHeader,setPurchaseOrderHeader] = useState([{}]);
  const[purchaseOrderDetail,setPurchaseOrderDetail] = useState([{}]);
  const[purchaseOrderFiles,setPurchaseOrderFiles] = useState([]);
  const [materialesSolicitados, setMaterialesSolicitados] = useState([]);
  const [notas, setNotas] = useState([]);
  const [primeraLetra, setPrimeraLetra] = useState("");
  const [notasAgregar, setNotasAgregar] = useState("");
  const[autorizando, setAutorizando] = useState(false);
  const[cancelando, setCancelando] = useState(false);
  // Agregar event listener al cambio de archivos
  const getDatosFiles = async () => {
    try {
      const idSolicitud = datosRequisitor.PurchaseRequestId;

      const apiUrl = `${routes.BASE_URL_SERVER}/GetPurchaseRequestFiles/${idSolicitud}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config);

      const detalesRequisicion = response.data.data;

      setFiles(detalesRequisicion);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };
  const getDatosCompra = async () => {
    try {
        console.clear();
        console.log("Cargando datos de la API...");
        const purchaseOrderDataTemp = JSON.parse(localStorage.getItem("purchaseOrderData"));
        console.log("datosRequisitor:", purchaseOrderDataTemp);
        setPurchaseOrderData(purchaseOrderDataTemp);
        let {Id} = purchaseOrderDataTemp;


      const apiUrl = `${routes.BASE_URL_SERVER}/GetPurchaseOrder/${Id}`;
      console.log(apiUrl);
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config);
      console.log(response.data.data);
      response.data.data.purchaseOrderHeader.Requester = purchaseOrderDataTemp.Requester;
        setPrimeraLetra(response.data.data.purchaseOrderHeader.FirstName.charAt(0));
        setPurchaseOrderHeader(response.data.data.purchaseOrderHeader);
        setPurchaseOrderDetail(response.data.data.Detail);
        setPurchaseOrderFiles(response.data.data.Files);

    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };
  useEffect(() => {
    // Mostrar los archivos pre-cargados cuando la página se carga

    getDatosFiles();
    getDatosCompra();
  }, []);

  useEffect(() => {}, [materialesSolicitados,getDatosCompra,getDatosFiles]);


    const handleAprobarOrden = async () => {  
        setAutorizando(true);
        console.log("Aprobar orden de compra")
        const apiUrl = `${routes.BASE_URL_SERVER}/AuthorizePurchaseOrder`;
        const config = {
          headers: {
            "x-access-token": token,
          },
        };

        let data = {
            PurchaseOrderId: purchaseOrderHeader.PurchaseOrderId,
            UserId: user.UserId
        }
        const response = await axios.post(apiUrl, data, config);
        if(response.data.code == 200)
        {
            toast.current.show({severity: 'success', summary: 'Éxito', detail: 'Orden de compra autorizada con éxito', life: 3000});
            setTimeout(() => {
                navigate("/Autorizador");
            }, 1000);
        }
        console.log(response);
        
        
    }

    const handleCancelarOrden = async () => {  
        setCancelando(true);
        console.log("Cancelando orden de compra")
        const apiUrl = `${routes.BASE_URL_SERVER}/CancelPurchaseOrder`;
        const config = {
        headers: {
            "x-access-token": token,
        },
        };

        // PurchaseOrderId,SAPToken,DBName
        let data = {
            SAPToken: user.TokenSAP,
            PurchaseOrderId: purchaseOrderHeader.PurchaseOrderId,
            DocNum: purchaseOrderHeader.DocNum,
            DBName: purchaseOrderHeader.DBName
        }
        const response = await axios.post(apiUrl, data, config);
        if(response.data.code == 200)
        {
            toast.current.show({severity: 'success', summary: 'Éxito', detail: 'Orden de compra autorizada con éxito', life: 3000});
            setTimeout(() => {
                navigate("/Autorizador");
            }, 1000);
        }
        console.log(response);

    }

  return (
    <Layout>
    <div class="body-ordenCompra">
      <Card className="card-header">
        <div class="row"> 
            <div className="p-card-title">Detalle Autorizar</div>
        </div>
      </Card>
        <Toast ref={toast} />
        <Card className="cardOrdenCompra">
          <div className="p-grid p-nogutter">
          <div className="row">
            <div className="p-col">
            <Avatar label={primeraLetra} className="mr-2" shape="circle" />
            </div>
              <div className="p-col-field">
                <div className="p-field">
                  <span className="field-name">{purchaseOrderHeader.Requester}</span>  
                </div>

                <div className="p-field">
                  <span className="field-name">{purchaseOrderHeader.CompanyName}</span>  
                </div>

                <div className="p-field">
                  {purchaseOrderHeader.DocDate}
                </div>
              </div>

              <div className="p-col-field">
                <div className="p-field">
                  <span className="field-name">Fecha de entrega: </span>  
                  {purchaseOrderHeader.DocDueDate}
                </div>

                <div className="p-field">
                   <span className="field-name">Referencia: </span>
                   
                </div>
                <div className="p-field">
                   <span className="field-name">Comentarios: </span>
                   {purchaseOrderHeader.Comments}
                </div>

              </div>
            </div>
          </div>
          {
            purchaseOrderData.ApprovalStatus == "Para Autorizar" ? (
            <div className="p-col-field">
                <div className="row">
                <div className="p-field">
                    {
                        autorizando ?
                        (

                            <Button
                                
                                icon="pi pi-spinner pi-spin"
                                className="p-button-primary "
                                
                                />
                        ) : (
                            <Button
                                label="Autorizar"
                                icon="pi pi-check"
                                className="p-button-primary "
                                onClick={handleAprobarOrden}
                                
                                />
                        )
                    }
                    </div>
                <div className="p-field">
                    {
                        cancelando ?
                        (
                            <Button
                                icon="pi pi-spinner pi-spin"
                                className="p-button-danger"
                                />
                        ) : (
                            <Button
                                label="Cancelar"
                                icon="pi pi-times"
                                className="p-button-danger"
                                onClick={handleCancelarOrden}
                                />
                        )
                    }
                </div>
                </div>

            </div>
            ):( <div></div>)
          }
          <DataTable
            value={purchaseOrderDetail}
            scrollable
            scrollHeight="200px"
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column field="ItemCode" header="Código" />
            <Column field="Description" header="Descripción" />
            <Column field="BuyUnitMsr" header="Unidad" />
            <Column field="Quantity" header="Cantidad" />
            <Column field="PriceByUnit" header="Precio Por Unidad" />
          </DataTable>
        </Card>

        <div className="body-right">
       

        <Card title="Adjuntos" className="adjuntosaa">
          <div className="p-field-group">
            <div className="row align-right">
          
              </div>
              <div className="row">
                <div className="p-col-field">
                <DataTable value={purchaseOrderFiles}>
                  <Column field="FileName" header="Nombre" />
                  <Column
                    header="Acción"
                    body={(rowData) => (
                      <a
                        href={rowData.SRC}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver
                      </a>
                    )}
                  />
                </DataTable>
                </div>
              </div>
          </div>
        </Card>
        </div>
      </div>
    </Layout>
  );
}

export default AutorizadorOrdenCompra;
