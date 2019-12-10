import React from "react";
import TradingViewWidget from "./tradingViewWidget";
import DepthChartWidget from "./depthChartWidget";
import ExchangeOrderArea from "./exchangeOrderArea";
import ExchangeTradingHistory from "./exchangeTradingHistory";
import OrderBook from "./orderBook";
// import CurrencyPairs from "./currencyPairs";

const ExchangeBody = ({
  // currencyPairs,
  selectedPair,
  selectedPairStats,
  orderBookData,
  tradeHistory,
  onOrderBookUpdate,
  onTrade,
  quoteCurrencyBalance,
  baseCurrencyBalance,
  onTradeHistoryUpdate,
  status
}) => {
  return (
    <div className="dashboard-block dashboard-white">
      <div className="container">
        <div className="dashboard-body">
          <div className="row">
            <div className="col-lg-3 orderBook-right">
              <OrderBook
                status={status}
                selectedPair={selectedPair}
                selectedPairStats={selectedPairStats}
                orderBookData={orderBookData}
                onOrderBookUpdate={onOrderBookUpdate}
              />
            </div>

            <div className="col-lg-6">
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
                  <TradingViewWidget selectedPair={selectedPair} />
                </div>
                <div role="tabpanel" className="tab-pane fade" id="depth-chart">
                  <DepthChartWidget />
                </div>
              </div>
              <ExchangeOrderArea
                selectedPair={selectedPair}
                selectedPairStats={selectedPairStats}
                onTrade={onTrade}
                baseCurrencyBalance={baseCurrencyBalance}
                quoteCurrencyBalance={quoteCurrencyBalance}
              />
            </div>

            <div className="col-lg-3 tradeHistory-left">
              {/* <CurrencyPairs currencyPairs={currencyPairs} /> */}
              <ExchangeTradingHistory
                status={status}
                selectedPair={selectedPair}
                tradeHistory={tradeHistory}
                onTradeHistoryUpdate={onTradeHistoryUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeBody;
