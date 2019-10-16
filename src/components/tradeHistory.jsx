import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./header";
import Table from "./common/table";
import trade from "../services/tradeService";
import Spinner from "./spinner";

class TradeHistory extends Component {
  state = {
    tradeHistory: [],
    startDate: new Date(),
    endDate: new Date(),
    select: ""
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
      const tradeHistory = await trade.getUserTradeHistory();
      this.setState({ tradeHistory });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
  }

  handleStartDate = date => {
    this.setState({
      startDate: date
    });
  };

  handleEndDate = date => {
    this.setState({
      endDate: date
    });
  };
  handeValueChange = c => {
    console.log("c.target.value");
    console.log(c.currentTarget.value);
    this.setState({ select: c.currentTarget.value });
  };

  handleReset = () => {
    const date = new Date();

    this.setState({
      endDate: date,
      startDate: date,
      select: ""
    });
  };

  render() {
    const { tradeHistory } = this.state;

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
              <form className="form-inline mb-2">
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
                    onClick={this.handeValueChange}
                    name=""
                    id=""
                    className="form-control"
                  >
                    <option value="">Both</option>
                    <option value="1">Buy</option>
                    <option value="0">Sell</option>
                  </select>
                </div>
                <div className="form-group wrapper">
                  <button type="button" className="btn btn-primary ml-3">
                    Search
                  </button>
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
                {tradeHistory == 0 && <Spinner />}
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
