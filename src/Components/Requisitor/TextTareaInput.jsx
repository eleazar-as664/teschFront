import React from "react";
import { InputTextarea } from "primereact/inputtextarea";

const TextTareaInput = ({ id, label, value, onChange, error, rows, cols }) => {
  return (
    <div className="p-field">
    <label htmlFor={id}>{label}</label>
    <InputTextarea value={value} onChange={onChange} rows={rows} cols={cols} />
    {error && <small className="p-error">Campo requerido</small>}
  </div>
  );
};

export default TextTareaInput;
