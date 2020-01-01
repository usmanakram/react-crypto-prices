import React, { Component } from "react";
import TradingViewWidget from "./tradingViewWidget";
import DepthChartWidget from "./depthChartWidget";
import ExchangeOrderArea from "./exchangeOrderArea";
import ExchangeTradingHistory from "./exchangeTradingHistory";
import OrderBook from "./orderBook";
import CurrencyPairs from "./currencyPairs";
import trade from "../services/tradeService";
import ws from "../services/webSocketService";

class ExchangeBody extends Component {
  state = {
    orderBookData: {
      buyOrders: [],
      sellOrders: []
    },
    spinnerStatus: false
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
        console.log(ex.response.data);
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
      isFullWidth
    } = this.props;

    const { orderBookData, spinnerStatus } = this.state;

    return (
      <div className="dashboard-block dashboard-white">
        <div className={isFullWidth ? "container-fluid" : "container"}>
          <div className="dashboard-body">
            <div className="row">
              <div className="col-lg-3 leftSideBar">
                <OrderBook
                  selectedPair={selectedPair}
                  selectedPairStats={selectedPairStats}
                  orderBookData={orderBookData}
                  spinnerStatus={spinnerStatus}
                />
              </div>

              <div className="col-lg-6 tv-oa-lr ">
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
                        <h5>TraradingView</h5>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="#depth-chart"
                        role="tab"
                        data-toggle="tab"
                      >
                        <h5>DepthChart</h5>
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
                />
              </div>

              <div className="col-lg-3 righSideBar">
                <CurrencyPairs currencyPairs={currencyPairs} />
                <ExchangeTradingHistory selectedPair={selectedPair} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExchangeBody;
