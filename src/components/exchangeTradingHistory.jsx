import React, { Component } from "react";
// import moment from "moment";
import Spinner from "./spinner";
import trade from "../services/tradeService";
import ws from "../services/webSocketService";
import { setDecimalsLength } from "../utils/setDecimalsLength";

class ExchangeTradingHistory extends Component {
  state = {
    tradeHistory: [],
    spinnerStatus: false
  };
  componentWillUnmount() {
    ws.leaveChannel("TradeHistory." + this.props.selectedPair.id);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedPair: currentPair } = this.props;
    const { selectedPair: prevPair } = prevProps;

    if (
      Object.keys(currentPair).length &&
      (Object.keys(prevPair).length === 0 || currentPair.id !== prevPair.id)
    ) {
      ws.leaveChannel("TradeHistory." + prevPair.id);
      this.setTradeHistory();
    }
  }

  setTradeHistory = async () => {
    this.setState({ spinnerStatus: true });
    try {
      const tradeHistory = await trade.getTradeHistory(
        this.props.selectedPair.id
      );

      this.setState({ tradeHistory });

      this.setStream();
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
    this.setState({ spinnerStatus: false });
  };

  setStream = () => {
    ws.channel("TradeHistory." + this.props.selectedPair.id).listen(
      "TradeHistoryUpdated",
      e => {
        let { tradeHistory } = this.state;

        if (tradeHistory.length) {
          tradeHistory.unshift(e.tradeHistory);
          if (tradeHistory.length > 25) tradeHistory.pop();
        } else {
          tradeHistory.push(e.tradeHistory);
        }

        this.setState({ tradeHistory });
      }
    );
  };

  render() {
    const { selectedPair, selectedPairStats } = this.props;

    const decimalLength = setDecimalsLength(selectedPairStats.last_rate);
    const quantityDecimals =
      decimalLength === undefined ? 8 : decimalLength.quantityDecimals;
    const rateDecimals =
      decimalLength === undefined ? 8 : decimalLength.rateDecimals;
    const { tradeHistory, spinnerStatus } = this.state;

    return (
      <div className="order-history-block">
        <div className="panel-heading-block">
          <h5>Trade History</h5>
        </div>
        <Spinner status={spinnerStatus} />
        <table className="table table-fixed das-oreder-table trade-history">
          <thead>
            <tr>
              <th scope="col" className="col-4">
                Price({selectedPair.quote_currency_symbol})
              </th>
              <th scope="col" className="col-4">
                Qty({selectedPair.base_currency_symbol})
              </th>
              <th scope="col" className="col-4">
                Time
              </th>
            </tr>
          </thead>

          <tbody>
            {tradeHistory.map((value, i) => (
              <tr key={value.id}>
                <td className="col-4">
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
                    {value.rate.toFixed(rateDecimals)}
                  </span>
                </td>
                <td className="col-4">
                  <span>{value.quantity.toFixed(quantityDecimals)}</span>
                </td>
                {/* <td className="col-4">{moment(value.created_at).format("HH:mm:ss")}</td> */}
                <td className="col-4">
                  <span>
                    {" "}
                    {value.created_at && value.created_at.split(" ")[1]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ExchangeTradingHistory;
