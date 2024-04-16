import React from "react";
import { InputText } from "primereact/inputtext";

const TextInput = ({ id, label, value, onChange, error }) => {
  return (
    <div className="p-field">
      <label htmlFor={id}>{label}</label>
      <InputText
        id={id}
        value={value}
        onChange={onChange}
        className={error ? "p-invalid" : ""}
      />
      {error && <small className="p-error">Campo requerido</small>}
    </div>
  );
};

export default TextInput;
