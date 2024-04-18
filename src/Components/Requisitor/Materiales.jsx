import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import axios from "axios";

function MaterialDialog({ visible, material, onClose }) {
  const [updatedMaterial, setUpdatedMaterial] = useState({});
  const [selectedIVA, setSelectedIVA] = useState(null);
  const [ivaOptions, setIvaOptions] = useState([]);
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJ1YmVuLkciLCJpYXQiOjE3MTMwNTYxOTYsImV4cCI6MTcxMzA3MDU5Nn0.pUaTtKZz4sJEn9LzvGgkUl3MDeEpKNlKNuQbzDsMv_4"';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUpdatedMaterial(material);
        console.log("Material actualizado:", material.CompanyId);

        if (material.CompanyId) {
          const apiUrl = `http://localhost:3000/api/v1/GetTaxes/${material.CompanyId}`;
          const config = { headers: { "x-access-token": token } };
          const response = await axios.get(apiUrl, config);
          setIvaOptions(response.data.data);
        }
      } catch (error) {
        console.error("Error al obtener datos de la API:", error);
      }
    };

    fetchData();
  }, [material]); // Dependencia de material

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMaterial((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Material modificado:", updatedMaterial);
    onClose();
  };

  const handleIVAChange = (selectedOption) => {
    setSelectedIVA(selectedOption);
    setUpdatedMaterial((prevState) => ({
      ...prevState,
      IVA: selectedOption.TaxCode, 
    }));
  };

  return (
    <Dialog
      visible={visible}
      onHide={onClose}
      header="Modificar Material"
      modal
      footer={
        <div>
          <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
          <Button
            label="Cancelar"
            icon="pi pi-times"
            onClick={onClose}
            className="p-button-secondary"
          />
        </div>
      }
    >
      {/* Campos de entrada para modificar el material */}
      <div className="p-field-group">
        <div className="row">
          <div className="p-field">
            <label htmlFor="description">Descripción</label>
            <InputText
              id="description"
              name="Description"
              value={updatedMaterial.Description || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="p-field">
            <label htmlFor="unidad">Unidad</label>
            <InputText
              id="unidad"
              name="Unidad"
              value={updatedMaterial.Unidad || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="p-field">
            <label htmlFor="cantidad">Cantidad</label>
            <InputText
              id="cantidad"
              name="Cantidad"
              value={updatedMaterial.Cantidad || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="p-field">
            <label htmlFor="iva">IVA</label>
            {ivaOptions.length > 0 ? (
              <Dropdown
                id="iva"
                name="IVA"
                value={selectedIVA}
                options={ivaOptions}
                optionLabel="Name"
                onChange={(e) => handleIVAChange(e.value)}
                placeholder="Seleccione IVA"
              />
            ) : (
              <div>Cargando opciones de IVA...</div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default MaterialDialog;
