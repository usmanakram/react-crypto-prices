import React, { Component } from "react";
import TradingViewWidget from "./tradingViewWidget";
import DepthChartWidget from "./depthChartWidget";
import ExchangeOrderArea from "./exchangeOrderArea";
import ExchangeTradingHistory from "./exchangeTradingHistory";
import OrderBook from "./orderBook";
import CurrencyPairs from "./currencyPairs";
import trade from "../services/tradeService";
import ws from "../services/webSocketService";
import debug from "../utils/debuger";

class ExchangeBody extends Component {
  state = {
    orderBookData: {
      buyOrders: [],
      sellOrders: [],
    },
    spinnerStatus: false,
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedPair: currentPair } = this.props;
    const { selectedPair: prevPair } = prevProps;

    if (
      Object.keys(currentPair).length &&
      (Object.keys(prevPair).length === 0 || currentPair.id !== prevPair.id)
    ) {
      ws.leaveChannel("OrderBook." + prevPair.id);
      this.setOrderBookData();
    }
  }

  componentWillUnmount() {
    ws.leaveChannel("OrderBook." + this.props.selectedPair.id);
  }

  setOrderBookData = async () => {
    this.setState({ spinnerStatus: true });
    try {
      const orderBookData = await trade.getOrderBook(
        this.props.selectedPair.id
      );

      this.setState({ orderBookData });

      this.setStream();
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        debug.log(ex.response.data);
      }
    }
    this.setState({ spinnerStatus: false });
  };

  setStream = () => {
    ws.channel("OrderBook." + this.props.selectedPair.id).listen(
      "OrderBookUpdated",
      ({ orderBookData }) => {
        this.setState({ orderBookData });
      }
    );
  };

  render() {
    const {
      currencyPairs,
      selectedPair,
      selectedPairStats,
      quoteCurrencyBalance,
      baseCurrencyBalance,
      isFullWidth,
      isDarkBg,
    } = this.props;

    const { orderBookData, spinnerStatus } = this.state;

    return (
      <div className="dashboard-block dashboard-white">
        <div className={isFullWidth ? "container-fluid" : "container"}>
          <div className="dashboard-body">
            <div className="row">
              <div className="col-xl-3 col-lg-12 leftSideBar">
                <OrderBook
                  selectedPair={selectedPair}
                  selectedPairStats={selectedPairStats}
                  orderBookData={orderBookData}
                  spinnerStatus={spinnerStatus}
                />
              </div>

              <div className="col-xl-6 col-lg-12 tv-oa-lr ">
                <div className="ticker-head">
                  <ul
                    className="nav nav-tabs ticker-nav parent-order-tab"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        href="#trading-view"
                        role="tab"
                        data-toggle="tab"
                      >
                        <h5>Trarading View</h5>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#depth-chart"
                        role="tab"
                        data-toggle="tab"
                      >
                        <h5>Depth Chart</h5>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="tab-content">
                  <div
                    role="tabpanel"
                    className="tab-pane fade in active show"
                    id="trading-view"
                  >
                    <TradingViewWidget
                      selectedPair={selectedPair}
                      isFullWidth={isFullWidth}
                      isDarkBg={isDarkBg}
                      spinnerStatus={spinnerStatus}
                    />
                  </div>
                  <div
                    role="tabpanel"
                    className="tab-pane fade"
                    id="depth-chart"
                  >
                    <DepthChartWidget
                      orderBookData={orderBookData}
                      isFullWidth={isFullWidth}
                    />
                  </div>
                </div>
                <ExchangeOrderArea
                  selectedPair={selectedPair}
                  selectedPairStats={selectedPairStats}
                  baseCurrencyBalance={baseCurrencyBalance}
                  quoteCurrencyBalance={quoteCurrencyBalance}
                  spinnerStatus={spinnerStatus}
                />
              </div>

              <div className="col-xl-3 col-lg-12 righSideBar">
                <div className="row">
                  <div className="col-lg-12">
                    <CurrencyPairs
                      currencyPairs={currencyPairs}
                      spinnerStatus={spinnerStatus}
                    />
                  </div>
                  <div className="col-lg-12">
                    <ExchangeTradingHistory
                      selectedPair={selectedPair}
                      selectedPairStats={selectedPairStats}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExchangeBody;
