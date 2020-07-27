import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import auth from "../services/authService";
import http from "./../services/httpService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./header";
import Table from "./common/table";
import trade from "../services/tradeService";
import Spinner from "./spinner";
import moment from "moment";
import { toast } from "react-toastify";
import PaginationBig from "./common/paginationBig";
import debug from "../utils/debuger";
import dateCalculator from "../utils/dateCalculator";

class OrderHistory extends Component {
  state = {
    orderHistory: [],
    orderHistorySpinner: false,
    // startDate: new Date(),
    startDate: dateCalculator.getLastMonthDate(),
    endDate: new Date(),
    pairId: "",
    direction: "",
    currencyPairs: [],
    lastPage: 0,
    currentPage: 1,
  };

  columns = [
    { path: "created_at", label: "Date" },
    { path: "currency_pair_symbol", label: "Pair" },
    {
      path: "type",
      label: "Type",
      // content: o => (o.type === 0 ? "Market" : "Limit")
      content: (o) => {
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
      },
    },
    {
      path: "direction",
      label: "Side",
      content: (o) =>
        o.direction === 1 ? (
          <span className="ex-color-buy">Buy</span>
        ) : (
          <span className="ex-color-sell">Sell</span>
        ),
    },
    { path: "rate", label: "Price" },
    { path: "quantity", label: "Quantity" },
    {
      path: "tradable_quantity",
      label: "Filled",
      content: (o) => o.quantity - o.tradable_quantity,
    },
    {
      path: "trigger_condition",
      label: "Trigger Condition",
      content: (o) => {
        if ([2, 4].includes(o.type)) {
          return o.lower_trigger_rate === null
            ? ">= " + o.upper_trigger_rate
            : "<= " + o.lower_trigger_rate;
        }
      },
    },
    {
      path: "status",
      label: "Status",
      content: (o) =>
        o.status === 0
          ? "Inactive"
          : o.status === 1
          ? "Active"
          : o.status === 2
          ? "Filled"
          : "Canceled",
    },
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

  onCancel = async (id) => {
    try {
      const response = await trade.cancelOrder(id);
      const orderHistory = this.state.orderHistory.map((o) => {
        if (o.id === id) o.status = 3;
        return o;
      });

      this.setState({ orderHistory });
      toast.success(response);
    } catch (ex) {
      debug.log(ex);
    }
  };

  async componentDidMount() {
    try {
      const { data } = await http.get("/currency-pairs");
      this.setState({ currencyPairs: data });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        debug.log(ex.response.data);
      }
    }

    this.setOrderHistory();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.currentPage !== prevState.currentPage)
      this.setOrderHistory();
  }

  setOrderHistory = async () => {
    const { startDate, endDate, pairId, direction, currentPage } = this.state;
    const start = startDate ? moment(startDate).format("YYYY-M-D") : null;
    const end = endDate ? moment(endDate).format("YYYY-M-D") : null;
    try {
      this.setState({ orderHistory: [], orderHistorySpinner: true });

      const orderHistory = await trade.getUserOrderHistory({
        start,
        end,
        pair_id: pairId,
        direction,
        page: currentPage,
      });

      this.setState({
        orderHistory: orderHistory.data,
        lastPage: orderHistory.last_page,
        currentPage: orderHistory.current_page,
        orderHistorySpinner: false,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        debug.log(ex.response.data);
      }
    }
  };

  handlePageChange = (currentPage) => {
    this.setState({ currentPage });
  };

  handleStartDate = (date) => {
    this.setState({ startDate: date });
  };

  handleEndDate = (date) => {
    this.setState({ endDate: date });
  };
  handeValueChange = (c) => {
    this.setState({ direction: c.currentTarget.value });
  };

  handleChange = ({ currentTarget: input }) => {
    this.setState({ [input.name]: input.value });
  };

  handleReset = () => {
    const date = new Date();

    this.setState({
      endDate: date,
      startDate: date,
      direction: "",
      pairId: "",
    });
  };

  doSubmit = async (e) => {
    e.preventDefault();
    this.state.currentPage = 1;
    this.setOrderHistory();
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;
    const {
      direction,
      pairId,
      orderHistory,
      currencyPairs,
      lastPage,
      currentPage,
    } = this.state;
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

                  <select
                    className="form-control"
                    onChange={this.handleChange}
                    name="pairId"
                    value={pairId}
                  >
                    <option value="">All</option>
                    {currencyPairs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.symbol}
                      </option>
                    ))}
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
                <PaginationBig
                  lastPage={lastPage}
                  currentPage={currentPage}
                  onPageChange={this.handlePageChange}
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
