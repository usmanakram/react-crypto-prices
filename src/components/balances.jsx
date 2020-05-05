import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import http from "../services/httpService";
import auth from "../services/authService";
import Header from "./header";
import Table from "../components/common/table";
import debug from "../utils/debuger";

class Balances extends Component {
  state = {
    balances: [],
    btcValue: 0,
    dollarValue: 0,
    searchqQuerry: "",
  };

  columns = [
    { path: "name", label: "Name" },
    { path: "symbol", label: "Symbol" },
    // { path: "status", label: "Status" },
    {
      path: "total_balance",
      label: "Total Balance",
      content: (b) => b.total_balance.toFixed(8),
    },
    {
      path: "in_order_balance",
      label: "In Order",
      content: (b) => b.in_order_balance.toFixed(8),
    },
    {
      path: "btc_value",
      label: "BTC Value",
      content: (b) => b.btc_value.toFixed(8),
    },
  ];

  async componentDidMount() {
    try {
      const { data: balances } = await http.get("/auth/get-balances");

      let btcValue = 0,
        dollarValue = 0;

      /* balances.forEach((b) => {
        btcValue += b.btc_value;
        dollarValue += b.dollar_value;
      }); */
      /**
       * Equelent BTC value is being calculated using total dollarValue
       */
      balances.forEach((b) => {
        dollarValue += b.dollar_value;
      });
      const btc = balances.find((b) => b.symbol === "BTC");
      if (btc) {
        btcValue = dollarValue / btc.last_rate;
      }

      this.setState({ balances, btcValue, dollarValue });
    } catch (ex) {
      debug.log(ex);
    }
  }

  handleChange = ({ currentTarget: input }) => {
    this.setState({ searchqQuerry: input.value });
  };

  filterBalances = () => {
    const { balances, searchqQuerry } = this.state;

    return balances.filter(
      (b) =>
        searchqQuerry === "" ||
        b.name.toUpperCase().startsWith(searchqQuerry.toUpperCase()) ||
        b.symbol.toUpperCase().startsWith(searchqQuerry.toUpperCase())
    );
  };

  render() {
    const { searchqQuerry } = this.state;

    const filteredBalances = this.filterBalances();
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>

        <div className="container my-3">
          <div className="teanding-info-block">
            <ul className="nav trending-info-tab">
              <li className="nav-item">
                <div className=" trending-info-currency-option">
                  <h4>Balances</h4>
                  <h4>
                    Estimated Value： {this.state.btcValue.toFixed(8)} BTC / $
                    {this.state.dollarValue.toFixed(2)}
                  </h4>
                </div>
              </li>
              <li className="nav-item">
                <form action="#" method="get" className="search-form">
                  <div className="input-box">
                    <input
                      type="text"
                      required=""
                      name="searchqQuerry"
                      className="form-control"
                      onChange={this.handleChange}
                      placeholder="Search..."
                      value={searchqQuerry}
                    />
                    <button type="submit">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </form>
              </li>
            </ul>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="latest-tranjections-block-inner">
                <Table
                  columns={this.columns}
                  data={filteredBalances}
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

export default Balances;
