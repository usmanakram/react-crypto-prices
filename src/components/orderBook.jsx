import React, { Component } from "react";
import SellOrderBookTable from "./sellOrderBookTable";
import BuyOrderBookTable from "./buyOrderBookTable";
import trade from "../services/tradeService";
import ws from "../services/webSocketService";
import Spinner from "./spinner";
import _ from "lodash";

class OrderBook extends Component {
  state = {
    orderBookData: {
      buyOrders: [],
      sellOrders: []
    },
    spinnerStatus: false
  };

  componentWillUnmount() {
    ws.leaveChannel("OrderBook." + this.props.selectedPair.id);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedPair: currentPair } = this.props;
    const { selectedPair: prevPair } = prevProps;

    if (
      Object.keys(currentPair).length &&
      (Object.keys(prevPair).length === 0 || currentPair.id !== prevPair.id)
    ) {
      ws.leaveChannel("OrderBook." + prevPair.id);
      this.setOrderBook();
    }
  }

  setOrderBook = async () => {
    this.setState({ spinnerStatus: true });
    try {
      const orderBookData = await trade.getOrderBook(
        this.props.selectedPair.id
      );

      this.handleOrderBook(orderBookData);

      this.setStream();
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
    this.setState({ spinnerStatus: false });
  };

  handleOrderBook = orderBookData => {
    orderBookData.sellOrders = _(orderBookData.sellOrders)
      .take(5)
      .value();
    orderBookData.buyOrders = _(orderBookData.buyOrders)
      .take(5)
      .value();

    // Update sellOrders as "decending order rates"
    orderBookData.sellOrders.sort((a, b) => b.rate - a.rate);

    this.setState({ orderBookData });
  };

  setStream = () => {
    ws.channel("OrderBook." + this.props.selectedPair.id).listen(
      "OrderBookUpdated",
      e => {
        this.handleOrderBook(e.orderBookData);
      }
    );
  };

  render() {
    const { selectedPair, selectedPairStats } = this.props;
    const { orderBookData, spinnerStatus } = this.state;

    return (
      <div className="dahboard-order-block">
        <div className="panel-heading-block">
          <h5>Order Book</h5>
        </div>
        {/* <ul className="nav das-oreder-nav">
          <li className="nav-item nav-item-first">
            <Link className="nav-link" to="#">
              Order book
            </Link>
          </li>
          <li className="nav-item">
            <div className="dropdown order-count-dropdown">
              <button
                className="btn dropdown-toggle"
                type="button"
                id="dropdownMenu2"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                8
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                <button className="dropdown-item" type="button">
                  10
                </button>
                <button className="dropdown-item" type="button">
                  14
                </button>
                <button className="dropdown-item" type="button">
                  18
                </button>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#">
              <img
                src="./images/exchange/1.png"
                alt="img"
                className="img-responsive"
              />
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#">
              <img
                src="./images/exchange/2.png"
                alt="img"
                className="img-responsive"
              />
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#">
              <img
                src="./images/exchange/3.png"
                alt="img"
                className="img-responsive"
              />
            </Link>
          </li>
        </ul> */}
        <div className="ord">
          <div className="das-oreder-table-block ">
            <Spinner status={spinnerStatus} />

            <SellOrderBookTable
              selectedPair={selectedPair}
              orderBookData={orderBookData}
            />

            <BuyOrderBookTable
              selectedPairStats={selectedPairStats}
              orderBookData={orderBookData}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default OrderBook;
