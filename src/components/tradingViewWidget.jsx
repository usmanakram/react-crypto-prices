import React, { Component } from "react";
import { candleChartdData } from "../services/custom";
import { createChart, CrosshairMode } from "lightweight-charts";
import moment from "moment";
import trade from "../services/tradeService";
import ws from "../services/webSocketService";
import eventHandler from "../utils/eventHandler";
import Spinner from "./spinner";
import debug from "../utils/debuger";

class TradingViewWidget extends Component {
  state = {
    timeInterval: "1H",
    isTvFullWidth: false
  };

  graphData = [];
  selectedPairId = 0;
  timeIntervalId = 0;
  isRequested = false;
  isFullHistoryLoaded = false;

  _id = React.createRef();
  tvFullWidth = React.createRef();

  chart = {};
  candleSeries = {};
  volumeSeries = {};
  movingAverage = [
    {
      period: 7,
      color: "rgb(244,201,35)",
      type: "close",
      data: [],
      lineSeries: {}
    },
    {
      period: 25,
      color: "rgb(131,57,214)",
      type: "close",
      data: [],
      lineSeries: {}
    },
    {
      period: 99,
      color: "rgb(205,40,101)",
      type: "close",
      data: [],
      lineSeries: {}
    }
  ];
  chartOHLCLabel = {};
  chartMAsLabel = {};
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

  settings = {
    dark: {
      chart: {
        // width: 600,
        // height: 300,
        layout: {
          backgroundColor: "#131722",
          textColor: "rgba(255, 255, 255, 0.9)"
        },
        grid: {
          vertLines: { color: "#363C4E" },
          horzLines: { color: "#363C4E" }
        },
        crosshair: { mode: CrosshairMode.Normal },
        priceScale: { borderColor: "#ABACAF" },
        timeScale: {
          borderColor: "#ABACAF",
          timeVisible: true,
          secondsVisible: false,
          barSpacing: 8
        }
        // watermark: {
        //   color: "white",
        //   visible: true,
        //   text: "TradingView Watermark Example",
        //   fontSize: 12,
        //   horzAlign: "left",
        //   vertAlign: "top"
        // }
      },
      candlestick: {
        upColor: "#26A69A",
        downColor: "#EF5350",
        borderDownColor: "#EF5350",
        borderUpColor: "#26A69A",
        wickDownColor: "#EF5350",
        wickUpColor: "#26A69A",
        priceFormat: {
          type: "price",
          precision: 8,
          minMove: 0.0000001
        }
      },
      histogram: {
        color: "#26a69a",
        lineWidth: 2,
        priceFormat: { type: "volume" },
        overlay: true,
        scaleMargins: { top: 0.8, bottom: 0 },
        lastValueVisible: false,
        priceLineVisible: false
      }
    },
    light: {
      chart: {
        // width: 600,
        // height: 300,
        layout: {
          backgroundColor: "#ffffff",
          textColor: "rgba(0, 0, 0, 0.9)"
        },
        grid: {
          vertLines: { color: "#E1ECF2" },
          horzLines: { color: "#E1ECF2" }
        },
        crosshair: { mode: CrosshairMode.Normal },
        priceScale: { borderColor: "#50535E" },
        timeScale: {
          borderColor: "#50535E",
          timeVisible: true,
          secondsVisible: false,
          barSpacing: 8
        }
      },
      candlestick: {
        upColor: "#26A69A",
        downColor: "#EF5350",
        borderDownColor: "#EF5350",
        borderUpColor: "#26A69A",
        wickDownColor: "#EF5350",
        wickUpColor: "#26A69A",
        priceFormat: {
          type: "price",
          precision: 8,
          minMove: 0.0000001
        }
      },
      histogram: {
        color: "#26a69a",
        lineWidth: 2,
        priceFormat: { type: "volume" },
        overlay: true,
        scaleMargins: { top: 0.8, bottom: 0 },
        lastValueVisible: false,
        priceLineVisible: false
      }
    }
  };

  componentDidMount() {
    this.initializeCandleStickGraph();
    this.initializeMovingAverage();

    this.updateDimensions();
    eventHandler.bind(this._events);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedPair, isFullWidth, isDarkBg } = this.props;
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
    if (prevProps.isDarkBg !== isDarkBg) {
      const theme = isDarkBg ? "dark" : "light";
      this.chart.applyOptions(this.settings[theme].chart);
      this.candleSeries.applyOptions(this.settings[theme].candlestick);
      this.volumeSeries.applyOptions(this.settings[theme].histogram);

      const lableColor = isDarkBg ? "white" : "black";
      this.chartOHLCLabel.style.color = lableColor;
      this.chartMAsLabel.style.color = lableColor;

      const volumeData = this.getVolumeGraphData(this.graphData);
      this.volumeSeries.setData(volumeData);
    }
  }

  componentWillUnmount() {
    eventHandler.unbind(this._events);
    this.chart.unsubscribeVisibleTimeRangeChange(
      this.handleVisibleTimeRangeChange
    );
    this.chart.unsubscribeCrosshairMove(this.handleCrosshairMove);

    if (this.selectedPairId && this.timeIntervalId) {
      ws.leaveChannel(
        "CandleStickGraph." + this.selectedPairId + "." + this.timeIntervalId
      );
    }
  }

  initializeCandleStickGraph = () => {
    const { isDarkBg } = this.props;
    this.chart = createChart(
      this._id.current,
      this.settings[isDarkBg ? "dark" : "light"].chart
    );

    /**
     * CandleStick chart setup
     */
    this.candleSeries = this.chart.addCandlestickSeries(
      this.settings.dark.candlestick
    );

    this.candleSeries.setData(candleChartdData);

    /**
     * Volume chart setup
     */
    this.volumeSeries = this.chart.addHistogramSeries(
      this.settings.dark.histogram
    );

    /**
     * Create chart label (OHLC)
     */
    // document.body.style.position = "relative";

    const legend = document.createElement("div");
    // legend.style.cssText = "position: absolute; left: 3px; top: 0; z-index: 1; font-size: 12px; line-height: 18px; font-weight: 300;";
    legend.setAttribute(
      "style",
      "position: absolute; left: 3px; top: 0; z-index: 1; font-size: 12px; line-height: 11px; font-weight: 300;"
    );
    // document.body.appendChild(legend);
    this._id.current.appendChild(legend);

    const lableColor = isDarkBg ? "white" : "black";

    this.chartOHLCLabel = document.createElement("div");
    this.chartOHLCLabel.innerText = "O H L C";
    this.chartOHLCLabel.style.color = lableColor;
    legend.appendChild(this.chartOHLCLabel);

    this.chartMAsLabel = document.createElement("div");
    this.chartMAsLabel.innerText = "MovingAverage";
    this.chartMAsLabel.style.color = lableColor;
    legend.appendChild(this.chartMAsLabel);

    this.chart.subscribeVisibleTimeRangeChange(
      this.handleVisibleTimeRangeChange
    );
    // this.chart.subscribeClick(function(param) {
    //   debug.log("inside subscribeClick");
    //   debug.log(param);
    // });
    this.chart.subscribeCrosshairMove(this.handleCrosshairMove);
  };
  formatDateTime = dateTime => {
    if (typeof dateTime === "object") {
      const { day, month, year } = dateTime;
      dateTime = year.toString();
      dateTime +=
        "-" + (month.toString().length < 2 ? "0" + month.toString() : month);
      dateTime +=
        "-" + (day.toString().length < 2 ? "0" + day.toString() : day);
    }
    return dateTime;
  };

  initializeMovingAverage = () => {
    const options = {
      // color: "rgba(67, 83, 254, 1)",
      lineWidth: 1,
      lastValueVisible: false,
      priceLineVisible: false
    };

    this.movingAverage.forEach(ma => {
      ma.lineSeries = this.chart.addLineSeries({ ...options, color: ma.color });
    });
  };

  handleVisibleTimeRangeChange = param => {
    if (param === null) return;
    let from = param.from;

    // from = { day: 1, month: 2, year: 2018 };

    // debug.log(typeof from);
    // debug.log(from);
    from = this.formatDateTime(from);
    // debug.log("from & to after alteration");
    // debug.log(from);

    if (
      this.isRequested === false &&
      this.isFullHistoryLoaded === false &&
      this.graphData.length &&
      from <= this.graphData[0].time
    )
      this.handleGraph(this.graphData[0].time);

    // debug.log("this.chart.timeScale().getVisibleRange()");
    // debug.log(this.chart.timeScale().getVisibleRange());
  };
  handleCrosshairMove = param => {
    if (param.time) {
      // Get hovered candle OHLC
      const price = param.seriesPrices.get(this.candleSeries);

      // Populate hovered candle OHLC in chart label
      this.chartOHLCLabel.innerHTML = this.getOHLCLabelText({
        ...price,
        time: param.time
      });

      // Populate hovered candle MAs in chart label
      this.chartMAsLabel.innerHTML = this.getMovingAverageLabelText(param);
    } else if (Object.keys(this.graphData).length) {
      // Populate last candle OHLC in chart lebel, if candle doesn't exist at mouseover
      this.chartOHLCLabel.innerHTML = this.getOHLCLabelText(
        this.graphData[this.graphData.length - 1]
      );

      // Populate last candle MAs in chart lebel, if candle doesn't exist at mouseover
      this.chartMAsLabel.innerHTML = this.getMovingAverageLabelText();
    }
  };

  getOHLCLabelText = ({ open, high, low, close, time }) => {
    // this.chartOHLCLabel.style.color = open > close ? "#EF5350" : "#26A69A";
    const color = open > close ? "#EF5350" : "#26A69A";
    return `${moment(time * 1000)
      .utc()
      .format("YYYY-MM-DD HH:mm")} O:<span style="color: ${color}">${open &&
      open.toFixed(8)}</span> H:<span style="color: ${color}">${high &&
      high.toFixed(8)}</span> L:<span style="color: ${color}">${low &&
      low.toFixed(8)}</span> C:<span style="color: ${color}">${close &&
      close.toFixed(8)}</span>`;
  };
  getMovingAverageLabelText = param => {
    return this.movingAverage.map(ma => {
      // Get hovered candle Moving Average
      // const maCurrent = param.seriesPrices.get(ma.lineSeries);
      const maCurrent =
        param !== undefined
          ? param.seriesPrices.get(ma.lineSeries)
          : ma.data.length
          ? ma.data[ma.data.length - 1].value
          : 0;
      return ` <span style="color: ${ma.color}">MA(${ma.period}): ${maCurrent &&
        maCurrent.toFixed(8)}</span>`;
    });
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

  handleGraph = async (from = null) => {
    this.isRequested = true;
    this.selectedPairId = this.props.selectedPair.id;

    try {
      const { history, time_interval_id } = await trade.getChartTradeHistory(
        this.selectedPairId,
        this.state.timeInterval,
        from
      );

      this.isFullHistoryLoaded = history.length === 0;
      this.timeIntervalId = time_interval_id;
      history.reverse();

      this.graphData = from ? [...history, ...this.graphData] : history;

      /**
       * isRequested is being set as "false" before calling "setData()".
       * Because, "setData()" will update the graph and "subscribeVisibleTimeRangeChange" trigger will be triggered and
       * handle will be called which pull graph history if needed.
       */
      this.isRequested = false;
      this.candleSeries.setData(this.graphData);

      // Populate last candle stats in chart lebel
      this.chartOHLCLabel.innerHTML = this.getOHLCLabelText(
        this.graphData[this.graphData.length - 1]
      );

      const volumeData = this.getVolumeGraphData(this.graphData);
      this.volumeSeries.setData(volumeData);

      this.setMovingAverage();
      // Populate last candle MAs in chart lebel
      this.chartMAsLabel.innerHTML = this.getMovingAverageLabelText();
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        debug.log(ex.response.data);
      }
    }

    this.handleGraphStreem();
  };

  handleGraphStreem = () => {
    ws.channel(
      "CandleStickGraph." + this.selectedPairId + "." + this.timeIntervalId
    ).listen("CandleStickGraphUpdated", e => {
      const indexOfLastCandle = this.graphData.length - 1;

      // if (this.graphData[indexOfLastCandle].time === e.candleStickData.time) {
      //   this.graphData[indexOfLastCandle] = e.candleStickData;
      // } else {
      //   this.graphData.push(e.candleStickData);
      // }
      if (
        this.graphData.length === 0 ||
        this.graphData[indexOfLastCandle].time !== e.candleStickData.time
      ) {
        this.graphData.push(e.candleStickData);
      } else {
        this.graphData[indexOfLastCandle] = e.candleStickData;
      }

      this.candleSeries.setData(this.graphData);

      const volumeData = this.getVolumeGraphData(this.graphData);
      this.volumeSeries.setData(volumeData);

      // this.setMovingAverage();
      this.updateMovingAverage(e.candleStickData);

      /**
       * Label should be updated if and only if mouse is not hovered on chart
       */
      // Populate last candle MAs in chart lebel
      this.chartMAsLabel.innerHTML = this.getMovingAverageLabelText();
    });
  };

  getVolumeGraphData = graphData => {
    const { isDarkBg } = this.props;
    return graphData.map((c, i) => ({
      time: c.time,
      value: c.volume,
      // color: c.open > c.close ? "rgb(244,193,198)" : "rgb(195,231,213)"
      color: isDarkBg
        ? c.open > c.close
          ? "#83363C"
          : "#2B5E5E"
        : c.open > c.close
        ? "rgb(244,193,198)"
        : "rgb(195,231,213)"
    }));
  };

  calculateMovingAverage = (history, candleIndex, ma) => {
    if (candleIndex < ma.period) return 0;
    let sum = 0;
    // for (let i = candleIndex - 1; i >= candleIndex - ma.period; i--)
    for (let i = candleIndex - ma.period; i < candleIndex; i++)
      sum += history[i][ma.type];
    return sum / ma.period;
  };
  getMovingAverageData = (history, ma) => {
    // return history.map(c => ({ time: c.time, value: c.open }));
    return history.map((candle, candleIndex) => {
      const value = this.calculateMovingAverage(history, candleIndex, ma);
      return { time: candle.time, value };
    });
  };
  setMovingAverage = () => {
    this.movingAverage.forEach(ma => {
      ma.data = this.getMovingAverageData(this.graphData, ma);
      ma.lineSeries.setData(ma.data);
    });
  };
  updateMovingAverage = candleStickData => {
    this.movingAverage.forEach(ma => {
      const value = this.calculateMovingAverage(
        this.graphData,
        this.graphData.length - 1,
        ma
      );

      const indexOfLastCandle = ma.data.length - 1;

      // if (ma.data[indexOfLastCandle].time === candleStickData.time) {
      //   ma.data[indexOfLastCandle].value = value;
      // } else {
      //   ma.data.push({ time: candleStickData.time, value });
      // }
      if (
        ma.data.length === 0 ||
        ma.data[indexOfLastCandle].time !== candleStickData.time
      ) {
        ma.data.push({ time: candleStickData.time, value });
      } else {
        ma.data[indexOfLastCandle].value = value;
      }

      ma.lineSeries.setData(ma.data);
    });
  };

  handleChange = ({ currentTarget: input }) => {
    this.setState({ timeInterval: input.value });
  };

  createToolbarButton = (timeInterval, selectedTimeInterval) => {
    return (
      <button
        className={
          timeInterval === selectedTimeInterval ? "selected-interval" : ""
        }
        value={timeInterval}
        onClick={this.handleChange}
        type="button"
      >
        {timeInterval}
      </button>
    );
  };

  render() {
    const { timeInterval, isTvFullWidth } = this.state;
    const { spinnerStatus } = this.props;
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
                    : this.minIntervals[0]}
                </button>
                <ul className="dropdown-menu">
                  {this.minIntervals.map(i => (
                    <li key={i}>{this.createToolbarButton(i, timeInterval)}</li>
                  ))}
                </ul>
              </div>

              {this.createToolbarButton("1H", timeInterval)}
              {this.createToolbarButton("1D", timeInterval)}
              {this.createToolbarButton("1W", timeInterval)}
              {this.createToolbarButton("1M", timeInterval)}

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
          <div ref={this._id} style={{ position: "relative" }}>
            <Spinner status={spinnerStatus} />
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
