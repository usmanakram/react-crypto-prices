import React, { Component } from "react";
import { candleChartdData } from "../services/custom";
import { createChart, CrosshairMode } from "lightweight-charts";
import trade from "../services/tradeService";
import ws from "../services/webSocketService";
import eventHandler from "../utils/eventHandler";

class TradingViewWidget extends Component {
  state = {
    timeInterval: "1H",
    isTvFullWidth: false
  };

  graphData = [];
  selectedPairId = 0;
  timeIntervalId = 0;

  _id = React.createRef();
  tvFullWidth = React.createRef();

  chart = {};
  minIntervals = ["1m", "5m", "15m", "30m"];

  /* _events = {
    resize: () => this.updateDimensions(),
    fullscreenchange: () => this.handleFullScreenTrigger()
  }; */
  _events = [
    {
      selector: () => window,
      event: "resize",
      listener: () => this.updateDimensions()
    },
    {
      selector: () => window,
      event: "fullscreenchange",
      listener: () => this.handleFullScreenTrigger()
    },
    {
      selector: () => document.querySelector("a[href='#trading-view']"),
      event: "click",
      listener: () => setTimeout(() => this.updateDimensions(), 175)
    }
  ];

  componentDidMount() {
    this.initializeCandleStickGraph();

    this.updateDimensions();
    eventHandler.bind(this._events);
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
    eventHandler.unbind(this._events);

    if (this.selectedPairId && this.timeIntervalId) {
      ws.leaveChannel(
        "CandleStickGraph." + this.selectedPairId + "." + this.timeIntervalId
      );
    }
  }

  initializeCandleStickGraph = () => {
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
  };

  handleFullScreenTrigger = () => {
    // if (isTvFullWidth) isTvFullWidth = false;
    // else isTvFullWidth = true;

    this.setState({ isTvFullWidth: !this.state.isTvFullWidth });
    this.updateDimensions();
  };

  handleTvFullWidth = () => {
    if (this.state.isTvFullWidth) {
      // isTvFullWidth = false;

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
      // isTvFullWidth = true;

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
    const height = this.state.isTvFullWidth
      ? window.screen.height - 26
      : this._id.current.offsetWidth / 2;
    const width = this.state.isTvFullWidth
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
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }

    this.handleGraphStreem();
  };

  handleGraphStreem = () => {
    ws.channel(
      "CandleStickGraph." + this.selectedPairId + "." + this.timeIntervalId
    ).listen("CandleStickGraphUpdated", e => {
      const indexOfLastCandle = this.graphData.length - 1;

      if (this.graphData[indexOfLastCandle].time === e.candleStickData.time) {
        this.graphData[indexOfLastCandle] = e.candleStickData;
      } else {
        this.graphData.push(e.candleStickData);
      }

      this.candleSeries.setData(this.graphData);
    });
  };

  handleChange = ({ currentTarget: input }) => {
    this.setState({ timeInterval: input.value });
  };

  render() {
    const { timeInterval, isTvFullWidth } = this.state;
    return (
      <div className="tradingview-widget-container">
        <div className="exchange-chart-block" ref={this.tvFullWidth}>
          <div className="row" style={{ margin: "0" }}>
            <div className="col-md-12 tv-toolbar">
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
                <ul className="dropdown-menu">
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
                </ul>
              </div>

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
              {isTvFullWidth ? (
                <svg
                  viewBox="0 0 14 16"
                  height="22"
                  width="22"
                  onClick={this.handleTvFullWidth}
                  className="svg-style"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 4H0V3h2V1h1v2c0 .547-.453 1-1 1zm0 8H0v1h2v2h1v-2c0-.547-.453-1-1-1zm9-2c0 .547-.453 1-1 1H4c-.547 0-1-.453-1-1V6c0-.547.453-1 1-1h6c.547 0 1 .453 1 1v4zM9 7H5v2h4V7zm2 6v2h1v-2h2v-1h-2c-.547 0-1 .453-1 1zm1-10V1h-1v2c0 .547.453 1 1 1h2V3h-2z"
                  ></path>
                </svg>
              ) : (
                <svg
                  viewBox="0 0 28 28"
                  width="22"
                  height="22"
                  onClick={this.handleTvFullWidth}
                  className="svg-style"
                >
                  <g fill="currentColor">
                    <path d="M21 7v4h1V6h-5v1z"></path>
                    <path d="M16.854 11.854l5-5-.708-.708-5 5zM7 7v4H6V6h5v1z"></path>
                    <path d="M11.146 11.854l-5-5 .708-.708 5 5zM21 21v-4h1v5h-5v-1z"></path>
                    <path d="M16.854 16.146l5 5-.708.708-5-5z"></path>
                    <g>
                      <path d="M7 21v-4H6v5h5v-1z"></path>
                      <path d="M11.146 16.146l-5 5 .708.708 5-5z"></path>
                    </g>
                  </g>
                </svg>
              )}
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
