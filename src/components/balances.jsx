import React, { Component } from "react";
import http from "../services/httpService";

class Balances extends Component {
  state = {
    balances: []
  };

  async componentDidMount() {
    try {
      const { data: balances } = await http.get("/auth/get-balances");

      console.log(balances);

      this.setState({ balances });
    } catch (ex) {
      console.log(ex);
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <h4>Balances</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Coin</th>
                <th>Name</th>
                <th>Total Balance</th>
                <th>Available Balance</th>
                <th>In order</th>
                <th>BTC Value</th>
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
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Balances;
