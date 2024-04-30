import React, { useRef, useState, useEffect } from "react";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Layout } from "../../Components/Layout/Layout";
import { Toast } from "primereact/toast";
import axios from "axios";
function DetalleCompra() {
  const data = [
    {
      ID_Solicitud: 10,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
    {
      ID_Solicitud: 20,
      No_Requisicion_SAP: "DEF456",
      Fecha_Hora_Creacion: "2024-03-19 11:45:00",
      Fecha_Vencimiento: "2024-04-12",
      No_referencia: "REF002",
      Centro_de_costo: "CC002",
      Empresa: "Empresa B",
      Comentarios: "Comentario 2",
      No_OC_SAP: "OC456",
      Sincronizado: false,
      Adjunto1: "",
      Adjunto2: "",
      Notas_autorizacion: "Notas de autorización 2",
      Notas_requisitor: "Notas del requisitor 2",
    },
    {
      ID_Solicitud: 30,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
    {
      ID_Solicitud: 40,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
    {
      ID_Solicitud: 50,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
    {
      ID_Solicitud: 60,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
  ];
  const dataq = [
    {
      ID_Solicitud: 10,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
    {
      ID_Solicitud: 20,
      No_Requisicion_SAP: "DEF456",
      Fecha_Hora_Creacion: "2024-03-19 11:45:00",
      Fecha_Vencimiento: "2024-04-12",
      No_referencia: "REF002",
      Centro_de_costo: "CC002",
      Empresa: "Empresa B",
      Comentarios: "Comentario 2",
      No_OC_SAP: "OC456",
      Sincronizado: false,
      Adjunto1: "",
      Adjunto2: "",
      Notas_autorizacion: "Notas de autorización 2",
      Notas_requisitor: "Notas del requisitor 2",
    },
    {
      ID_Solicitud: 30,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
    {
      ID_Solicitud: 40,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
    {
      ID_Solicitud: 50,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
    {
      ID_Solicitud: 60,
      No_Requisicion_SAP: "ABC123",
      Fecha_Hora_Creacion: "2024-03-18 10:30:00",
      Fecha_Vencimiento: "2024-04-10",
      No_referencia: "REF001",
      Centro_de_costo: "CC001",
      Empresa: "Empresa A",
      Comentarios: "Comentario 1",
      No_OC_SAP: "OC123",
      Sincronizado: true,
      Adjunto1: "Archivo1.pdf",
      Adjunto2: "Archivo2.pdf",
      Notas_autorizacion: "Notas de autorización 1",
      Notas_requisitor: "Notas del requisitor 1",
    },
  ];
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  const [rowDataToCancel, setRowDataToCancel] = useState(null);
  const toast = useRef(null);
  const datosRequisitor = JSON.parse(localStorage.getItem("datosRequisitor"));
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user")).Token;

  // Simular archivos pre-cargados
  const archivosPreCargados = [
    {
      fileExtension: "pdf",
      fileName: "Articulos (29).pdf",
      src: "http://localhost:3000/api/v1/Attachments/PurchaseOrder-13/Articulos (29).pdf",
    },
    {
      fileExtension: "pdf",
      fileName: "Articulos (29).pdf",
      src: "http://localhost:3000/api/v1/Attachments/PurchaseOrder-11/TeshWebV5.jpg",
      //C:\Users\eleazar.sanchez\Pictures\TestFile\PurchaseOrder-11\TeshWebV5.jpg
    },
    // Agrega más archivos aquí si los tienes
  ];
  // Agregar event listener al cambio de archivos
  const getDatosFiles = async () => {
    try {
      const idSolicitud = datosRequisitor.PurchaseRequestId;

      const apiUrl = `http://localhost:3000/api/v1/GetPurchaseRequestFiles/${idSolicitud}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config);

      console.log(
        "Response:getDatosCompraaaaaaaaaaaaaaaaaaaaaaaa",
        response.data.data
      );
      const detalesRequisicion = response.data.data;

      console.log("*****************************", detalesRequisicion);
      setFiles(detalesRequisicion);
      // <Column field="ItemCode" header="Codigo" />
    //   const newSelectedItems = detalesRequisicion.Detail.map(
    //     (item, index) => ({
    //       id: index, // Puedes usar el índice como un identificador único si no tienes uno en tus datos
    //       ItemCode: item.ItemCode,
    //       Description: item.Description,
    //       BuyUnitMsr: item.BuyUnitMsr,
    //       Quantity: item.Quantity,
    //       IVAName: item.TaxCode,
    //     })
    //   );

    //   console.log("**********************************", newSelectedItems);

    //   // Actualizar selectedItems con todos los objetos de Detail
    //   setSelectedItems(newSelectedItems);
    //   setFormData({
    //     ...formData,
    //     Comments: detalesRequisicion.Comments,
    //     NumAtCard: detalesRequisicion.NumAtCard,
    //     fecha: detalesRequisicion.CreateDate,
    //   });
    //   setFormData(response.data.data);

    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };
  useEffect(() => {
    // Mostrar los archivos pre-cargados cuando la página se carga
    getDatosFiles();
    
  }, []);

  const uploadFiles = () => {
    // Aquí puedes agregar la lógica para subir los archivos al servidor
    // Por simplicidad, aquí solo mostramos los nombres de los archivos
    console.log("Archivos seleccionados:");
  }; 

  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem("comments"));
    if (storedComments) {
      setComments(storedComments);
    }
  }, []);

  const handleInputChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = () => {
    if (comment.trim() !== "") {
      const newComments = [comment, ...comments];
      setComments(newComments);
      localStorage.setItem("comments", JSON.stringify(newComments));
      setComment("");
    }
  };
  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };
  const handleAddNote = () => {
    if (note.trim() !== "") {
      setNotes([...notes, note]);
      setNote("");
    }
  };
  const cancelarSolicitud = (rowData) => {
    // setRowDataToCancel(rowData);
    // setVisible(true); // Esto abre el Dialog
  };
  const handleFileSelect = (event) => {
    const archivoPDF = event.files[0]; // Obtener el primer archivo seleccionado
    toast.current.show({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
      });
    console.log("Archivo seleccionado:", archivoPDF);
    try {
                const requestData = {
                    PurchaseRequestId: datosRequisitor.PurchaseRequestId,
                    UserId: user.UserId,
                }
                const response =  sendFormData(requestData, archivoPDF);
                handleSuccessResponse(response);
              } catch (error) {
                handleErrorResponse(error);
              }
    
  };


  const sendFormData = async (data, pdf) => {
    const formData = new FormData();

    // Agregar los datos al FormData
    formData.append("data", JSON.stringify(data));

    // Agregar el documento al FormData
    formData.append("FilesToUpload", pdf);

    // Configurar los encabezados
    const config = {
      headers: {
        "x-access-token": token,
        "Content-Type": "multipart/form-data",
      },
    };
    // if(data.PurchaseOrderRequestDetails.length === 0){
    //   toast.show({
    //     severity: "warn",
    //     summary: "Notificación",
    //     detail: "El formulario tiene que ser completado, para ser enviado",
    //     life: 3000,
    //   });
     
    // }
    console.log("Data:", data);
    console.log("FilesToUpload:", pdf);

    console.log("Data:", data);
    console.log("FilesToUpload:", pdf);
    const response = await axios.post(
      "http://localhost:3000/api/v1/AddAttachmentsToPurchaseRequest",
      formData,
      config
    );
    return response.data;
  };

  const handleSuccessResponse = (response) => {
    console.log("Respuesta del servidor:", response);
    // Aquí podrías manejar la respuesta exitosa, por ejemplo, mostrar un mensaje de éxito al usuario
  };

  const handleErrorResponse = (error) => {
    console.error("Error al enviar el formulario:", error);
  };
  return (
    <Layout>
      <div class="body-ordenConpra">
      <Toast ref={toast}></Toast>
        <Card title="Detalle de compra" className="cardOrdenCompra">
          <div className="p-grid p-nogutter">
            <div className="p-col">
              <div className="row">
                <div className="p-field">Fecha Requerida: 01/01/2023</div>

                <div className="p-field">Referencia:0110111</div>
              </div>
            </div>
          </div>
          <DataTable
            value={dataq}
            scrollable
            scrollHeight="200px"
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column field="No_Requisicion_SAP" header="Código" />
            <Column field="Fecha_Hora_Creacion" header="Descripción" />
            <Column field="Fecha_Vencimiento" header="Unidad" />
            <Column field="Centro_de_costo" header="Cantidad" />
          </DataTable>
        </Card>

        <Card title="Notas" className="adjuntos">
          <div className="p-inputgroup">
            <InputText
              value={comment}
              onChange={handleInputChange}
              placeholder="Escribe un comentario"
            />
            <Button label="Enviar" onClick={handleSubmit} />
          </div>
          <div>
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                {comment}
              </div>
            ))}
          </div>
        </Card>
        <Card title="Adjuntos" className="adjuntosaa">
          <div className="p-inputgroup">
            <div className="card">
              <div>
                {/* <input
                  type="file"
                  onChange={(e) =>
                    setFiles([
                      ...files,
                      ...Array.from(e.target.files).map((file) => file.name),
                    ])
                  }
                  multiple
                />
                <button onClick={uploadFiles}>Subir Archivosssssss</button> */}
             

             
                <FileUpload
                  mode="basic"
                  name="demo[]"
                  multiple
                  accept="image/*,.pdf"
                  maxFileSize={1000000}
                  onSelect={handleFileSelect}
                  auto
                  chooseLabel="Agregar"
                />
                {/* {displayFiles(files)} */}
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
                    header="Cancelar"
                    body={(rowData) => (
                      <Button
                        onClick={() => cancelarSolicitud(rowData)}
                        label="Cancelar"
                        severity="danger"
                      />
                    )}
                  ></Column>
                </DataTable>
              </div>
            </div>
          </div>
          <div>
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                |{comment}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default DetalleCompra;
