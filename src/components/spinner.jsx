import React, { Component } from "react";

class Spinner extends Component {
  state = {};

  render() {
    return (
      <div className="spinner_processing">
        <div className="spinner_center">
          <i
            className="fa fa-spinner fa-spin "
            style={{ fontSize: 48, color: "#0275d8" }}
          ></i>
        </div>
      </div>
    );
  }
}
export default Spinner;
