import React, { Component } from "react";
import { exchangeRightBottomValues } from "../services/fakeExchange";
import Spinner from "./spinner";

class ExchangeRightBottomTable extends Component {
  state = {};

  componentDidMount() {
    window.$(".dashboard-ticker-block-four").slimScroll({
      height: "570px"
    });
  }
  render() {
    const { tradeHistory } = this.props;

    return (
      <div className="order-history-block">
        <div className="panel-heading-block">
          <h5>Trade History</h5>
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
              {/* {console.log(tradeHistory == 0 ? "ok" : "notOk")} */}

              <tbody>
                {tradeHistory.map((value, i) => (
                  <tr key={value.id}>
                    <td>
                      <span
                        className={
                          tradeHistory[i - 1] &&
                          tradeHistory[i - 1].rate > value.rate
                            ? "color-sell"
                            : "color-buy"
                        }
                      >
                        {value.rate}
                      </span>
                    </td>
                    <td>{value.quantity}</td>
                    <td>{value.created_at}</td>
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