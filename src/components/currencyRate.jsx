import React from "react";
import { Link } from "react-router-dom";
const CurrencyRate = ({
  iconChange,
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
                      c =>
                        c.id === selectedPair.id || (
                          <Link
                            key={c.id}
                            className="dropdown-item"
                            to={`/exchange/${c.symbol}`}
                          >
                            {c.base_currency_symbol} / {c.quote_currency_symbol}
                          </Link>
                        )
                    )}
                  </div>
                </div>
              </div>
              <div className="update-rate">
                <div className="currency-info last-price text-center">
                  <span>Last Price</span>
                  <h6>
                    <span className="color-sell">{last_price}</span>
                    {/* <span className="currency-info-base">$390.68</span> */}
                  </h6>
                </div>
                <div className="currency-info change">
                  <span>24h Change</span>
                  <h6 className="color-buy">
                    {price_change} <sub className="transmoney-value">+3.05</sub>
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
                <div className="currency-info volume-value text-center">
                  <span>24h Volume</span>
                  <h6 className="currency-info-base">
                    {volume} {selectedPair.quote_currency_symbol}
                  </h6>
                </div>
                <div className="currency-info volume-value my-3 ">
                  <i
                    className={iconChange}
                    onClick={onBgChangeRequest}
                    style={{ color: "#a2a2a2" }}
                  ></i>
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
