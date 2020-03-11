import React from "react";
import LimitOrder from "./limitOrder";
import InstantOrder from "./instantOrder";
import StopLimit from "./stopLimit";
import Oco from "./oco";

const ExchangeOrderArea = ({
  selectedPair,
  selectedPairStats,
  quoteCurrencyBalance,
  baseCurrencyBalance,
  spinnerStatus
}) => {
  window.$(function() {
    window.$('[data-toggle="popover"]').popover({
      trigger: "hover"
    });
  });

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
            <h5>Market order</h5>
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="#stop-limit"
            role="tab"
            data-toggle="tab"
          >
            <h5>Stop Limit</h5>{" "}
            <span
              data-toggle="popover"
              data-container="body"
              data-content=" A Stop-Limit order is an order to buy or sell a coin
              once the price reaches a specified price."
              data-placement="bottom"
            >
              {" "}
              <i className="fa fa-question-circle" aria-hidden="true"></i>
            </span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#oco" role="tab" data-toggle="tab">
            <h5>OCO</h5>{" "}
            <span
              data-toggle="popover"
              data-container="body"
              data-content="OCO order: To place a stop-limit order and a limit
                    order at the same time. When either of the order pairs is triggered, the
                    other order will be cancelled. And if either of the order pairs is
                    cancelled, the other order will be cancelled, too."
              data-placement="bottom"
            >
              {" "}
              <i className="fa fa-question-circle" aria-hidden="true"></i>
            </span>
          </a>
        </li>
      </ul>
      <div className="market-ticker-block">
        {/* <!-- Tab panes --> */}
        <div className="tab-content">
          <LimitOrder
            selectedPair={selectedPair}
            quoteCurrencyBalance={quoteCurrencyBalance}
            baseCurrencyBalance={baseCurrencyBalance}
            spinnerStatus={spinnerStatus}
          />
          <InstantOrder
            selectedPair={selectedPair}
            selectedPairStats={selectedPairStats}
            quoteCurrencyBalance={quoteCurrencyBalance}
            baseCurrencyBalance={baseCurrencyBalance}
          />
          <StopLimit
            selectedPairStats={selectedPairStats}
            selectedPair={selectedPair}
            quoteCurrencyBalance={quoteCurrencyBalance}
            baseCurrencyBalance={baseCurrencyBalance}
          />
          <Oco
            selectedPairStats={selectedPairStats}
            selectedPair={selectedPair}
            quoteCurrencyBalance={quoteCurrencyBalance}
            baseCurrencyBalance={baseCurrencyBalance}
          />
        </div>
      </div>
    </div>
  );
};

export default ExchangeOrderArea;
