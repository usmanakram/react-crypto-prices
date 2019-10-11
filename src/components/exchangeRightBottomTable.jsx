import React, { Component } from "react";
import { exchangeRightBottomValues } from "../services/fakeExchange";

class ExchangeRightBottomTable extends Component {
  state = {};

  componentDidMount() {
    window.$(".dashboard-ticker-block-four").slimScroll({
      height: "570px"
    });
  }
  render() {
    return (
      <div className="order-history-block">
        <div className="panel-heading-block">
          <h5>Order History</h5>
        </div>
        <div className="order-history-block-inner dashboard-ticker-block-four">
          <div className="history-table-wrap">
            <table className="table coin-list table-hover history-table">
              <thead>
                <tr>
                  <th scope="col">Price(BTC)</th>
                  <th scope="col">AMT(ETH)</th>
                  <th scope="col">Time</th>
                </tr>
              </thead>
              <tbody>
                {exchangeRightBottomValues.map(value => (
                  <tr key={value.price_BTC}>
                    <td>
                      <span className={value.classes}>{value.price_BTC}</span>
                    </td>
                    <td>{value.amt_ETH}</td>
                    <td>{value.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default ExchangeRightBottomTable;
