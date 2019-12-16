import React, { Component } from "react";
import { candleChartdData } from "../services/custom";
import { createChart, CrosshairMode } from "lightweight-charts";
import trade from "../services/tradeService";
import ws from "../services/webSocketService";

class TradingViewWidget extends Component {
  state = {
    timeInterval: "1H"
  };

  graphData = [];
  selectedPairId = 0;
  timeIntervalId = 0;

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
    this.candleSeries = this.chart.addCandlestickSeries({
      upColor: "green",
      downColor: "red",
      borderDownColor: "red",
      borderUpColor: "green",
      wickDownColor: "red",
      wickUpColor: "green",
      priceFormat: {
        type: "price",
        precision: 8,
        minMove: 0.0000001
      }
    });
    this.candleSeries.setData(candleChartdData);

    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedPair } = this.props;
    if (
      Object.keys(selectedPair).length &&
      (selectedPair.id !== this.selectedPairId ||
        this.state.timeInterval !== prevState.timeInterval)
    ) {
      ws.leaveChannel(
        "CandleStickGraph." + this.selectedPairId + "." + this.timeIntervalId
      );
      this.handleGraph();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
    if (this.selectedPairId && this.timeIntervalId) {
      ws.leaveChannel(
        "CandleStickGraph." + this.selectedPairId + "." + this.timeIntervalId
      );
    }
  }
  updateDimensions = () => {
    this.chart.resize(
      this._id.current.offsetWidth / 2,
      this._id.current.offsetWidth
    );
  };

  handleGraph = async () => {
    const { selectedPair } = this.props;

    this.selectedPairId = selectedPair.id;

    try {
      const candleChartData = await trade.getChartTradeHistory(
        selectedPair.id,
        this.state.timeInterval
      );

      this.timeIntervalId = candleChartData.time_interval_id;

      this.graphData = candleChartData.history;

      this.candleSeries.setData(this.graphData);
      // this.candleSeries.setData(candleChartData);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
        // toast.error(ex.response.data);
      }
    }

    // ws.channel("CandleStickGraph." + this.selectedPairId).listen(
    //   "CandleStickGraphUpdated",
    //   e => {
    //     this.candleSeries.setData(e.candleStickData);
    //   }
    // );
    this.handleGraphStreem();
  };

  handleGraphStreem = () => {
    ws.channel(
      "CandleStickGraph." + this.selectedPairId + "." + this.timeIntervalId
    ).listen("CandleStickGraphUpdated", e => {
      if (
        this.graphData[this.graphData.length - 1].time ===
        e.candleStickData.time
      ) {
        this.graphData[this.graphData.length - 1] = e.candleStickData;
      } else {
        this.graphData.push(e.candleStickData);
      }

      // this.candleSeries.setData(e.candleStickData);
      this.candleSeries.setData(this.graphData);
    });
  };

  handleChange = ({ currentTarget: input }) => {
    this.setState({ timeInterval: input.value });
  };

  render() {
    // this.handleGraph();
    const { timeInterval } = this.state;
    return (
      <div className="tradingview-widget-container">
        <div className="exchange-chart-block">
          <div className="row tv-toolbar">
            <div className="col-md-12">
              <select
                onChange={this.handleChange}
                className={
                  ["1m", "5m", "15m", "30m"].includes(timeInterval)
                    ? "selected-interval"
                    : ""
                }
              >
                <option value="1m">1m</option>
                <option value="5m">5m</option>
                <option value="15m">15m</option>
                <option value="30m">30m</option>
              </select>
              {/* <select
                onChange={this.handleChange}
                className={
                  ["1H", "4H"].includes(timeInterval) ? "selected-interval" : ""
                }
              >
                <option>1H</option>
                <option>4H</option>
              </select> */}
              <button
                className={timeInterval === "1H" ? "selected-interval" : ""}
                value="1H"
                onClick={this.handleChange}
                type="button"
              >
                1H
              </button>
              <button
                className={timeInterval === "1D" ? "selected-interval" : ""}
                value="1D"
                onClick={this.handleChange}
                type="button"
              >
                1D
              </button>
              <button
                className={timeInterval === "1W" ? "selected-interval" : ""}
                value="1W"
                onClick={this.handleChange}
                type="button"
              >
                1W
              </button>
              <button
                className={timeInterval === "1M" ? "selected-interval" : ""}
                value="1M"
                onClick={this.handleChange}
                type="button"
              >
                1M
              </button>
            </div>
          </div>

          <div ref={this._id}>
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
      </div>
    );
  }
}

export default TradingViewWidget;
