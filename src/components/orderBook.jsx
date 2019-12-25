import React from "react";
import SellOrderBookTable from "./sellOrderBookTable";
import BuyOrderBookTable from "./buyOrderBookTable";
import Spinner from "./spinner";
import _ from "lodash";

const OrderBook = ({
  selectedPair,
  selectedPairStats,
  orderBookData,
  spinnerStatus
}) => {
  const sellOrders = _(orderBookData.sellOrders)
    .take(15)
    .value();
  const buyOrders = _(orderBookData.buyOrders)
    .take(15)
    .value();

  // Sort sellOrders as "decending order rates"
  sellOrders.sort((a, b) => b.rate - a.rate);

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
            sellOrders={sellOrders}
          />

          <BuyOrderBookTable
            selectedPairStats={selectedPairStats}
            buyOrders={buyOrders}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
