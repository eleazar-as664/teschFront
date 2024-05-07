import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import routes from "../../utils/routes";
import axios from "axios";

function MaterialDialog({ visible, material, onClose, onSave }) {
  const [updatedMaterial, setUpdatedMaterial] = useState({});
  const [selectedIVA, setSelectedIVA] = useState(null);
  const [ivaOptions, setIvaOptions] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJ1YmVuLkciLCJpYXQiOjE3MTMwNTYxOTYsImV4cCI6MTcxMzA3MDU5Nn0.pUaTtKZz4sJEn9LzvGgkUl3MDeEpKNlKNuQbzDsMv_4"';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUpdatedMaterial(material);

        if (material.CompanyId) {
          const apiUrl = `${routes.BASE_URL_SERVER}/GetTaxes/${material.CompanyId}`;
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
    console.clear()
    console.log("handleInputChange", e.target);
    const { name, value } = e.target;
    setUpdatedMaterial((prevState) => ({
      ...prevState,
      [name]: value || "",
    }));
  };

  const handleSave = () => {
    if (validateForm()) {
      setSelectedIVA([]);

      onSave(updatedMaterial); // Llama a la función onSave con el material modificado
      onClose(); // Cierra el diálogo
    }
  };

  const handleIVAChange = (selectedOption) => {
    setSelectedIVA(selectedOption);
    setUpdatedMaterial((prevState) => ({
      ...prevState,
      TaxCode: selectedOption.Id,
      IVAName: selectedOption.Name,
    }));
  };

  const handleCantidadChange = (event) => {
    const newValue = event.value;
    console.clear();
    console.log("newValue", newValue);

    if (newValue != null && newValue !== "" && !isNaN(newValue)) {
      // Verifica si el nuevo valor no es null ni NaN
      console.log("Verifica si el nuevo valor no es null ni NaN", newValue);
      setUpdatedMaterial((prevState) => ({
        ...prevState,
        Quantity: newValue,
      }));
    } 
  };

  const validateForm = () => {
    const errors = {};

    if (
      !updatedMaterial.Description ||
      updatedMaterial.Description.trim() === ""
    ) {
      errors.Description = "La descripción es obligatoria.";
    }

    if (
      !updatedMaterial.BuyUnitMsr ||
      updatedMaterial.BuyUnitMsr.trim() === ""
    ) {
      errors.BuyUnitMsr = "La unidad es obligatoria.";
    }
    if (
      typeof updatedMaterial.Quantity !== "number" ||
      updatedMaterial.Quantity === null ||
      updatedMaterial.Quantity === undefined
    ) {
      errors.Quantity = "La cantidad debe ser un número.";
    }
    // if (!selectedIVA || !selectedIVA.TaxCode) {
    //   errors.TaxCodeId = "Seleccione un valor de IVA.";
    // }

    // Verificar si hay errores
    const formIsValid = Object.keys(errors).length === 0;

    setValidationErrors(errors);

    return formIsValid;
  };

  return (
    <Dialog
      visible={visible}
      onHide={onClose}
      header="Modificar Material"
      modal
      footer={
        <div class="row">
          <Button
            label="Aceptar"
            icon="pi pi-check"
            onClick={handleSave}
            className="p-button-primary"
          />
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
            {validationErrors.Description && (
              <small className="p-error">{validationErrors.Description}</small>
            )}
          </div>
        </div>
        <div className="row">
          <div className="p-field">
            <label htmlFor="cantidad">Cantidad</label>
            <InputNumber
              id="cantidad"
              name="Quantity"
              value={updatedMaterial.Quantity || ""}
              onChange={handleCantidadChange}
              min={0}
              max={10000}
              className={validationErrors.Quantity ? "p-invalid" : ""}
              style={{ display: "contents" }}
              autoComplete="off"
              autoFocus
            />
            {validationErrors.Quantity && (
              <small className="p-error">{validationErrors.Quantity}</small>
            )}
          </div>
          <div className="p-field">
            <label htmlFor="unidad">Unidad</label>
            <InputText
              id="unidad"
              name="BuyUnitMsr"
              value={updatedMaterial?.BuyUnitMsr || ""}
              onChange={handleInputChange}
            />
            {validationErrors.BuyUnitMsr && (
              <small className="p-error">{validationErrors.BuyUnitMsr}</small>
            )}
          </div>
          {/* <div className="p-field">
            <label htmlFor="iva">IVA</label>

            <Dropdown
              id="iva"
              name="IVA"
              value={selectedIVA}
              options={ivaOptions}
              optionLabel="Name"
              onChange={(e) => handleIVAChange(e.value)}
              placeholder="Seleccione IVA"
              className={validationErrors.TaxCodeId ? "p-invalid" : ""}
            />

            {validationErrors.TaxCodeId && (
              <small className="p-error">{validationErrors.TaxCodeId}</small>
            )}
          </div> */}
        </div>
      </div>
    </Dialog>
  );
}

export default MaterialDialog;
