import React, { useRef, useState, useEffect } from "react";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Layout } from "../../Components/Layout/Layout";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Avatar } from "primereact/avatar";
import routes from "../../utils/routes";
import axios from "axios";
function DetalleCompra() {
  const [files, setFiles] = useState([]);

  const toast = useRef(null);

  const datosRequisitor = JSON.parse(localStorage.getItem("datosRequisitor"));
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user")).Token;
  const [materialesSolicitados, setMaterialesSolicitados] = useState([]);
  const [notas, setNotas] = useState([]);
  const [notasAgregar, setNotasAgregar] = useState("");
  const [infoUsuarioCreadorSolicitud, setInfoUsuarioCreadorSolicitud] =
    useState([]);
  const [primeraLetra, setPrimeraLetra] = useState("");
  const [enviandoNota, setEnviandoNota] = useState(false);

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
      const idSolicitud = datosRequisitor.PurchaseRequestId;

      const apiUrl = `${routes.BASE_URL_SERVER}/GetSinglePurchaseRequest/${idSolicitud}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config);

      const detalesRequisicion = response.data.data;

      setInfoUsuarioCreadorSolicitud(detalesRequisicion);
      setPrimeraLetra(detalesRequisicion.FirstName.charAt(0));

      console.clear();
      console.log("detalesRequisicion:", detalesRequisicion);

      const newSelectedItems = detalesRequisicion.Detail.map((item, index) => ({
        id: index,
        ItemCode: item.ItemCode,
        Description: item.Description,
        BuyUnitMsr: item.BuyUnitMsr,
        Quantity: item.Quantity,
        IVAName: item.TaxCode,
      }));
      const notas = detalesRequisicion.Notes.map((item, index) => ({
        id: index,
        CreateDate: item.CreateDate,
        FirstName: item.FirstName,
        Notes: item.Notes,
        UserName: item.UserName,
        LastName: item.LastName,
      }));

      setNotas(notas);

      setMaterialesSolicitados(newSelectedItems);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };
  useEffect(() => {
    // Mostrar los archivos pre-cargados cuando la página se carga

    getDatosFiles();
    getDatosCompra();
  }, []);

  useEffect(() => {}, [materialesSolicitados, getDatosCompra, getDatosFiles]);

  const handleInputChange = (e) => {
    setNotasAgregar(e.target.value);
  };

  const handleAddNote = async () => {
    console.clear();
    console.log("notas:", notasAgregar);
    if (notasAgregar) {
      const data = {
        PurchaseRequestId: datosRequisitor.PurchaseRequestId,
        UserId: user.UserId,
        Notes: notasAgregar,
        SAPTOKEN: user.TokenSAP,

      };
      console.log("data:", data);
      setEnviandoNota(true);
      try {
        const apiUrl = `${routes.BASE_URL_SERVER}/CreatePurchaseRequestNote`;
        const config = {
          headers: {
            "x-access-token": token,
          },
        };
        const response = await axios.post(apiUrl, data, config);
        getDatosCompra();

        console.log("Response:", response.data.data);
        toast.current.show({
          severity: "success",
          summary: "Notificación",
          detail: "Nota agregada con exito",
          life: 2000,
        });
      } catch (error) {
        console.error("Error al agregar la nota:", error);

        toast.current.show({
          severity: "error",
          summary: "Notificación",
          detail: "Error al agregar la nota",
          life: 2000,
        });
      } finally {
        setNotasAgregar("");
        setEnviandoNota(false);
      }
    } else {
      toast.current.show({
        severity: "warn",
        summary: "Notificación",
        detail: "Debe agregar una nota",
        life: 2000,
      });
    }
  };
  const eliminarFiles = (rowData) => {
    axios
      .delete(
        `${routes.BASE_URL_SERVER}/DeleteAttachmentsFromPurchaseRequest/${rowData.AttachId}/${rowData.LineId}`
      )
      .then((response) => {
        getDatosFiles();
        toast.current.show({
          severity: "warn",
          summary: "Notificación",
          detail: "Archivo eliminado con exito",
          life: 3000,
        });
        console.log("Response:", response.data.data);
      })
      .catch((error) => {
        console.error("Error al cancelar la solicitud de compra:", error);
        // Manejar el error, como mostrar un mensaje al usuario
      });
  };
  const handleFileSelect = (event) => {
    const archivoPDF = event.files[0]; // Obtener el primer archivo seleccionado

    toast.current.show({
      severity: "success",
      summary: "Notificación",
      detail: "archivo agregado con exito",
      life: 2000,
    });
    console.log("Archivo seleccionado:", archivoPDF);
    try {
      const requestData = {
        PurchaseRequestId: datosRequisitor.PurchaseRequestId,
        UserId: user.UserId,
      };
      const response = sendFormData(requestData, archivoPDF);
      handleSuccessResponse(response);
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const sendFormData = async (data, pdf) => {
    const formData = new FormData();

    formData.append("data", JSON.stringify(data));

    formData.append("FilesToUpload", pdf);

    // Configurar los encabezados
    const config = {
      headers: {
        "x-access-token": token,
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios.post(
      `${routes.BASE_URL_SERVER}/AddAttachmentsToPurchaseRequest`,
      formData,
      config
    );
    getDatosFiles();
    return response.data;
  };

  const handleSuccessResponse = (response) => {
    console.log("Respuesta del servidor:", response);
    // Aquí podrías manejar la respuesta exitosa, por ejemplo, mostrar un mensaje de éxito al usuario
  };

  const handleErrorResponse = (error) => {
    console.error("Error al enviar el formulario:", error);
  };
  // const primeraLetra = infoUsuarioCreadorSolicitud.FirstName.charAt(0);

  return (
    <Layout>
      <div class="body-ordenCompra">
        <Card className="card-header">
          <div class="row">
            <div className="p-card-title">Detalle de Solicitud</div>
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
                  <span className="field-name">
                    {infoUsuarioCreadorSolicitud.FirstName +
                      " " +
                      infoUsuarioCreadorSolicitud.LastName}{" "}
                  </span>
                </div>

                <div className="p-field">
                  <span className="field-name">
                    {infoUsuarioCreadorSolicitud.BusinessName}{" "}
                  </span>
                </div>

                <div className="p-field">
                  {infoUsuarioCreadorSolicitud.CreateDate}
                </div>
              </div>

              <div className="p-col-field">
                <div className="p-field">
                  <span className="field-name">Fecha de entrega: </span>
                  {infoUsuarioCreadorSolicitud.DocDate}
                </div>

                <div className="p-field">
                  <span className="field-name">Referencia: </span>
                  {infoUsuarioCreadorSolicitud.NumAtCard}
                </div>
                <div className="p-field">
                  <span className="field-name">Comentarios: </span>
                  {infoUsuarioCreadorSolicitud.Comments}
                </div>
              </div>
            </div>
          </div>
          <DataTable
            value={materialesSolicitados}
            scrollable
            scrollHeight="200px"
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column field="ItemCode" header="Código" />
            <Column field="Description" header="Descripción" />
            <Column field="BuyUnitMsr" header="Unidad" />
            <Column field="Quantity" header="Cantidad" />
          </DataTable>
        </Card>

        <div className="body-right">
          <Card title="Notas">
            <div className="p-inputgroup">
              <InputText
                value={notasAgregar}
                onChange={handleInputChange}
                placeholder="Escribe un comentario"
              />

              {enviandoNota ? (
                <Button icon="pi pi-spin pi-spinner" />
              ) : (
                <Button label="Enviar" onClick={handleAddNote} />
              )}
            </div>
            <div>
              <div className="note-list">
                {notas.map((nota, index) => (
                  <div key={index}>
                    <Divider align="center">
                      {`Nota ${index + 1}: ${nota.FirstName} ${nota.LastName}`}
                    </Divider>
                    <p>Código: {nota.Code}</p>
                    <p>
                      Fecha de Creación:{" "}
                      {new Date(nota.CreateDate).toLocaleDateString()}
                    </p>
                    <p>Notas: {nota.Notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Adjuntos" className="adjuntosaa">
            <div className="p-field-group">
              <div className="row align-right">
                {files.length < 2 && (
                  <FileUpload
                    mode="basic"
                    name="demo[]"
                    multiple
                    accept="image/*,.pdf"
                    maxFileSize={1000000}
                    onSelect={handleFileSelect}
                    auto
                    chooseLabel="Agregar"
                    className="upload-field-detail"
                  />
                )}
              </div>
              <div className="row">
                <div className="p-col-field">
                  <DataTable value={files}>
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
                    <Column
                      header=""
                      body={(rowData) => (
                        <Button
                          outlined
                          onClick={() => eliminarFiles(rowData)}
                          icon="pi pi-times"
                          rounded
                          severity="danger"
                          aria-label="Cancel"
                        />
                      )}
                    ></Column>
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

export default DetalleCompra;
