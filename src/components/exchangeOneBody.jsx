import React from "react";
import OrderBook2 from "./orderBook2";
import TradingViewWidget from "./tradingViewWidget";
import ExchangeRightSideBar from "./exchangeRightSideBar";
// import DepthChartWidget from "./depthChartWidget";
import ExchangeOrderArea from "./exchangeOrderArea";
const ExchangeOneBody = ({
  selectedPair,
  orderBookData,
  tradeHistory,
  onOrderBookUpdate,
  onTrade
}) => {
  return (
    <div className="dashboard-block dashboard-white">
      <div className="container">
        <div className="dashboard-body">
          <div className="row">
            <div className="col-lg-3">
              <OrderBook2
                selectedPair={selectedPair}
                orderBookData={orderBookData}
                onOrderBookUpdate={onOrderBookUpdate}
              />
            </div>

            <div className="col-lg-6">
              <div className="exchange-chart-block">
                <TradingViewWidget />
                {/* <DepthChartWidget /> */}
              </div>
              <ExchangeOrderArea
                selectedPair={selectedPair}
                onTrade={onTrade}
              />
            </div>

            <div className="col-lg-3">
              <ExchangeRightSideBar tradeHistory={tradeHistory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeOneBody;
