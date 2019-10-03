import React from "react";

const HorizontalFormInput = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor="{name}" className="col-sm-3 control-label">
        {label}
      </label>
      <div className="col-sm-9">
        <input
          name={name}
          id={name}
          {...rest}
          className="form-control"
          placeholder={label}
        />
        {/* {error && <div className="alert alert-danger">{error}</div>} */}
      </div>
    </div>
  );
};

export default HorizontalFormInput;
