import React from "react";
import { Calendar } from "primereact/calendar";

const DatesInput = ({ value, onChange, error }) => {
  return (
    <div className="p-field">
      <label>Fecha de Vencimiento:</label>
      <Calendar
        value={value}
        onChange={onChange}
        dateFormat="dd/mm/yy"
        placeholder="Seleccione una fecha"
        className={error ? "p-invalid" : ""}
      />
      {error && <small className="p-error">Campo requerido</small>}
    </div>
  );
};

export default DatesInput;
