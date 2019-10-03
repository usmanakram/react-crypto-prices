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

  componentDidMount() {
    ws.channel("live2").listen("OrderBookUpdated", e => {
      this.props.onOrderBookUpdate(e.orderBookData);
    });
  }

  render() {
    const { selectedPair, orderBookData } = this.props;

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
