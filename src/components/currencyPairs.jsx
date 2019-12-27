import React, { Component } from "react";
import CurrencyPairsTables from "./currencyPairsTables";

class CurrencyPairs extends Component {
  state = {};

  render() {
    const { currencyPairs } = this.props;
    const quoteCurrencies = [
      ...new Set(currencyPairs.map(p => p.quote_currency_symbol))
    ].sort();

    return (
      <div className="das-market-block">
        <div className="new-ticker-block market-new-ticker-block">
          <div className="ticker-head">
            <ul
              className="nav nav-tabs ticker-nav parent-order-tab"
              role="tablist"
            >
              <li className="nav-item">
                <a
                  className="nav-link currancy-pair-pad"
                  href="#favorite_ticker"
                  role="tab"
                  data-toggle="tab"
                >
                  Favorites
                </a>
              </li>
              {quoteCurrencies.map((c, i) => (
                <li key={c} className="nav-item">
                  <a
                    className={`nav-link currancy-pair-pad ${
                      i === 0 ? "active" : ""
                    }`}
                    href={`#${c}`}
                    role="tab"
                    data-toggle="tab"
                  >
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="market-ticker-block">
            <CurrencyPairsTables currencyPairs={currencyPairs} />
          </div>
        </div>
      </div>
    );
  }
}

export default CurrencyPairs;
