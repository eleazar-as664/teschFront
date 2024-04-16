import React from "react";

import { FileUpload } from "primereact/fileupload";

const FileInput = ({ id, label, mode, demo, error, url, accept, onUpload }) => {
  console.log("Prop onUpload:", onUpload);  // Agrega este console.log
  return (
    <div className="p-field">
      <label htmlFor={id}>{label}</label>
      <FileUpload
        mode={mode}
        name={demo}
        url={url}
        accept={accept}
        customUpload
        onUpload={onUpload}
      />
      {error && <small className="p-error">Campo requerido</small>}
    </div>
  );
};

export default FileInput;
