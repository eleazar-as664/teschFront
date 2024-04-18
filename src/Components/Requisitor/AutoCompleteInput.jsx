import React from "react";
import { AutoComplete } from "primereact/autocomplete";


const AutoCompleteInput = ({ id, label, value, onChange, descripcion,filteredMaterials,filterMaterials, onSelect, placeholder }) => {
  return (
    <div className="p-field">
      <label htmlFor={id}>{label}</label>
      <AutoComplete
                      value={value}
                      suggestions={filteredMaterials}
                      completeMethod={filterMaterials}
                      field={descripcion}
                      onChange={onChange}
                      onSelect={onSelect}
                      placeholder={placeholder}
                    />
      
    </div>
  );
};

export default AutoCompleteInput;
