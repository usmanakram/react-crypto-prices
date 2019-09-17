import React, { Component } from "react";
import { Link } from "react-router-dom";
import http from "../services/httpService";

class Deposits extends Component {
  state = {
    selectedCurrency: {},
    currencies: [],
    transactions: []
  };

  async componentDidMount() {
    try {
      const { data } = await http.get("/get-all-currencies");
      console.log(data);

      this.setState({ currencies: data });

      // Populate first currency address and relevant data
      const { data: firstCurrency } = await http.get(
        "/auth/get-deposit-address/" + data[0].symbol
      );
      this.setState({ selectedCurrency: firstCurrency });
    } catch (ex) {
      console.log(ex);
    }
  }

  handleCurrencyChange = async ({ currentTarget: select }) => {
    try {
      const { data } = await http.get(
        "/auth/get-deposit-address/" + select.value
      );
      console.log(data);

      this.setState({ selectedCurrency: data });
    } catch (ex) {
      console.log(ex);
    }
  };

  render() {
    const { selectedCurrency } = this.state;
    let address, name, symbol;

    if (Object.keys(selectedCurrency).length) {
      /* const {
        selectedCurrency: {
          address,
          currency: { name, symbol }
        }
      } = this.state; */

      address = selectedCurrency.address;
      name = selectedCurrency.currency.name;
      symbol = selectedCurrency.currency.symbol;
    }

    return (
      <React.Fragment>
        <div style={{ backgroundColor: "#ffffff" }}>
          <div className="row ">
            <div className="col-md-10 col-md-offset-1 mt-15">
              <select
                className="form-control"
                onChange={this.handleCurrencyChange}
              >
                {this.state.currencies.map(c => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {Object.keys(selectedCurrency).length > 0 && (
            <React.Fragment>
              <div className="row mt-15">
                <div className="col-md-10 col-md-offset-1  ">
                  <div className="col-lg-3 col-md-3 col-sm-3">
                    <p>Total balance</p>
                    <p>In order</p>
                    <p>Available balance</p>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3">
                    <p>0.00000000 {symbol}</p>
                    <p>0.00000000 {symbol}</p>
                    <p>0.00000000 {symbol}</p>
                  </div>

                  <div className="col-lg-4 col-md-3 col-sm-3">
                    <p>What's {symbol}?</p>
                  </div>
                </div>
              </div>

              <div className="row mt-15 ">
                <div className="col-md-10 col-md-offset-1  ">
                  <div
                    className="border mb-15"
                    style={{ backgroundColor: "#f8f8f8" }}
                  >
                    <h5>
                      <strong>Important</strong>
                    </h5>
                    <p>
                      Send only <strong>{symbol}</strong> to this deposit
                      address. Sending any other coin or token to this address
                      may result in the loss of your deposit.
                    </p>
                    <h5>
                      <strong>{symbol} Deposit Address</strong>
                    </h5>
                    <div className="col-md-12  ">
                      <div className="border ">
                        <p>
                          <strong>{address}</strong>
                        </p>
                      </div>
                    </div>
                    <Link
                      className="btn btn-primary mt-15"
                      style={{ marginBottom: 20 }}
                      to="/pathLink#yourAnchorTag"
                    >
                      Show QR Code
                    </Link>
                    <Link
                      className="btn btn-primary mt-15"
                      style={{ marginBottom: 20 }}
                      to="/pathLink#yourAnchorTag"
                    >
                      Copy Address
                    </Link>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Deposits;
