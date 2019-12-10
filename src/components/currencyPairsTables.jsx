import React from "react";
import { exchangeRightTopValues } from "../services/fakeExchange";

const CurrencyPairsTables = () => {
  return (
    <div className="tab-content">
      <div
        role="tabpanel"
        className="tab-pane fade in active show das-market-tab-pane"
        id="favorite_ticker"
      >
        <table className="table das-oreder-table table-hover exchange-orderBook">
          {/* <table className="table coin-list table-hover das-market-table"> */}
          <thead>
            <tr>
              <th></th>
              <th scope="col">Pair</th>
              <th scope="col">Price</th>
              <th scope="col">Change</th>
            </tr>
          </thead>
          {/* <tbody>
            {exchangeRightTopValues.map(value => (
              <tr key={value.price}>
                <td>
                  <div className="favorite-coin"></div>
                </td>
                <td>{value.pair}</td>
                <td>
                  <span className={value.color1}>{value.price}</span>
                </td>
                <td>
                  <span className={value.color2}>{value.change}</span>
                </td>
              </tr>
            ))}
          </tbody> */}
        </table>
      </div>
      <div
        role="tabpanel"
        className="tab-pane fade das-market-tab-pane"
        id="USDT"
      >
        <table className="table das-oreder-table table-hover exchange-orderBook">
          {/* <table className="table coin-list table-hover das-market-table"> */}
          <thead>
            <tr>
              <th></th>
              <th scope="col">Pair</th>
              <th scope="col">Price</th>
              <th scope="col">Change</th>
            </tr>
          </thead>
          <tbody>
            {exchangeRightTopValues.map(value => (
              <tr key={value.price}>
                <td>
                  <div className="favorite-coin"></div>
                </td>
                <td>{value.pair}</td>
                <td>
                  <span className={value.color1}>{value.price}</span>
                </td>
                <td>
                  <span className={value.color2}>{value.change}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        role="tabpanel"
        className="tab-pane fade das-market-tab-pane"
        id="BTC"
      >
        <table className="table das-oreder-table table-hover exchange-orderBook">
          {/* <table className="table coin-list table-hover das-market-table"> */}
          <thead>
            <tr>
              <th></th>
              <th scope="col">Pair</th>
              <th scope="col">Price</th>
              <th scope="col">Change</th>
            </tr>
          </thead>
          <tbody>
            {exchangeRightTopValues.map(value => (
              <tr key={value.price}>
                <td>
                  <div className="favorite-coin"></div>
                </td>
                <td>{value.pair}</td>
                <td>
                  <span className={value.color1}>{value.price}</span>
                </td>
                <td>
                  <span className={value.color2}>{value.change}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrencyPairsTables;
