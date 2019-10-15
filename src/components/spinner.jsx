import React, { Component } from "react";

class Spinner extends Component {
  state = {};

  render() {
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
  }
}
export default Spinner;
