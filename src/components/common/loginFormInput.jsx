import React from "react";

const LoginFormInput = ({ name, error, ...rest }) => {
  return (
    <div className="form-group">
      <input name={name} id={name} {...rest} className="form-control" />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default LoginFormInput;
