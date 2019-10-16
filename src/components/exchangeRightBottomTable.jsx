import React, { Component } from "react";
import moment from "moment";
import { exchangeRightBottomValues } from "../services/fakeExchange";
import Spinner from "./spinner";
import ws from "../services/webSocketService";

class ExchangeRightBottomTable extends Component {
  state = {};

  tradeHistoryPairId = 0;

  componentDidMount() {
    window.$(".dashboard-ticker-block-four").slimScroll({
      height: "570px"
    });
  }

  handleTradeHistoryStream = () => {
    const { selectedPair } = this.props;

    if (
      Object.keys(selectedPair).length &&
      this.tradeHistoryPairId !== selectedPair.id
    ) {
      this.tradeHistoryPairId = selectedPair.id;

      ws.channel("TradeHistory." + this.tradeHistoryPairId).listen(
        "TradeHistoryUpdated",
        e => {
          this.props.onTradeHistoryUpdate(e.tradeHistory);
        }
      );
    }
  };

  render() {
    const { selectedPair, tradeHistory } = this.props;

    this.handleTradeHistoryStream();

    return (
      <div className="order-history-block">
        <div className="panel-heading-block">
          <h5>Trade History</h5>
        </div>
        <div className="order-history-block-inner dashboard-ticker-block-four">
          <div className="history-table-wrap">
            {tradeHistory == 0 && <Spinner />}
            <table className="table coin-list table-hover history-table">
              <thead>
                <tr>
                  <th scope="col">
                    Price({selectedPair.quote_currency_symbol})
                  </th>
                  <th scope="col">Qty({selectedPair.base_currency_symbol})</th>
                  <th scope="col">Time</th>
                </tr>
              </thead>

              <tbody>
                {tradeHistory.map((value, i) => (
                  <tr key={value.id}>
                    <td>
                      <span
                        className={
                          tradeHistory[i + 1] &&
                          tradeHistory[i + 1].rate > value.rate
                            ? "color-sell"
                            : tradeHistory[i + 1] &&
                              tradeHistory[i + 1].rate < value.rate
                            ? "color-buy"
                            : "color"
                        }
                      >
                        {value.rate}
                      </span>
                    </td>
                    <td>{value.quantity}</td>
                    <td>{moment(value.created_at).format("HH:mm:ss")}</td>
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
