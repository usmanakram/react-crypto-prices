import React from "react";

const File = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group">
      <div className="custom-file">
        <input
          name={name}
          id={name}
          {...rest}
          // type="file"
          className="custom-file-input"
          // id="customFile"
        />
        <label className="custom-file-label" htmlFor={name}>
          {label}
        </label>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  );
};

export default File;
