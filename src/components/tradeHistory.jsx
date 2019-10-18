import React, { Component } from "react";
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
    pairId: 17,
    direction: ""
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
    { path: "quantity", label: "Quantity" },
    {
      path: "Cancel",
      content: o => (
        <button onClick={() => this.onCancel(o.id)} className="btn btn-primary">
          Cancel
        </button>
      )
    }

    /* {
      path: "fee",
      label: "Fee",
      content: o => o.fee + " " + o.base_currency_symbol
    } */
  ];

  onCancel = async id => {
    console.log(id);
    try {
      const response = await trade.cancelOrder(id);

      console.log("form response");
      console.log(response);
    } catch (ex) {
      console.log(ex);
    }
  };

  async componentDidMount() {
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
    this.setTradeHistory();
  };

  render() {
    const { tradeHistory, direction } = this.state;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>
        <div className="container my-5">
          <div className="row">
            <div className="col-12">
              <div className="latest-tranjections-block-inner panel-heading-block mb-2">
                <h5>Trade History</h5>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <form className="form-inline mb-2 " onSubmit={this.doSubmit}>
                <div className="form-group ">
                  {/* <label htmlFor="date"> </label> */}
                  <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleStartDate}
                  />
                </div>
                <div className="form-group ">
                  {/* <label htmlFor="exampleInputEmail2">-</label> */}
                  <DatePicker
                    selected={this.state.endDate}
                    onChange={this.handleEndDate}
                  />
                </div>
                <div className="form-group wrapper">
                  {/* <label htmlFor="date"></label> */}
                  <select name="" id="" className="form-control">
                    <option value="17">BCBTC</option>
                  </select>
                </div>

                <div className="form-group wrapper">
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
                <div className="form-group wrapper">
                  <input
                    type="submit"
                    className="btn btn-primary ml-3"
                    value="Search"
                  />
                </div>
                <div className="form-group wrapper">
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
