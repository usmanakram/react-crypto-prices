import React from "react";
import LimitOrder from "./limitOrder";
import InstantOrder from "./instantOrder";
import StopLimit from "./stopLimit";

const ExchangeOrderArea = ({
  selectedPair,
  selectedPairStats,
  onTrade,
  quoteCurrencyBalance,
  baseCurrencyBalance
}) => {
  return (
    <div className="order-form-area-block">
      <ul className="nav nav-tabs ticker-nav parent-order-tab" role="tablist">
        <li className="nav-item">
          <a
            className="nav-link active"
            href="#limit_order"
            role="tab"
            data-toggle="tab"
          >
            <h5>Limit order</h5>
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="#instant_order"
            role="tab"
            data-toggle="tab"
          >
            <h5>Markit order</h5>
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="#stop-limit"
            role="tab"
            data-toggle="tab"
          >
            <h5>Stop Limit</h5>
          </a>
        </li>
      </ul>
      <div className="market-ticker-block">
        {/* <!-- Tab panes --> */}
        <div className="tab-content">
          <LimitOrder
            selectedPair={selectedPair}
            onTrade={onTrade}
            quoteCurrencyBalance={quoteCurrencyBalance}
            baseCurrencyBalance={baseCurrencyBalance}
          />
          <InstantOrder
            selectedPair={selectedPair}
            selectedPairStats={selectedPairStats}
            onTrade={onTrade}
            quoteCurrencyBalance={quoteCurrencyBalance}
            baseCurrencyBalance={baseCurrencyBalance}
          />
          <StopLimit
            selectedPair={selectedPair}
            onTrade={onTrade}
            quoteCurrencyBalance={quoteCurrencyBalance}
            baseCurrencyBalance={baseCurrencyBalance}
          />
        </div>
      </div>
    </div>
  );
};

export default ExchangeOrderArea;
