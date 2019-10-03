import React, { Component } from "react";
import Table from "./common/table";
import ws from "../services/webSocketService";

class OrderBook extends Component {
  columns = [
    {
      path: "rate",
      label: "Price"
    },
    { path: "tradable_quantity", label: "Quantity" }
  ];

  orderBookPairId = 0;

  // Channel didn't invoked inside componentDidMount() because, it is executed before assigning value to "selectedPair"
  /* componentDidMount() {
    ws.channel("live2").listen("OrderBookUpdated", e => {
      this.props.onOrderBookUpdate(e.orderBookData);
    });
  } */

  handleStream = () => {
    const { selectedPair } = this.props;

    if (
      Object.keys(selectedPair).length &&
      this.orderBookPairId !== selectedPair.id
    ) {
      this.orderBookPairId = selectedPair.id;

      ws.channel("OrderBook." + this.orderBookPairId).listen(
        "OrderBookUpdated",
        e => {
          this.props.onOrderBookUpdate(e.orderBookData);
        }
      );
    }
  };

  render() {
    const { orderBookData } = this.props;

    this.handleStream();

    return (
      <React.Fragment>
        <h3>Order Book</h3>
        <Table
          columns={this.columns}
          data={orderBookData.sellOrders}
          sortColumn=""
          onSort=""
        />
        <Table
          columns={this.columns}
          data={orderBookData.buyOrders}
          sortColumn=""
          onSort=""
        />
      </React.Fragment>
    );
  }
}

export default OrderBook;
