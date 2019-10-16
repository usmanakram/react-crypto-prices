import React from "react";
import { Link } from "react-router-dom";

const CurrencyRate = ({ selectedPairStats }) => {
  return (
    <div className="section-padding-50">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="currency-rate">
              <div className="currency-convert">
                <div className="dropdown">
                  <button
                    className="btn dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    BTC / USD
                  </button>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <Link className="dropdown-item" to="#">
                      BTC / USD
                    </Link>
                    <Link className="dropdown-item" to="#">
                      USD / BTC
                    </Link>
                    <Link className="dropdown-item" to="#">
                      BTC / USD
                    </Link>
                  </div>
                </div>
              </div>
              <div className="update-rate">
                <div className="currency-info last-price">
                  <span>Last Price</span>
                  <h6>
                    <span className="color-sell">
                      {Object.keys(selectedPairStats).length > 0 &&
                        selectedPairStats.last_price}
                    </span>
                    <span className="currency-info-base">$390.68</span>
                  </h6>
                </div>
                <div className="currency-info change">
                  <span>24h Change</span>
                  <h6 className="color-buy">
                    0.001447 <sub className="transmoney-value">+3.05</sub>
                  </h6>
                </div>
                <div className="currency-info high">
                  <span>24h High</span>
                  <h6 className="currency-info-base">0.060069</h6>
                </div>
                <div className="currency-info low">
                  <span>24h Low</span>
                  <h6 className="currency-info-base">0.056864</h6>
                </div>
                <div className="currency-info volume-value">
                  <span>24h Volume</span>
                  <h6 className="currency-info-base">
                    {Object.keys(selectedPairStats).length > 0 &&
                      selectedPairStats.volume}{" "}
                    BTC
                  </h6>
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
