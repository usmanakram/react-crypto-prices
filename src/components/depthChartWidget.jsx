import React, { Component } from "react";

import { depthChart } from "../services/custom";

class DepthChartWidget extends Component {
  state = {};

  componentDidMount() {
    depthChart();
  }

  render() {
    return <div id="chartdiv" style={{ width: "100%", height: "350px" }}></div>;
  }
}

export default DepthChartWidget;
