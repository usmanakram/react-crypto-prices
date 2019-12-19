import React, { Component } from "react";
// import moment from "moment";
import Spinner from "./spinner";
import trade from "../services/tradeService";
import ws from "../services/webSocketService";

class ExchangeTradingHistory extends Component {
  state = {
    tradeHistory: [],
    spinnerStatus: false
  };

  componentDidMount() {
    window.$(".exchangeTradingHistoryScroll").slimScroll({
      height: "440px"
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
    const { selectedPair } = this.props;
    const { tradeHistory, spinnerStatus } = this.state;

    return (
      <div className="order-history-block">
        <div className="panel-heading-block">
          <h5>Trade History</h5>
        </div>
        <div className="order-history-block-inner exchangeTradingHistoryScroll">
          <div className="history-table-wrap">
            <Spinner status={spinnerStatus} />

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
                      <span>{value.quantity.toFixed(8)}</span>
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
