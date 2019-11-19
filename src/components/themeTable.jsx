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
      // content: o => (o.type === 0 ? "Market" : "Limit")
      content: o => {
        switch (o.type) {
          case 0:
            return "Market";
            break;
          case 1:
            return "Limit";
            break;
          case 2:
            return "Stop-Limit";
            break;
          case 3:
            return "OCO-Limit";
            break;
          case 4:
            return "OCO-Stop-Limit";
            break;
          default:
            break;
        }
      }
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
      path: "trigger_condition",
      label: "Trigger Condition",
      content: o => {
        if ([2, 4].includes(o.type)) {
          return o.lower_trigger_rate === null
            ? ">= " + o.upper_trigger_rate
            : "<= " + o.lower_trigger_rate;
        }
      }
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
      const { order_ids, message } = await trade.cancelOrder(id);
      // const orders = this.props.openOrders.filter(o => o.id !== id);
      const orders = this.props.openOrders.filter(
        o => !order_ids.includes(o.id)
      );
      this.props.onCancelOrder(orders);
      toast.success(message);
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
