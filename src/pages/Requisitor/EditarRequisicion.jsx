import React, { useState, useEffect, useCallback } from "react";

import TextInput from "../../Components/Requisitor/TextInput";
import DatesInput from "../../Components/Requisitor/DatesInput";
import TextTareaInput from "../../Components/Requisitor/TextTareaInput";

import MaterialDialog from "../../Components/Requisitor/Materiales";
import { Layout } from "../../Components/Layout/Layout";

import { Card } from "primereact/card";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { Calendar } from 'primereact/calendar';
import moment from "moment";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./NuevaCompra.css";
import routes from "../../utils/routes";

function EditarRequisicion() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fecha: null,
    NumAtCard: "",
    companies: "",
    proveedor: "",
    cantidad: "",
    precio: "",
    Comments: "",
    archivoPDF: null,
  });

  const [formErrors, setFormErrors] = useState({
    fecha: false,
    NumAtCard: false,
    companies: false,
    proveedor: false,
    cantidad: false,
    precio: false,
    Comments: false,
  });
  const [currentDate, setCurrentDate] = useState("");
  const [notas, setNotas] = useState([]);
  const [materialeslData, setMaterialesData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogVisibleNuevaCompra, setDialogVisibleNuevaCompra] =
    useState(false);
  const [notasAgregar, setNotasAgregar] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [contadorId, setContadorId] = useState(1);
  const [materialToEdit, setMaterialToEdit] = useState(null);
  const [files, setFiles] = useState([]);
  const filterMaterials = (event) => {
    const searchTerm = event.query.toLowerCase();
    const filtered = materialeslData.filter((material) =>
      material.Description.toLowerCase().includes(searchTerm)
    );
    setFilteredMaterials(filtered);
  };
  const handleEdit = (rowData) => {
    setMaterialToEdit(rowData);
    setDialogVisible(true);
  };
  const token = JSON.parse(localStorage.getItem("user")).Token;

  const user = JSON.parse(localStorage.getItem("user"));
  const datosRequisitor = JSON.parse(localStorage.getItem("datosRequisitor"));
  let toast;

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
  const handleAlmacenChange12 = (material) => {
    setSelectedMaterial(material);
    setDialogVisible(true); // Mostrar el MaterialDialog al seleccionar un material
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
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
      console.clear();

      console.log("detalesRequisicion:", detalesRequisicion);

      // <Column field="ItemCode" header="Codigo" />
 
      const newSelectedItems = detalesRequisicion.Detail.map((item, index) => ({
        idTeficador: contadorId + index, // Puedes usar el índice como un identificador único si no tienes uno en tus datos
        ItemCode: item.ItemCode,
        Description: item.Description,
        BuyUnitMsr: item.BuyUnitMsr,
        Quantity: item.Quantity,
        IVAName: item.TaxCode,
        ItemId: item.ItemId,
      }));

      const notas = detalesRequisicion.Notes.map((item, index) => ({
        id: index,
        CreateDate: item.CreateDate,
        FirstName: item.FirstName,
        Notes: item.Notes,
        UserName: item.UserName,
        LastName: item.LastName,
      }));
      // const materialConId = { ...newSelectedItems, idTeficador: contadorId };
      setContadorId(contadorId + detalesRequisicion.Detail.length);
      setNotas(notas);
      console.log("materialConId:", newSelectedItems);


      // Actualizar selectedItems con todos los objetos de Detail
      setSelectedItems( newSelectedItems);
      setFormData({
        ...formData,
        Comments: detalesRequisicion.Comments,
        NumAtCard: detalesRequisicion.NumAtCard,
        fecha: moment(detalesRequisicion.DocDueDate).toDate() ,
      });
      // setFormData(response.data.data);
      console.log("formData:", formData);

    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };

  useEffect(() => {
    const today = moment().format("YYYY-MM-DD");
    setCurrentDate(today);
  }, [datosRequisitor.PurchaseRequestId, token, user.UserId]);
  useEffect(() => {
    // Mostrar los archivos pre-cargados cuando la página se carga

    getDatosFiles();
    getDatosCompra();
  }, []);
  const fetchData = async () => {
    try {
      const apiUrl = `${routes.BASE_URL_SERVER}/GetCompaniesForUser/${user.UserId}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config);
      // setCompanies(response.data.data);

      setFormData((prevState) => ({
        ...prevState,
        companies: response.data.data[0],
      }));
      const apiUrlGetItemsByCompany = `${routes.BASE_URL_SERVER}/GetItemsByCompany/${response.data.data[0].Id}`;
      const resp = await axios.get(apiUrlGetItemsByCompany, config);

      setMaterialesData(resp.data.data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [selectedItems]);
  useEffect(() => {}, [getDatosCompra, getDatosFiles, fetchData]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const requestData = buildRequestData();
        const response = await sendFormData(requestData, formData.archivoPDF);
        handleSuccessResponse(response);
      } catch (error) {
        handleErrorResponse(error);
      }
    } else {
      toast.show({
        severity: "warn",
        summary: "Notificación",
        detail: "El formulario tiene que ser completado, para ser enviado",
        life: 3000,
      });
    }
  };

  const buildRequestData = () => {
    const momentDate = moment(formData.fecha);
    const formattedDate = momentDate.format("YYYY-MM-DD");
    const PurchaseOrderRequestDetails = selectedItems.map((obj) => ({
      Description: obj.Description,
      BuyUnitMsr: obj.BuyUnitMsr,
      Quantity: obj.Quantity,
      TaxCodeId: null, //obj.TaxCode,
      ItemId: obj.ItemId,
    }));

    return {
      PurchaseRequestId: datosRequisitor.PurchaseRequestId,
      CreateDate: formattedDate,
      DocDate: formattedDate,
      DocDueDate: formattedDate,
      UserId: user.UserId,
      NumAtCard: formData.NumAtCard,
      Comments: formData.Comments,
      CompanyId: formData.companies.Id,
      PurchaseOrderRequestDetails,
    };
  };
  const sendFormData = async (data) => {
    console.clear();
    console.log("Data:", data);
    console.log("formData:", selectedItems);
    console.log("formDataformData:", formData);
    const config = {
      headers: {
        "x-access-token": token,
      },
    };

    const response = await axios.put(
      `${routes.BASE_URL_SERVER}/UpdatePurchaseRequest`,
      data,
      config
    );
    return response.data;
  };

  const handleSuccessResponse = (response) => {
    console.log("Respuesta del servidor:", response);
    setDialogVisibleNuevaCompra(true);
    // Aquí podrías manejar la respuesta exitosa, por ejemplo, mostrar un mensaje de éxito al usuario
  };

  const handleErrorResponse = (error) => {
    console.error("Error al enviar el formulario:", error);
  };
  const validateForm = () => {
    const errors = {};
    let formIsValid = true;

    // if (!formData.fecha) {
    //   errors.fecha = "La fecha es obligatoria.";
    //   formIsValid = false;
    // }

    // if (!formData.NumAtCard.trim()) {
    //   errors.NumAtCard = "El número de referencia es obligatorio.";
    //   formIsValid = false;
    // }

    if (!formData.companies) {
      errors.companies = "Seleccione una compañía.";
      formIsValid = false;
    }

    setFormErrors(errors);
    return formIsValid;
  };

  const handleGuardarMaterial = (materialModificado) => {
    console.clear();
    console.log("materialModificadssssssssssso", materialModificado);
    const materialConId = { ...materialModificado, idTeficador: contadorId };
    setContadorId(contadorId + 1);
    setSelectedItems([...selectedItems, materialConId]);
  };

  const handleEditarMaterial = (materialModificado) => {
    // Encontrar el índice del material modificado en la lista selectedItems
    console.clear();
    console.log("materialModificadssssssssssso", materialModificado);
    const index = selectedItems.findIndex(
      (item) => item.idTeficador === materialModificado.idTeficador
    );

    if (index !== -1) {
      // Si se encuentra el material en la lista, actualizarlo
      const updatedItems = [...selectedItems];
      updatedItems[index] = materialModificado;
      setSelectedItems(updatedItems);
    } else {
      console.error("No se encontró el material en la lista seleccionada.");
    }

    console.log("Material modificado:", materialModificado);
    console.log("selectedItems:", selectedItems);
  };

  const handleDelete = (rowData) => {
    const updatedItems = selectedItems.filter((item) => item !== rowData);
    setSelectedItems(updatedItems);
  };
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
      };
      console.log("data:", data);
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
        toast.show({
          severity: "success",
          summary: "Notificación",
          detail: "Nota agregada con exito",
          life: 2000,
        });
      } catch (error) {}
      console.log("error:");
      //  setCompanies(response.data.data);
    } else {
      toast.show({
        severity: "warn",
        summary: "Notificación",
        detail: "Debe agregar una nota",
        life: 2000,
      });
    }
  };
  const handleEnviarNavigate = () => {
    setDialogVisibleNuevaCompra(false); // Cierra el modal
    navigate("/Requisitor"); // Navega a la ruta "/Requisitor"
  };
  const handleFileSelect = (event) => {
    const archivoPDF = event.files[0]; // Obtener el primer archivo seleccionado

    toast.show({
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
      const response = sendFormDataFiles(requestData, archivoPDF);
      console.log("Response:", response.data);
    } catch (error) {}
  };
  const sendFormDataFiles = async (data, pdf) => {
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
  const eliminarFiles = (rowData) => {
    axios
      .delete(
        `${routes.BASE_URL_SERVER}/DeleteAttachmentsFromPurchaseRequest/${rowData.AttachId}/${rowData.LineId}`
      )
      .then((response) => {
        getDatosFiles();
        toast.show({
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
  return (
    <Layout>
      <div class="body-ordenCompra">
        <Card className="card-header">
          <div class="row">
            <div className="p-card-title">Editar de Solicitud</div>
          </div>
        </Card>
        <Card className="cardNuevaCompra">
          <Toast ref={(el) => (toast = el)} />

          <form onSubmit={handleSubmit}>
            <div className="p-field-group">
              <div className="row">
                <div className="p-col">
                  <Avatar
                    image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                    className="mr-2"
                    shape="circle"
                  />
                </div>
                <div className="p-col-field">
                  <div className="p-field">
                    <span className="field-name">
                      {user.FirstName + " " + user.LastName}
                    </span>
                  </div>

                  <div className="p-field">
                    <span className="field-name">{user.CompanyName} </span>
                  </div>

                  <div className="p-field">{currentDate}</div>
                </div>
                <div className="p-col-field-right">
                  <div className="row">
                    <div className="p-field">
                 
                      {/* <Calendar
                        value={new Date(formData.CreateDate)}
                        onChange={(e) =>
                          setFormData({ ...formData, fecha: e.value })}
                        dateFormat="dd/mm/yy"
                        placeholder="Seleccione una fecha"
                        className={formErrors.fecha}
                      /> */}
                      <DatesInput
                        value={formData.fecha}
                        onChange={(e) =>
                          setFormData({ ...formData, fecha: e.value })
                        }
                        error={formErrors.fecha}
                      />
                    </div>
                    <div className="p-field">
                      <TextInput
                        id="NumAtCard"
                        label="No. referencia:"
                        value={formData.NumAtCard}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            NumAtCard: e.target.value,
                          })
                        }
                        error={formErrors.NumAtCard}
                      />
                    </div>
                  </div>
                  <div className="p-field">
                    <TextTareaInput
                      id="comentario"
                      label="Comentario:"
                      value={formData.Comments}
                      onChange={(e) =>
                        setFormData({ ...formData, Comments: e.target.value })
                      }
                      rows={1}
                      cols={10}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="p-field" style={{ margin: "20px" }}>
                <AutoComplete
                  value={searchValue}
                  suggestions={filteredMaterials}
                  completeMethod={filterMaterials}
                  field="Description"
                  onChange={(e) => setSearchValue(e.value)}
                  onSelect={(e) => {
                    setSelectedMaterial(e.value);
                    setSearchValue("");
                    handleAlmacenChange12(e.value);
                  }}
                  placeholder="Buscar material..."
                />
              </div>

              <div className="p-field button-conteiner">
                <div className="botonEnviar">
                  <Button
                    label="Guardar"
                    type="submit"
                    icon="pi pi-check"
                    className="p-button-primary"
                  />
                </div>
                <div className="botonCancelar">
                  <Button
                    label="Cancelar"
                    type="button"
                    onClick={handleEnviarNavigate}
                    className="p-button-secondary"
                  />
                </div>
              </div>
            </div>
          </form>
          {selectedMaterial && (
            <MaterialDialog
              visible={dialogVisible}
              material={selectedMaterial}
              onClose={handleDialogClose}
              onSave={handleGuardarMaterial}
            />
          )}
          {materialToEdit && (
            <MaterialDialog
              visible={dialogVisible}
              material={materialToEdit}
              onClose={handleDialogClose}
              onSave={handleEditarMaterial}
            />
          )}
          <Dialog
            visible={dialogVisibleNuevaCompra}
            onHide={handleEnviarNavigate}
            header="Éxito"
            modal
            footer={<Button label="Cerrar" onClick={handleEnviarNavigate} />}
          >
            <div>¡La operación se completó con éxito!</div>
          </Dialog>
          <div className="table-container">
            <DataTable value={selectedItems} scrollHeight="400px">
              <Column field="ItemCode" header="Codigo" />
              <Column field="Description" header="Description" />
              <Column field="BuyUnitMsr" header="Unidad"></Column>
              <Column field="Quantity" header="Cantidad" />
              {/* <Column field="IVAName" header="Impuesto" /> */}
              <Column
                field=""
                header=""
                body={(rowData) => (
                  <div>
                    <Button
                      icon="pi pi-pencil"
                      rounded
                      onClick={() => handleEdit(rowData)}
                      className="p-button-success"
                    />
                    <Button
                      icon="pi pi-trash"
                      onClick={() => handleDelete(rowData)}
                      className="p-button-danger"
                    />
                  </div>
                )}
              />
            </DataTable>
          </div>
        </Card>
        <div className="body-right">
          <Card title="Notas">
            <div className="p-inputgroup">
              <InputText
                value={notasAgregar}
                onChange={handleInputChange}
                placeholder="Escribe un comentario"
              />
              <Button label="Enviar" onClick={handleAddNote} />
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

export default EditarRequisicion;
