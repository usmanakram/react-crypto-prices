import React, { Component } from "react";
import TradingViewGraph from "./tradingView";
import { candleChartdData } from "../services/custom";
import { createChart, CrosshairMode } from "lightweight-charts";

class TradingViewWidget extends Component {
  state = {};
  _id = React.createRef();
  chart = {};

  componentDidMount() {
    /* const chart = createChart(this._id.current, { width: 400, height: 300 });
    const lineSeries = chart.addLineSeries();
    lineSeries.setData([
      { time: "2019-04-11", value: 80.01 },
      { time: "2019-04-12", value: 96.63 },
      { time: "2019-04-13", value: 76.64 },
      { time: "2019-04-14", value: 81.89 },
      { time: "2019-04-15", value: 74.43 },
      { time: "2019-04-16", value: 80.01 },
      { time: "2019-04-17", value: 96.63 },
      { time: "2019-04-18", value: 76.64 },
      { time: "2019-04-19", value: 81.89 },
      { time: "2019-04-20", value: 74.43 }
    ]); */
    this.chart = createChart(this._id.current, {
      width: 600,
      height: 300,
      layout: {
        backgroundColor: "#000000",
        textColor: "rgba(255, 255, 255, 0.9)"
      },
      grid: {
        vertLines: {
          color: "rgba(197, 203, 206, 0.5)"
        },
        horzLines: {
          color: "rgba(197, 203, 206, 0.5)"
        }
      },
      crosshair: {
        mode: CrosshairMode.Normal
      },
      priceScale: {
        borderColor: "rgba(197, 203, 206, 0.8)"
      },
      timeScale: {
        borderColor: "rgba(197, 203, 206, 0.8)"
      }
    });
    var candleSeries = this.chart.addCandlestickSeries({
      upColor: "rgba(255, 144, 0, 1)",
      downColor: "#000",
      borderDownColor: "rgba(255, 144, 0, 1)",
      borderUpColor: "rgba(255, 144, 0, 1)",
      wickDownColor: "rgba(255, 144, 0, 1)",
      wickUpColor: "rgba(255, 144, 0, 1)"
    });
    candleSeries.setData(candleChartdData);

    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  updateDimensions = () => {
    this.chart.resize(
      this._id.current.offsetWidth / 2,
      this._id.current.offsetWidth
    );
  };

  render() {
    return (
      <div className="tradingview-widget-container">
        <div id="tradingview_57f17" ref={this._id}>
          {/* <TradingViewGraph
            symbol="EURUSD"
            theme="Light"
            locale="us"
            // width="100%"
            height={350}
            datafeed={candleChartdData}
          /> */}
        </div>
      </div>
    );
  }
}

export default TradingViewWidget;
