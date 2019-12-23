import React from "react";
import TradingViewWidget from "./tradingViewWidget";
import DepthChartWidget from "./depthChartWidget";
import ExchangeOrderArea from "./exchangeOrderArea";
import ExchangeTradingHistory from "./exchangeTradingHistory";
import OrderBook from "./orderBook";
import CurrencyPairs from "./currencyPairs";

const ExchangeBody = ({
  currencyPairs,
  selectedPair,
  selectedPairStats,
  quoteCurrencyBalance,
  baseCurrencyBalance,
  isFullWidth
}) => {
  return (
    <div className="dashboard-block dashboard-white">
      <div className="container">
        <div className="dashboard-body">
          <div className="row">
            <div className="col-lg-3 leftSideBar">
              <OrderBook
                selectedPair={selectedPair}
                selectedPairStats={selectedPairStats}
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
                      href="#trading_view"
                      role="tab"
                      data-toggle="tab"
                    >
                      <h5>TraradingView</h5>
                    </a>
                  </li>
                  {/* <li className="nav-item">
                    <a
                      className="nav-link"
                      href="#depth-chart"
                      role="tab"
                      data-toggle="tab"
                    >
                      <h5>DepthChart</h5>
                    </a>
                  </li> */}
                </ul>
              </div>
              <div className="tab-content">
                <div
                  role="tabpanel"
                  className="tab-pane fade in active show"
                  id="trading_view"
                >
                  <TradingViewWidget
                    selectedPair={selectedPair}
                    isFullWidth={isFullWidth}
                  />
                </div>
                <div role="tabpanel" className="tab-pane fade" id="depth-chart">
                  <DepthChartWidget />
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
};

export default ExchangeBody;
