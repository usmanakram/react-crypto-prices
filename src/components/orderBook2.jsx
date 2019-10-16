import React, { Component } from "react";
import { Link } from "react-router-dom";
import SellOrderBookTable from "./sellOrderBookTable";
import BuyOrderBookTable from "./buyOrderBookTable";
import ws from "../services/webSocketService";

class OrderBook2 extends Component {
  state = {};

  handleStream = () => {
    const { selectedPair, onOrderBookUpdate } = this.props;

    if (
      Object.keys(selectedPair).length &&
      this.orderBookPairId !== selectedPair.id
    ) {
      this.orderBookPairId = selectedPair.id;

      ws.channel("OrderBook." + this.orderBookPairId).listen(
        "OrderBookUpdated",
        e => {
          onOrderBookUpdate(e.orderBookData);
        }
      );
    }
  };

  render() {
    const { selectedPair, selectedPairStats, orderBookData } = this.props;
    this.handleStream();

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

        <div className="das-oreder-table-block ">
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
    );
  }
}

export default OrderBook2;
