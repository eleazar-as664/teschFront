import React, { useRef, useState, useEffect  } from "react";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import { Layout } from "../../Components/Layout/Layout";

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
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem('comments'));
    if (storedComments) {
      setComments(storedComments);
    }
  }, []);

  const handleInputChange = (event) => {
    setComment(event.target.value);
  }

  const handleSubmit = () => {
    if (comment.trim() !== '') {
      const newComments = [comment, ...comments];
      setComments(newComments);
      localStorage.setItem('comments', JSON.stringify(newComments));
      setComment('');
    }
  }
  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };
  const handleAddNote = () => {
    if (note.trim() !== "") {
      setNotes([...notes, note]);
      setNote("");
    }
  };

  return (
    <Layout>
      <div class="body-ordenConpra">
        <Card title="Detalle de compra" className="cardOrdenCompra">
          <div className="p-grid p-nogutter">
            <div className="p-col">
              <div className="row">
                <div className="p-field">Fecha Requerida: 01/01/2023</div>

                <div className="p-field">Referencia:0110111</div>
              </div>
            </div>
            {/* <div className="p-col">
              <div className="row">
                <div className="p-field">
                  <p>FECHA REQUERIDA: 01/01/2023</p>
                </div>
                <div className="p-field">
                  {" "}
                  <p>
                    COMENTARIOS: Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                  </p>
                </div>
              </div>
            </div> */}
            <div className="p-col">
              <div className="row">
                <div className="p-field">
                  <Button
                    label="PDF"
                    style={{ width: "80px", height: "40px" }}
                  />
                </div>

                <div className="p-field">
                  {" "}
                  <Button
                    label="XML"
                    style={{ width: "80px", height: "40px" }}
                  />
                </div>
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
      </div>
    </Layout>
  );
}

export default DetalleCompra;
