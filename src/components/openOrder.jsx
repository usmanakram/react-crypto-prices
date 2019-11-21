import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./header";
import Table from "./common/table";
import trade from "../services/tradeService";
import Spinner from "./spinner";
import { toast } from "react-toastify";

class OpenOrder extends Component {
  state = {
    openOrders: [],
    openOrderSpinner: false
  };

  columns = [
    { path: "created_at", label: "Date" },
    { path: "currency_pair_symbol", label: "Pair" },
    {
      path: "type",
      label: "Type",
      // content: o => (o.type === 0 ? "Market" : "Limit")
      content: o => {
        let type = "";
        switch (o.type) {
          case 0:
            type = "Market";
            break;
          case 1:
            type = "Limit";
            break;
          case 2:
            type = "Stop-Limit";
            break;
          case 3:
            type = "OCO-Limit";
            break;
          case 4:
            type = "OCO-Stop-Limit";
            break;
          default:
            break;
        }
        return type;
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
      path: "delete",
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
      const openOrders = this.state.openOrders.filter(o => o.id !== id);
      this.setState({ openOrders });
      toast.success(response);
    } catch (ex) {
      console.log(ex);
    }
  };

  async componentDidMount() {
    try {
      this.setState({ openOrderSpinner: true });
      const openOrders = await trade.getUserOpenOrders();

      this.setState({ openOrders, openOrderSpinner: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
  }

  render() {
    const { openOrders } = this.state;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>
        <div className="container my-3">
          <div className="row">
            <div className="col-12">
              <div className="latest-tranjections-block-inner panel-heading-block mb-2">
                <h5>Open Order</h5>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="latest-tranjections-block-inner">
                <Spinner status={this.state.openOrderSpinner} />

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
      </React.Fragment>
    );
  }
}

export default OpenOrder;
