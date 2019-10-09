import React, { Component } from "react";
import Table from "./common/table";
import ws from "../services/webSocketService";
import { toast } from "react-toastify";
import auth from "../services/authService";

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

  componentDidMount() {
    const user = auth.getCurrentUser();

    if (auth.getCurrentUser()) {
      ws.channel("User." + user.sub).listen("TradeOrderFilled", e => {
        toast.success(e.message);
      });
    }
  }

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
