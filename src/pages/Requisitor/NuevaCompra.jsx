import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import TextInput from "../../Components/Requisitor/TextInput";
import DatesInput from "../../Components/Requisitor/DatesInput";
import TextTareaInput from "../../Components/Requisitor/TextTareaInput";
import DropdownInput from "../../Components/Requisitor/DropdownInput";
import { AutoComplete } from "primereact/autocomplete";

import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios"; // Importar Axios
import { Navbar } from "../../Navbar";
import "./NuevaCompra.css";

function NuevaCompra() {
  const [formData, setFormData] = useState({
    fecha: null,
    nombre: "",
    almacen: "",
    proveedor: "",
    cantidad: "",
    precio: "",
    comentario: "",
    archivoPDF: null,
  });

  const [formErrors, setFormErrors] = useState({
    fecha: false,
    nombre: false,
    almacen: false,
    proveedor: false,
    cantidad: false,
    precio: false,
    comentario: false,
  });

  const [companies, setCompanies] = useState([]);
  const [materialeslData, setMaterialesData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);


  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJ1YmVuLkciLCJpYXQiOjE3MTMwNTYxOTYsImV4cCI6MTcxMzA3MDU5Nn0.pUaTtKZz4sJEn9LzvGgkUl3MDeEpKNlKNuQbzDsMv_4"';


  const handleAlmacenChange12 = (e) => {
    const selectedAlmacen = e.value; // Utilizamos e.value en lugar de e.target.value
    console.log("selectedAlmacen", selectedAlmacen);
    setSelectedMaterial(selectedAlmacen); // Actualizamos el material seleccionado

    // Agregamos el material seleccionado a la lista de elementos seleccionados
    setSelectedItems((prevSelectedItems) => [
      ...prevSelectedItems,
      selectedAlmacen,
    ]);
  };

  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const filterMaterials = (event) => {
    const searchTerm = event.query.toLowerCase();
    const filtered = materialeslData.filter((material) =>
      material.Description.toLowerCase().includes(searchTerm)
    );
    console.log("*****************************************************");
    console.log("event", filtered);
    console.log(materialeslData);
    console.log("*****************************************************");

    setFilteredMaterials(filtered);
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
      // setShowAdditionalDropdown(true); // Mostrar el segundo DropdownInput aquí de recibir los datos
    } catch (error) {
      console.error("Error al obtener datos adicionales:", error);
    }
  };
  const selectedCountryTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.Description}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const countryOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.Description}</div>
      </div>
    );
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
      // const token = "tu-token-aqui"; // Reemplaza "tu-token-aqui" con el token real
      // const parametros = {
      //   parametro1: valor1,
      //   parametro2: valor2
      //   // Agrega tantos parámetros como necesites
      // };

      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   },
      //   params: parametros
      // };
      // axios.post("http://endpoint", data)
      // .then((response) => {
      //   console.log("Datos guardados en el servidor:", response.data);

      // })
      // .catch((error) => {
      //   console.error("Error al enviar datos al servidor:", error);
      // });
      // console.log("Datos válidos, enviando formulario:", formData);

      try {
        // Convertir el archivo PDF a base64
        let archivoBase64 = null;
        if (formData.archivoPDF) {
          archivoBase64 = await convertirAPDFBase64(formData.archivoPDF);
        }

        // Crear objeto de datos para enviar al servidor
        const data = {
          fecha: formData.fecha,
          nombre: formData.nombre,
          archivoPDF: archivoBase64,
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
                    id="nombre"
                    label="No. referencia:"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    error={formErrors.nombre}
                  />
                </div>
                <div className="p-field">
                  <DropdownInput
                    id="almacen"
                    ll
                    label="No. referencia:"
                    optionLabel="BusinessName"
                    value={formData.almacen}
                    placeholder="Seleccione una compania"
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
                    value={formData.comentario}
                    onChange={(e) =>
                      setFormData({ ...formData, comentario: e.target.value })
                    }
                    rows={1}
                    cols={10}
                  />
                </div>
                <div className="p-field">
                  <label htmlFor="proveedor">Subir adjuntos</label>
                  <input
                    id="pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="p-field">
                  <label htmlFor="proveedor">Material </label>
                  <AutoComplete
                    value={selectedMaterial}
                    suggestions={filteredMaterials}
                    completeMethod={filterMaterials}
                    field="Description"
                    onChange={handleAlmacenChange12}
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
          <div className="table-container">
            <DataTable value={selectedItems}>
              <Column field="ItemCode" header="Codigo" />
              <Column field="Description" header="Description" />
              <Column field="unidad" header="Unidad" />
              <Column field="cantiad" header="Cantidad" />
            </DataTable>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default NuevaCompra;
