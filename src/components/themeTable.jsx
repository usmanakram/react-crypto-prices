import React, { Component } from "react";
import Table from "./common/table";
import Spinner from "./spinner";
import trade from "../services/tradeService";
import { toast } from "react-toastify";

class ThemeTable extends Component {
  state = {};

  columns = [
    { path: "created_at", label: "Date" },
    { path: "currency_pair_symbol", label: "Pair" },
    {
      path: "type",
      label: "Type",
      content: o => (o.type === 0 ? "Market" : "Limit")
    },
    {
      path: "direction",
      label: "Side",
      content: o =>
        o.direction === 1 ? (
          <span className="ex-color-buy">Buy</span>
        ) : (
          <span className="ex-color-sell">Sell</span>
        )
    },
    { path: "rate", label: "Price" },
    { path: "quantity", label: "Quantity" },
    {
      path: "tradable_quantity",
      label: "Filled",
      content: o =>
        (((o.quantity - o.tradable_quantity) / o.quantity) * 100).toFixed(2) +
        "%"
    },
    {
      path: "Cancel",
      content: o => (
        <button onClick={() => this.onCancel(o.id)} className="btn btn-primary">
          Cancel
        </button>
      )
    }
  ];

  onCancel = async id => {
    try {
      const response = await trade.cancelOrder(id);
      const orders = this.props.openOrders.filter(o => o.id !== id);
      this.props.onCancelOrder(orders);
      toast.success(response);
    } catch (ex) {
      console.log(ex);
    }
  };

  render() {
    const { openOrders, status } = this.props;

    return (
      <div className="latest-tranjections-area">
        <div className="latest-tranjections-block">
          <div className="container">
            <div className="latest-tranjections-block-inner">
              <div className="panel-heading-block">
                <h5>Open Orders</h5>
              </div>
              <Spinner status={status} />

              <Table
                columns={this.columns}
                data={openOrders}
                classes="coin-list latest-tranjections-table"
                sortColumn=""
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ThemeTable;
