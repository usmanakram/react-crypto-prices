import React from "react";
import { Link } from "react-router-dom";
import { handleWidth } from "../services/custom";
const CurrencyRate = ({
  darkBg,
  onBgChangeRequest,
  selectedPair,
  currencyPairs,
  selectedPairStats: { volume, last_price, low, high, price_change }
}) => {
  return (
    <div className="section-padding-50">
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
                            {p.base_currency_symbol} / {p.quote_currency_symbol}
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
                    <span className="color-sell">{last_price}</span>
                    {/* <span className="currency-info-base">$390.68</span> */}
                  </h6>
                </div>
                <div className="currency-info change">
                  <span>24h Change</span>
                  <h6
                    className={
                      price_change && parseFloat(price_change) > 0
                        ? "color-buy"
                        : "color-sell"
                    }
                  >
                    {price_change && parseFloat(price_change).toFixed(8)}{" "}
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
                        darkBg ? "fa fa-sun" : "fa fa-star"
                      }`}
                      onClick={onBgChangeRequest}
                      style={{ color: "#a2a2a2" }}
                    ></i>
                  </span>

                  {/* <i
                    className="fa fa-arrows-alt"
                    aria-hidden="true"
                    onClick={handleWidth}
                    style={{ color: "#a2a2a2" }}
                  ></i> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyRate;
