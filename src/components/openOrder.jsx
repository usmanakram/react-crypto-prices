import React, { Component } from "react";
import { orderHeadings } from "../services/fakeOrderHistory";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./header";
import Table from "./common/table";
import trade from "../services/tradeService";
import Spinner from "./spinner";

class OpenOrder extends Component {
  state = {
    openOrders: [],
    orderHeadings: orderHeadings
  };

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
    }
  ];

  async componentDidMount() {
    try {
      const openOrders = await trade.getUserOpenOrders();
      this.setState({ openOrders });
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
        <div className="container my-5">
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
                {openOrders == 0 && <Spinner />}

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
