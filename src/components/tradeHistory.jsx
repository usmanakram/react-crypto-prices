import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "./header";
import Table from "./common/table";
import trade from "../services/tradeService";

class TradeHistory extends Component {
  state = {
    tradeHistory: [],
    startDate: new Date()
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

  handleChange = date => {
    this.setState({
      startDate: date
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
              <h4>Trade History</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <form className="form-inline mb-2">
                <div className="form-group ">
                  {/* <label htmlFor="date"> </label> */}
                  <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group ">
                  {/* <label htmlFor="exampleInputEmail2">-</label> */}
                  <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group wrapper">
                  {/* <label htmlFor="date"></label> */}
                  <select name="" id="" className="form-control">
                    <option value="">Pair: Coin</option>
                    <option value="">ADA</option>
                    <option value="">ADD</option>
                    <option value="">ADX</option>
                    <option value="">AE</option>
                    <option value="">AGI</option>
                    <option value="">AION</option>
                    <option value="">AST</option>
                    <option value="">ARN</option>
                    <option value="">BCX</option>
                    <option value="">Ten</option>
                  </select>
                </div>
                <div className="form-group wrapper ">
                  {/* <label htmlFor="date">-</label> */}
                  <select name="" id="" className="form-control">
                    <option value="">All</option>
                    <option value="">BNB</option>
                    <option value="">BTC</option>
                    <option value="">ETH</option>
                    <option value="">USDT</option>
                  </select>
                </div>
                <div className="form-group wrapper">
                  {/* <label htmlFor="date"></label> */}
                  <select name="" id="" className="form-control">
                    <option value="">Side: All</option>
                    <option value="">Buy</option>
                    <option value="">Sell</option>
                  </select>
                </div>
                <div className="form-group wrapper">
                  <button type="button" className="btn btn-primary ml-3">
                    Search
                  </button>
                </div>
                <div className="form-group wrapper">
                  <button type="button" className="btn btn-primary ml-3">
                    Reset
                  </button>
                </div>
              </form>

              <div className="latest-tranjections-block-inner">
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
