import React, { Component } from "react";
import CurrencyPairsTables from "./currencyPairsTables";

class CurrencyPairs extends Component {
  state = {};

  componentDidMount() {
    window.$(".currencyPairScroll").slimScroll({
      height: "130px"
    });
  }

  render() {
    const { currencyPairs } = this.props;
    const quoteCurrencies = [
      ...new Set(currencyPairs.map(p => p.quote_currency_symbol))
    ];

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
                  className="nav-link active currancy-pair-pad"
                  href="#favorite_ticker"
                  role="tab"
                  data-toggle="tab"
                >
                  <i className="far fa-star"></i>
                  <h5>Favorites</h5>
                </a>
              </li>
              {quoteCurrencies.map(c => (
                <li key={c} className="nav-item">
                  <a
                    className="nav-link currancy-pair-pad"
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
          <div className="market-ticker-block currencyPairScroll">
            <CurrencyPairsTables currencyPairs={currencyPairs} />
          </div>
        </div>
      </div>
    );
  }
}

export default CurrencyPairs;
