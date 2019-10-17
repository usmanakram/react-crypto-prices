import React from "react";

const Spinner = ({ status }) => {
  if (status === false) return null;

  return (
    <div className="spinner_processing">
      <div className="spinner_center">
        <i
          className="fa fa-spinner fa-spin  "
          style={{ fontSize: 45, color: "#797979" }}
        ></i>
      </div>
    </div>
  );
};

Spinner.defaultProps = {
  status: true
};

export default Spinner;
