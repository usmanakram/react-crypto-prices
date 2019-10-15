import React from "react";
import LimitOrder from "./limitOrder";
import InstantOrder from "./instantOrder";

const ExchangeOrderArea = ({
  selectedPair,
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
            <h5>Instant order</h5>
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
            baseCurrencyBalance={quoteCurrencyBalance}
          />
          <InstantOrder
            selectedPair={selectedPair}
            onTrade={onTrade}
            quoteCurrencyBalance={quoteCurrencyBalance}
            baseCurrencyBalance={quoteCurrencyBalance}
          />
        </div>
      </div>
    </div>
  );
};

export default ExchangeOrderArea;
