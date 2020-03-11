import React from "react";

const Spinner = ({ status }) => {
  if (status === false) return null;

  return (
    // <div className="spinner_processing">
    //   <div className="spinner_center">
    //     <i
    //       className="fa fa-spinner fa-spin  "
    //       style={{ fontSize: 30, color: "#797979" }}
    //     ></i>
    //   </div>
    // </div>
  
    <div id="bars4" className="pt-3">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

Spinner.defaultProps = {
  status: true
};

export default Spinner;
