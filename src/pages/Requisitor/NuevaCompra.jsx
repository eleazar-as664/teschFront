import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import TextInput from "../../Components/Requisitor/TextInput";
import DatesInput from "../../Components/Requisitor/DatesInput";
import TextTareaInput from "../../Components/Requisitor/TextTareaInput";
import DropdownInput from "../../Components/Requisitor/DropdownInput";
import { AutoComplete } from "primereact/autocomplete";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import MaterialDialog from "../../Components/Requisitor/Materiales";
import moment from "moment";

import { FileUpload } from "primereact/fileupload";

import axios from "axios"; // Importar Axios
import { Navbar } from "../../Navbar";
import "./NuevaCompra.css";

function NuevaCompra() {
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
  const [selectedItems] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
 


  const filterMaterials = (event) => {
    const searchTerm = event.query.toLowerCase();
    const filtered = materialeslData.filter((material) =>
      material.Description.toLowerCase().includes(searchTerm)
    );
    setFilteredMaterials(filtered);
  };

 

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJ1YmVuLkciLCJpYXQiOjE3MTMwNTYxOTYsImV4cCI6MTcxMzA3MDU5Nn0.pUaTtKZz4sJEn9LzvGgkUl3MDeEpKNlKNuQbzDsMv_4"';
  const user = JSON.parse(localStorage.getItem("user"));
  // const handleAlmacenChange12 = (selectedMaterial) => {
  //   // Actualizar el material seleccionado
  //   console.log("Material seleccionado:", selectedMaterial);
  //   setSelectedMaterial(selectedMaterial);

  //   console.log(selectedItems);
  //   // // Agregamos el material seleccionado a la lista de elementos seleccionados
  //   setSelectedItems((prevSelectedItems) => [
  //     ...prevSelectedItems,
  //     selectedMaterial,
  //   ]);
  // };
  const handleAlmacenChange12 = (material) => {
    console.log(material);
    setSelectedMaterial(material);
    setDialogVisible(true);
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
    // Puedes realizar cualquier acción necesaria después de cerrar el diálogo
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = "http://localhost:3000/api/v1/GetCompanies";
        const config = {
          headers: {
            "x-access-token": token,
          },
        };
        const response = await axios.get(apiUrl, config);
        console.log("Response:", response.data.data);
        setCompanies(response.data.data);
      } catch (error) {
        console.error("Error al obtener datos de la API:", error);
      }
    };

    fetchData();
  }, []); // El array vacío indica que este efecto se ejecuta solo una vez, equivalente a componentDidMount

  const handleAlmacenChange = async (e) => {
    const selectedAlmacen = e.target.value;
    setFormData({ ...formData, almacen: selectedAlmacen });
    console.log(
      "Almacen seleccionado:111111111111111111111111",
      selectedAlmacen.Id
    );
    try {
      const apiUrl = `http://localhost:3000/api/v1/GetItemsByCompany/${selectedAlmacen.Id}`;
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await axios.get(apiUrl, config);
      console.log("Additional Data Response:", response.data);
      setMaterialesData(response.data.data);
  
    } catch (error) {
      console.error("Error al obtener datos adicionales:", error);
    }
  };


  const handleFileChange = (event) => {
    console.log("Valor de event en handleUpload:", event);
    const archivoPDF =
      event.files && event.files.length > 0 ? event.files[0] : null;
    console.log("Archivo seleccionado:", archivoPDF);
    setFormData({ ...formData, archivoPDF });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {     

      try {
        // Convertir el archivo PDF a base64
        let archivoBase64 = null;
        if (formData.archivoPDF) {
          archivoBase64 = await convertirAPDFBase64(formData.archivoPDF);
        }

        // Crear objeto de datos para enviar al servidor
        const momentDate = moment(formData.fecha);

        // Formatear la nueva fecha
        const formattedDate = momentDate.format("YYYY-MM-DD");
        const PurchaseOrderRequestDetails = selectedItems.map((obj) => {
          return {
            Description: obj.Description,
            BuyUnitMsr: obj.BuyUnitMsr,
            Quantity: 0, //obj.Quantity,
            TaxCodeId: null, //obj.TaxCodeId,
            ItemId: obj.Id,
            PurchaseRequestId: 0,
          };
        });
        console.log(PurchaseOrderRequestDetails);
        const data = {
          CreateDate: formattedDate,
          DocDate: formattedDate,
          UserId: user.UserId,
          NumAtCard: formData.NumAtCard,
          Comments: formData.Comments,
          CompanyId: formData.companies.Id,
          archivoPDF: archivoBase64,
          PurchaseOrderRequestDetails: selectedItems,
        };

        console.log("archivoBase64archivoBase64archivoBase64", data);

        // Realizar la petición POST al servidor
        // const response = await axios.post("http://endpoint", data);

        // console.log("Respuesta del servidor:", response.data);
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
      }
    } else {
      // console.log("Datos inválidos, no se puede enviar el formulario.");
    }
  };

  const convertirAPDFBase64 = (archivoPDF) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(archivoPDF);
    });
  };

  const validateForm = () => {
    const errors = {};
    let formIsValid = true;
    // Validaciones de los campos del formulario
    setFormErrors(errors);
    return formIsValid;
  };

  return (
    <div>
      <Navbar />
      <div className="card flex justify-content-center">
        <Card title="Nueva Compra" className="cardNuevaCompra">
          <form onSubmit={handleSubmit}>
            <div className="p-field-group">
              <div className="row">
                <div className="p-field">
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
                      setFormData({ ...formData, NumAtCard: e.target.value })
                    }
                    error={formErrors.NumAtCard}
                  />
                </div>
                <div className="p-field">
                  <DropdownInput
                    id="compañia"
                    ll
                    label="Compañia:"
                    optionLabel="BusinessName"
                    value={formData.companies}
                    placeholder="Seleccione una compañia"
                    options={Array.isArray(companies) ? companies : []}
                    onChange={handleAlmacenChange}
                    error={formErrors.nombre}
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
                  <label htmlFor="proveedor">Archivo PDF </label>
                  <FileUpload
                    mode="basic"
                    name="demo[]"
                    url="/api/upload"
                    accept="application/pdf"
                    maxFileSize={1000000}
                    onUpload={handleFileChange}
                  />
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
                onClick={() => console.log("Cancelado")}
                className="p-button-danger"
              />
            </div>
          </form>
          {selectedMaterial && (
            <MaterialDialog
              visible={dialogVisible}
              material={selectedMaterial}
              onClose={handleDialogClose}
            />
          )}

          <div className="table-container">
            <DataTable value={selectedItems} editMode="cell">
              <Column field="ItemCode" header="Codigo" />
              <Column field="Description" header="Description" />
              <Column field="unidad" header="Unidad">
               
              </Column>
              <Column
                field="cantiad"
                header="Cantidad"
            
                editorValidator={() => true}
              />
            </DataTable>

            {/* <Column
                field="TaxCodeId"
                header="Codigo Impuesto"
                editor={(props) => (
                  <Dropdown
                  value={props.rowData[props.field]?.Name}// Acceder a la propiedad "Name" del objeto
                  options={taxOptions}
                  onChange={(e) => onEditorValueChange(props, e.value)}
                  placeholder="Seleccione"
                />
                )}
              /> */}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default NuevaCompra;
