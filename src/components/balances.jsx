import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import http from "../services/httpService";
import auth from "../services/authService";
import Header from "./header";
import { balanceHeadings } from "../services/fakeBalances";

class Balances extends Component {
  state = {
    balances: [],
    btcValue: 0,
    dollarValue: 0
  };

  async componentDidMount() {
    try {
      const { data: balances } = await http.get("/auth/get-balances");

      let btcValue = 0,
        dollarValue = 0;

      balances.forEach(b => {
        btcValue += b.btc_value;
        dollarValue += b.dollar_value;
      });

      this.setState({ balances, btcValue, dollarValue });
    } catch (ex) {
      console.log(ex);
    }
  }

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>

        <div className="container">
          <div className="teanding-info-block">
            <ul className="nav trending-info-tab">
              <li className="nav-item">
                <div className=" trending-info-currency-option">
                  <h4>Balances</h4>
                  <h4>
                    {" "}
                    Estimated Value： {this.state.btcValue} BTC / $
                    {this.state.dollarValue}
                  </h4>
                </div>
              </li>
              <li className="nav-item">
                <form action="#" method="get" className="search-form">
                  <div className="input-box">
                    <input
                      type="text"
                      value=""
                      required=""
                      name="s"
                      readOnly
                      className="form-control"
                      placeholder="Search..."
                    />
                    <button type="submit">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </form>
              </li>
            </ul>

            <div className="trandinginfo-table-block">
              <table className="table coin-list latest-tranjections-table">
                <thead>
                  <tr>
                    {balanceHeadings.map(balanceHeading => (
                      <th key={balanceHeading.balanceHeading}>
                        {balanceHeading.balanceHeading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {this.state.balances.map(c => (
                    <tr key={c.symbol}>
                      <td>{c.symbol}</td>
                      <td>{c.name}</td>
                      <td>{c.total_balance}</td>
                      <td>{c.total_balance - c.in_order_balance}</td>
                      <td>{c.in_order_balance}</td>
                      <td>{c.btc_value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Balances;
