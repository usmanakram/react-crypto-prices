import React from "react";
import OrderBook2 from "./orderBook2";
import TradingViewWidget from "./tradingViewWidget";
import ExchangeRightSideBar from "./exchangeRightSideBar";
// import DepthChartWidget from "./depthChartWidget";
import ExchangeOrderArea from "./exchangeOrderArea";
const ExchangeOneBody = ({
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
            <div className="col-lg-3">
              <OrderBook2
                status={status}
                selectedPair={selectedPair}
                selectedPairStats={selectedPairStats}
                orderBookData={orderBookData}
                onOrderBookUpdate={onOrderBookUpdate}
              />
            </div>

            <div className="col-lg-6">
              <div className="exchange-chart-block">
                <TradingViewWidget selectedPair={selectedPair} />

                {/* <DepthChartWidget /> */}
              </div>
              <ExchangeOrderArea
                selectedPair={selectedPair}
                selectedPairStats={selectedPairStats}
                onTrade={onTrade}
                baseCurrencyBalance={baseCurrencyBalance}
                quoteCurrencyBalance={quoteCurrencyBalance}
              />
            </div>

            <div className="col-lg-3">
              <ExchangeRightSideBar
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

export default ExchangeOneBody;
