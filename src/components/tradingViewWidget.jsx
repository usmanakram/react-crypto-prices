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
  tvFullWidth = React.createRef();
  isTvFullWidth = false;
  chart = {};
  minIntervals = ["1m", "5m", "15m", "30m"];

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
    window.addEventListener("fullscreenchange", this.handleFullScreenTrigger);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedPair, isFullWidth } = this.props;
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

    if (prevProps.isFullWidth !== isFullWidth) {
      this.updateDimensions();
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

  handleFullScreenTrigger = () => {
    // if (this.isTvFullWidth) this.isTvFullWidth = false;
    // else this.isTvFullWidth = true;

    this.isTvFullWidth = !this.isTvFullWidth;
    this.updateDimensions();
  };

  handleTvFullWidth = () => {
    if (this.isTvFullWidth) {
      // this.isTvFullWidth = false;

      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    } else {
      // this.isTvFullWidth = true;

      const elem = this.tvFullWidth.current;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    }
  };

  updateDimensions = () => {
    const height = this.isTvFullWidth
      ? window.screen.height - 26
      : this._id.current.offsetWidth / 2;
    const width = this.isTvFullWidth
      ? window.screen.width
      : this._id.current.offsetWidth;

    this.chart.resize(height, width);
    /* this.chart.resize(
      this._id.current.offsetWidth / 2,
      this._id.current.offsetWidth
    ); */
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
        <div className="exchange-chart-block" ref={this.tvFullWidth}>
          <div className="row tv-toolbar">
            <div className="col-md-12">
              <div className="dropdown d-inline">
                <button
                  type="button"
                  className={`dropdown-toggle ${
                    this.minIntervals.includes(timeInterval)
                      ? "selected-interval"
                      : ""
                  }`}
                  data-toggle="dropdown"
                >
                  {this.minIntervals.includes(timeInterval)
                    ? `${timeInterval}`
                    : "1m"}
                </button>
                <div className="dropdown-menu">
                  {this.minIntervals.map(i => (
                    <li key={i}>
                      <button
                        className={
                          timeInterval === i ? "selected-interval" : ""
                        }
                        value={i}
                        onClick={this.handleChange}
                        type="button"
                      >
                        {i}
                      </button>
                    </li>
                  ))}
                </div>
              </div>
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
              <button
                className={timeInterval === "" ? "selected-interval" : ""}
                onClick={this.handleTvFullWidth}
              >
                FullWidht
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
