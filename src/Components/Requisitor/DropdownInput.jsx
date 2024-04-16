import React from "react";
import { Dropdown } from "primereact/dropdown";

const DropdownInput = ({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  optionLabel,
  options,
}) => {
  return (
    <div className="p-field">
      <label htmlFor={id}>{label}</label>
      <Dropdown
        id={id}
        optionLabel={optionLabel}
        value={value}
        options={options}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <small className="p-error">Campo requerido</small>}
    </div>
  );
};

export default DropdownInput;
