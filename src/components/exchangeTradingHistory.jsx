import React, { Component } from "react";
// import moment from "moment";
import Spinner from "./spinner";
import trade from "../services/tradeService";
import ws from "../services/webSocketService";

class ExchangeTradingHistory extends Component {
  state = {
    tradeHistory: []
  };

  componentDidMount() {
    window.$(".dashboard-ticker-block-four").slimScroll({
      height: "570px"
    });
  }

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
    const { selectedPair } = this.props;

    if (Object.keys(selectedPair).length) {
      const tradeHistory = await trade.getTradeHistory(selectedPair.id);

      this.setState({ tradeHistory });

      this.setStream();
    }
  };

  setStream = () => {
    ws.channel("TradeHistory." + this.props.selectedPair.id).listen(
      "TradeHistoryUpdated",
      e => {
        const { tradeHistory } = this.state;

        if (tradeHistory.length) {
          tradeHistory.pop();
          tradeHistory.unshift(e.tradeHistory);
        } else {
          tradeHistory = e.tradeHistory;
        }

        this.setState({ tradeHistory });
      }
    );
  };

  render() {
    const { selectedPair, status } = this.props;
    const { tradeHistory } = this.state;

    return (
      <div className="order-history-block">
        <div className="panel-heading-block">
          <h5>Trade History</h5>
        </div>
        <div className="order-history-block-inner dashboard-ticker-block-four">
          <div className="history-table-wrap">
            <Spinner status={status} />

            {/* <table className="table coin-list table-hover history-table trade-history"> */}
            <table className="table das-oreder-table table-hover trade-history">
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
                    <td>
                      <span>{value.quantity}</span>
                    </td>
                    {/* <td>{moment(value.created_at).format("HH:mm:ss")}</td> */}
                    <td>
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
        </div>
      </div>
    );
  }
}

export default ExchangeTradingHistory;
