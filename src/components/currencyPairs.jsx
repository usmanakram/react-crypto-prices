import React, { Component } from "react";
import CurrencyPairsTables from "./currencyPairsTables";

class CurrencyPairs extends Component {
  state = {};

  componentDidMount() {
    window.$(".dashboard-ticker-block-three").slimScroll({
      height: "570px"
    });
  }

  render() {
    const { currencyPairs } = this.props;
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
              {currencyPairs.map(c => (
                <li key={c.id} className="nav-item">
                  <a
                    className="nav-link currancy-pair-pad"
                    href={`#${c.quote_currency_symbol}`}
                    role="tab"
                    data-toggle="tab"
                  >
                    {c.quote_currency_symbol}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="market-ticker-block dashboard-ticker-block-three">
            <CurrencyPairsTables />
          </div>
        </div>
      </div>
    );
  }
}

export default CurrencyPairs;
