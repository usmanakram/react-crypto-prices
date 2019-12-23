import React, { Component } from "react";
import { Link } from "react-router-dom";

class CurrencyRate extends Component {
  render() {
    const {
      darkBg,
      onBgChangeRequest,
      isFullWidth,
      onWidthChange,
      selectedPair,
      currencyPairs,
      selectedPairStats: { volume, last_rate, low, high, rate_change }
    } = this.props;
    return (
      <div className="currancy-rate-tb">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="currency-rate latest-tranjections-block-inner">
                <div className="currency-convert">
                  <div className="dropdown">
                    <button
                      // className="btn dropdown-toggle"
                      className="btn"
                      type="button"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {selectedPair.base_currency_symbol} /{" "}
                      {selectedPair.quote_currency_symbol}
                    </button>{" "}
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      {currencyPairs.map(
                        p =>
                          p.symbol === selectedPair.symbol || (
                            <Link
                              key={p.id}
                              className="dropdown-item"
                              to={`/exchange/${p.symbol}`}
                            >
                              {p.base_currency_symbol} /{" "}
                              {p.quote_currency_symbol}
                            </Link>
                          )
                      )}
                    </div>
                  </div>
                </div>
                <div className="update-rate">
                  <div className="currency-info last-price">
                    <span>Last Price</span>
                    <h6>
                      <span className="color-sell">{last_rate}</span>
                      {/* <span className="currency-info-base">$390.68</span> */}
                    </h6>
                  </div>
                  <div className="currency-info change">
                    <span>24h Change</span>
                    <h6
                      className={
                        rate_change && parseFloat(rate_change) > 0
                          ? "color-buy"
                          : "color-sell"
                      }
                    >
                      {rate_change && parseFloat(rate_change).toFixed(8)}{" "}
                      {/* <sub className="transmoney-value">+3.05</sub> */}
                    </h6>
                  </div>
                  <div className="currency-info high">
                    <span>24h High</span>
                    <h6 className="currency-info-base">{high}</h6>
                  </div>
                  <div className="currency-info low">
                    <span>24h Low</span>
                    <h6 className="currency-info-base">{low}</h6>
                  </div>
                  <div className="currency-info volume-value">
                    <span>24h Volume</span>
                    <h6 className="currency-info-base">
                      {volume} {selectedPair.quote_currency_symbol}
                    </h6>
                  </div>
                  <div className="currency-info volume-value my-2 ">
                    <span title={darkBg ? "Light Mode" : "Dark Mode"}>
                      <i
                        className={`pointer ${
                          darkBg ? "fa fa-sun" : "fa fa-moon"
                        }`}
                        onClick={onBgChangeRequest}
                      ></i>
                    </span>
                  </div>
                  <div className="currency-info volume-value my-2 ">
                    <span title={isFullWidth ? "Normal Screen" : "Full Screen"}>
                      <svg
                        height="25"
                        className={`pointer ${
                          isFullWidth
                            ? "octicon octicon-screen-normal"
                            : "octicon octicon-screen-full"
                        }
                        `}
                        viewBox="0 0 14 16"
                        version="1.1"
                        width="25"
                        color="blue"
                        aria-hidden="true"
                        onClick={onWidthChange}
                      >
                        <path
                          fillRule="evenodd"
                          fill={darkBg ? "lightGrey" : "#1f2738"}
                          d={
                            isFullWidth
                              ? "M2 4H0V3h2V1h1v2c0 .547-.453 1-1 1zm0 8H0v1h2v2h1v-2c0-.547-.453-1-1-1zm9-2c0 .547-.453 1-1 1H4c-.547 0-1-.453-1-1V6c0-.547.453-1 1-1h6c.547 0 1 .453 1 1v4zM9 7H5v2h4V7zm2 6v2h1v-2h2v-1h-2c-.547 0-1 .453-1 1zm1-10V1h-1v2c0 .547.453 1 1 1h2V3h-2z"
                              : "M13 10h1v3c0 .547-.453 1-1 1h-3v-1h3v-3zM1 10H0v3c0 .547.453 1 1 1h3v-1H1v-3zm0-7h3V2H1c-.547 0-1 .453-1 1v3h1V3zm1 1h10v8H2V4zm2 6h6V6H4v4zm6-8v1h3v3h1V3c0-.547-.453-1-1-1h-3z"
                          }
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CurrencyRate;
