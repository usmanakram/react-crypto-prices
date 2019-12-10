import React, { Component } from "react";

import { depthChart } from "../services/custom";

class DepthChartWidget extends Component {
  state = {};

  componentDidMount() {
    depthChart();
  }

  render() {
    return (
      <div className="exchange-chart-block">
        <div id="depthChartStyle"></div>
      </div>
    );
  }
}

export default DepthChartWidget;
