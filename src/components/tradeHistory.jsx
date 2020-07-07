import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import auth from "../services/authService";
import http from "../services/httpService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./header";
import Table from "./common/table";
import trade from "../services/tradeService";
import Spinner from "./spinner";
import moment from "moment";
import PaginationBig from "./common/paginationBig";
import debug from "../utils/debuger";

class TradeHistory extends Component {
  state = {
    tradeHistory: [],
    tradeHistorySpinner: false,
    // startDate: new Date(),
    startDate: this.getLastMonthDate(),
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

    /* {
      path: "fee",
      label: "Fee",
      content: o => o.fee + " " + o.base_currency_symbol
    } */
  ];

  getLastMonthDate() {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d;
  }

  async componentDidMount() {
    try {
      const { data } = await http.get("/currency-pairs");
      this.setState({ currencyPairs: data });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        debug.log(ex.response.data);
      }
    }

    this.setTradeHistory();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.currentPage !== prevState.currentPage)
      this.setTradeHistory();
  }

  setTradeHistory = async () => {
    const { startDate, endDate, pairId, direction, currentPage } = this.state;
    const start = startDate ? moment(startDate).format("YYYY-M-D") : null;
    const end = endDate ? moment(endDate).format("YYYY-M-D") : null;
    try {
      this.setState({ tradeHistorySpinner: true });

      const tradeHistory = await trade.getUserTradeHistory({
        start,
        end,
        pair_id: pairId,
        direction,
        page: currentPage,
      });

      this.setState({
        tradeHistory: tradeHistory.data,
        lastPage: tradeHistory.last_page,
        currentPage: tradeHistory.current_page,
        tradeHistorySpinner: false,
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
    this.setTradeHistory();
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;
    const {
      tradeHistory,
      pairId,
      direction,
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
              <div className="latest-tranjections-block-inner panel-heading-block mb-2">
                <h5>Trade History</h5>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <form className="form-inline  " onSubmit={this.doSubmit}>
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

              <div className="latest-tranjections-block-inner ">
                <Spinner status={this.state.tradeHistorySpinner} />

                <Table
                  columns={this.columns}
                  data={tradeHistory}
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

export default TradeHistory;
