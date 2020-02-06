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

class TradeHistory extends Component {
  state = {
    tradeHistory: [],
    tradeHistorySpinner: false,
    startDate: new Date(),
    endDate: new Date(),
    pairId: "",
    direction: "",
    currencyPairs: []
  };
  columns = [
    { path: "created_at", label: "Date" },
    { path: "currency_pair_symbol", label: "Pair" },
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
    { path: "quantity", label: "Quantity" }

    /* {
      path: "fee",
      label: "Fee",
      content: o => o.fee + " " + o.base_currency_symbol
    } */
  ];

  async componentDidMount() {
    try {
      const { data } = await http.get("/currency-pairs");
      this.setState({ currencyPairs: data });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }

    this.setTradeHistory();
  }

  setTradeHistory = async () => {
    const { startDate, endDate, pairId, direction } = this.state;
    const start = moment(startDate).format("YYYY-M-D");
    const end = moment(endDate).format("YYYY-M-D");
    try {
      this.setState({ tradeHistorySpinner: true });

      const tradeHistory = await trade.getUserTradeHistory(
        start,
        end,
        pairId,
        direction
      );

      this.setState({ tradeHistory, tradeHistorySpinner: false });
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

  handleChange = ({ currentTarget: input }) => {
    this.setState({ [input.name]: input.value });
  };

  handleReset = () => {
    const date = new Date();

    this.setState({
      endDate: date,
      startDate: date,
      direction: "",
      pairId: ""
    });
  };

  doSubmit = async e => {
    e.preventDefault();
    this.setTradeHistory();
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;
    const { tradeHistory, pairId, direction, currencyPairs } = this.state;

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
                    {currencyPairs.map(c => (
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
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TradeHistory;
