import React, { useState, useEffect } from "react";

import TextInput from "../../Components/Requisitor/TextInput";
import DatesInput from "../../Components/Requisitor/DatesInput";
import TextTareaInput from "../../Components/Requisitor/TextTareaInput";
import DropdownInput from "../../Components/Requisitor/DropdownInput";
import MaterialDialog from "../../Components/Requisitor/Materiales";
import { Layout } from "../../Components/Layout/Layout";

import { Card } from "primereact/card";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./NuevaCompra.css";

function NuevaCompra() {
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

  const [companies, setCompanies] = useState([]);
  const [materialeslData, setMaterialesData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogVisibleNuevaCompra, setDialogVisibleNuevaCompra] =
    useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [contadorId, setContadorId] = useState(1);
  const [materialToEdit, setMaterialToEdit] = useState(null);
  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);
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
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJ1YmVuLkciLCJpYXQiOjE3MTMwNTYxOTYsImV4cCI6MTcxMzA3MDU5Nn0.pUaTtKZz4sJEn9LzvGgkUl3MDeEpKNlKNuQbzDsMv_4"';
  const user = JSON.parse(localStorage.getItem("user"));
  let toast;
  const handleAlmacenChange12 = (material) => {
    setSelectedMaterial(material);
    setDialogVisible(true); // Mostrar el MaterialDialog al seleccionar un material
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `http://localhost:3000/api/v1/GetCompaniesForUser/${user.UserId}`;
        const config = {
          headers: {
            "x-access-token": token,
          },
        };
        const response = await axios.get(apiUrl, config);
        setCompanies(response.data.data);

        setFormData((prevState) => ({
          ...prevState,
          companies: response.data.data[0],
        }));
        const apiUrlGetItemsByCompany = `http://localhost:3000/api/v1/GetItemsByCompany/${response.data.data[0].Id}`;
        const resp = await axios.get(apiUrlGetItemsByCompany, config);
        setMaterialesData(resp.data.data);
      } catch (error) {
        console.error("Error al obtener datos de la API:", error);
      }
    };

    fetchData();
  }, [user.UserId]); // El array vacío indica que este efecto se ejecuta solo una vez, equivalente a componentDidMount

  const handleAlmacenChange = async (e) => {
    const selectedAlmacen = e.target.value;
    setFormData({ ...formData, almacen: selectedAlmacen });

    try {
      const apiUrl = `http://localhost:3000/api/v1/GetItemsByCompany/${selectedAlmacen.Id}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config);
      setMaterialesData(response.data.data);
    } catch (error) {
      console.error("Error al obtener datos adicionales:", error);
    }
  };

  //   event.preventDefault();
  //   if (validateForm()) {
  //     try {

  //       const momentDate = moment(formData.fecha);
  //       // Formatear la nueva fecha
  //       const formattedDate = momentDate.format("YYYY-MM-DD");
  //       const PurchaseOrderRequestDetails = selectedItems.map((obj) => {
  //         return {
  //           Description: obj.Description,
  //           BuyUnitMsr: obj.BuyUnitMsr,
  //           Quantity: obj.Quantity,
  //           TaxCodeId: obj.TaxCode,
  //           ItemId: obj.Id,
  //           PurchaseRequestId: 0,
  //         };
  //       });
  //       console.log(PurchaseOrderRequestDetails);
  //       const data = {
  //         CreateDate: formattedDate,
  //         DocDate: formattedDate,
  //         UserId: user.UserId,
  //         NumAtCard: formData.NumAtCard,
  //         Comments: formData.Comments,
  //         CompanyId: formData.companies.Id,
  //         PurchaseOrderRequestDetails: PurchaseOrderRequestDetails,
  //       };

  //       // const response = await axios.post("http://endpoint", data);

  //       // console.log("Respuesta del servidor:", response.data);
  //     } catch (error) {
  //       console.error("Error al enviar el formulario:", error);
  //     }
  //   } else {
  //     // console.log("Datos inválidos, no se puede enviar el formulario.");
  //   }
  // };
  const handleFileChange = (event) => {
    const archivoPDF = event.target.files[0]; // Obtener el primer archivo seleccionado
    setFormData((prevFormData) => ({
      ...prevFormData,
      archivoPDF: archivoPDF,
    }));
    console.log("Archivo seleccionado:", archivoPDF);
    console.log("FormData actualizado:", formData);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const requestData = buildRequestData();
        const response = await sendFormData(requestData, archivosSeleccionados);
        handleSuccessResponse(response);
      } catch (error) {
        handleErrorResponse(error);
      }
    } else {
      console.log("El formulario contiene errores y no puede ser enviado.");
      console.log("*******************formData***************************");
      console.log(formData);
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
      TaxCodeId: obj.TaxCode,
      ItemId: obj.Id,
      PurchaseRequestId: 0,
    }));

    return {
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
  const sendFormData = async (data, pdfFiles) => {
    const formData = new FormData();

    // Agregar los datos al FormData
    formData.append("data", JSON.stringify(data));
    if (Array.isArray(pdfFiles) && pdfFiles.length > 0) {
      // Agregar los archivos al FormData
      pdfFiles.forEach((archivo, index) => {
        // Cambiado pdf a archivo
        formData.append(`FilesToUpload[${index}]`, archivo); // Cambiado pdf a archivo
      });
    }

    const config = {
      headers: {
        "x-access-token": token,
        "Content-Type": "multipart/form-data",
      },
    };
    if (data.PurchaseOrderRequestDetails.length === 0) {
      toast.show({
        severity: "warn",
        summary: "Notificación",
        detail: "El formulario tiene que ser completado, para ser enviado",
        life: 3000,
      });
    }

    const response = await axios.post(
      "http://localhost:3000/api/v1/CreatePurchaseRequest",
      formData,
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

    if (!formData.fecha) {
      errors.fecha = "La fecha es obligatoria.";
      formIsValid = false;
    }

    if (!formData.NumAtCard.trim()) {
      errors.NumAtCard = "El número de referencia es obligatorio.";
      formIsValid = false;
    }

    if (!formData.companies) {
      errors.companies = "Seleccione una compañía.";
      formIsValid = false;
    }

    setFormErrors(errors);
    return formIsValid;
  };

  const handleGuardarMaterial = (materialModificado) => {
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

  useEffect(() => {
    console.log("selectedItems:", selectedItems);
  }, [selectedItems]);
  const handleDelete = (rowData) => {
    const updatedItems = selectedItems.filter((item) => item !== rowData);
    setSelectedItems(updatedItems);
    console.log("selectedItems:", selectedItems);
    console.log("Elemento eliminado:", rowData);
  };

  const handleEnviarNavigate = () => {
    setDialogVisibleNuevaCompra(false); // Cierra el modal
    navigate("/Requisitor"); // Navega a la ruta "/Requisitor"
  };

  const handleFileSelect = (event) => {
    const archivoPDF = event.files[0]; // Obtener el primer archivo seleccionado
    console.log("Verificar que estemos mandando varios pdf*********");
    setArchivosSeleccionados([...archivosSeleccionados, archivoPDF]);
    console.log("Archivo seleccionado:", archivosSeleccionados);
    // toast.current.show({
    //   severity: "info",
    //   summary: "Success",

    //   detail: "File Uploaded",
    // });
    console.log("Archivo seleccionado:", archivoPDF);
    // try {
    //   const requestData = {
    //     PurchaseRequestId: datosRequisitor.PurchaseRequestId,
    //     UserId: user.UserId,
    //   };
    //   const response = sendFormData(requestData, archivoPDF);
    //   handleSuccessResponse(response);
    // } catch (error) {
    //   handleErrorResponse(error);
    // }
  };
  return (
    <Layout>
      <Card title="Nueva Compra" className="cardNuevaCompra">
        <Toast ref={(el) => (toast = el)} />

        <form onSubmit={handleSubmit}>
          <div className="p-field-group">
            <div className="row">
              <div className="p-field">
                <DatesInput
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.value })}
                  error={formErrors.fecha}
                />
              </div>
              <div className="p-field">
                <TextInput
                  id="NumAtCard"
                  label="No. referencia:"
                  value={formData.NumAtCard}
                  onChange={(e) =>
                    setFormData({ ...formData, NumAtCard: e.target.value })
                  }
                  error={formErrors.NumAtCard}
                />
              </div>
              <div className="p-field">
                <DropdownInput
                  id="compañia"
                  label="Compañia:"
                  optionLabel="BusinessName"
                  value={formData.companies}
                  placeholder="Seleccione una compañia"
                  options={Array.isArray(companies) ? companies : []}
                  onChange={handleAlmacenChange}
                  error={formErrors.nombre}
                  disabled={companies.length <= 1}
                />
              </div>
            </div>
            <div className="row">
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
              <div className="p-field">
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
                <label htmlFor="proveedor">Archivo PDF </label>
                <input type="file" onChange={handleFileChange} />
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
            </div>
          </div>

          <div className="botonEnviar">
            <Button
              label="Guardar"
              type="submit"
              icon="pi pi-check"
              className="p-button-success"
            />
          </div>
          <div className="botonCancelar">
            <Button
              label="Cancelar"
              type="button"
              onClick={handleEnviarNavigate}
              className="p-button-danger"
            />
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
            <Column field="IVAName" header="Impuesto" />
            <Column
              field=""
              header="Impuesto"
              body={(rowData) => (
                <div>
                  <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    onClick={() => handleEdit(rowData)}
                    className="p-button-warning"
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
    </Layout>
  );
}

export default NuevaCompra;
