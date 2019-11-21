import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./header";
import Table from "./common/table";
import trade from "../services/tradeService";
import Spinner from "./spinner";
import moment from "moment";
import { toast } from "react-toastify";

class OrderHistory extends Component {
  state = {
    orderHistory: [],
    orderHistorySpinner: false,
    startDate: new Date(),
    endDate: new Date(),
    pairId: 17,
    direction: ""
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
      content: o => o.quantity - o.tradable_quantity
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
      path: "status",
      label: "Status",
      content: o =>
        o.status === 0
          ? "Inactive"
          : o.status === 1
          ? "Active"
          : o.status === 2
          ? "Filled"
          : "Canceled"
    }
    /* {
      path: "Cancel",
      content: o => {
        if ([0, 1].indexOf(o.status) === -1) return null;
        return (
          <button
            onClick={() => this.onCancel(o.id)}
            className="btn btn-primary"
          >
            Cancel
          </button>
        );
      }
    } */
  ];

  onCancel = async id => {
    try {
      const response = await trade.cancelOrder(id);
      const orderHistory = this.state.orderHistory.map(o => {
        if (o.id === id) o.status = 3;
        return o;
      });
      this.setState({ orderHistory });
      toast.success(response);
    } catch (ex) {
      console.log(ex);
    }
  };

  async componentDidMount() {
    this.setOrderHistory();
  }

  setOrderHistory = async () => {
    const { startDate, endDate, pairId, direction } = this.state;
    const start = moment(startDate).format("YYYY-M-D");
    const end = moment(endDate).format("YYYY-M-D");
    try {
      this.setState({ orderHistory: [], orderHistorySpinner: true });

      const orderHistory = await trade.getUserOrderHistory(
        start,
        end,
        pairId,
        direction
      );

      this.setState({ orderHistory, orderHistorySpinner: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
  };

  handleStartDate = date => {
    this.setState({ startDate: date });
  };

  handleEndDate = date => {
    this.setState({ endDate: date });
  };
  handeValueChange = c => {
    this.setState({ direction: c.currentTarget.value });
  };

  handleReset = () => {
    const date = new Date();

    this.setState({
      endDate: date,
      startDate: date,
      direction: ""
    });
  };

  doSubmit = async e => {
    e.preventDefault();
    this.setOrderHistory();
  };

  render() {
    const { direction, orderHistory } = this.state;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>
        <div className="container my-3">
          <div className="row">
            <div className="col-12">
              <div className="latest-tranjections-block-inner panel-heading-block">
                <h5>Order History</h5>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <form className="form-inline" onSubmit={this.doSubmit}>
                <div className="form-group my-2 ">
                  {/* <label htmlFor="date"> </label> */}
                  <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleStartDate}
                  />
                </div>
                <div className="form-group my-2 ">
                  {/* <label htmlFor="exampleInputEmail2">-</label> */}
                  <DatePicker
                    selected={this.state.endDate}
                    onChange={this.handleEndDate}
                  />
                </div>
                <div className="form-group my-2 wrapper">
                  {/* <label htmlFor="date"></label> */}
                  <select name="" id="" className="form-control">
                    <option value="17">BCBTC</option>
                  </select>
                </div>

                <div className="form-group my-2 wrapper">
                  {/* <label htmlFor="date"></label> */}
                  <select
                    onChange={this.handeValueChange}
                    name="direction"
                    id=""
                    className="form-control"
                    value={direction}
                  >
                    <option value="">Both</option>
                    <option value="1">Buy</option>
                    <option value="0">Sell</option>
                  </select>
                </div>
                <div className="form-group my-2 wrapper">
                  <input
                    type="submit"
                    className="btn btn-primary ml-3"
                    value="Search"
                  />
                </div>
                <div className="form-group my-2 wrapper">
                  <button
                    onClick={this.handleReset}
                    type="button"
                    className="btn btn-primary ml-3"
                  >
                    Reset
                  </button>
                </div>
              </form>

              <div className="latest-tranjections-block-inner">
                <Spinner status={this.state.orderHistorySpinner} />

                <Table
                  columns={this.columns}
                  data={orderHistory}
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

export default OrderHistory;
