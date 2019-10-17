import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import http from "../services/httpService";
import { toast } from "react-toastify";
import auth from "../services/authService";
import Spinner from "./spinner";
import Header from "./header";

class Withdrawal extends Component {
  state = {
    selectedCurrency: {},
    currencies: [],
    transactions: [],
    isLoadComponent: false,
    isLoadSpinner: false
  };

  username = React.createRef();

  async componentDidMount() {
    try {
      const { data } = await http.get("/get-all-currencies");
      console.log(data);
      // const currencies = data.filter(c => c.symbol !== "BC");
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
    //new
    this.setState({
      isLoadSpinner: true
    }); //
    try {
      const { data } = await http.get(
        "/auth/get-deposit-address/" + select.value
      );
      console.log(data);

      this.setState({ selectedCurrency: data });
      //new
      this.setState({
        isLoadSpinner: false
      }); //
    } catch (ex) {
      console.log(ex);
      //new
      this.setState({
        isLoadSpinner: false
      }); //
      toast.error(
        "Deposit of " +
          select.value +
          " is not functional right now. Please, try again later"
      );
    }
  };

  doSubmit = e => {
    e.preventDefault();
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;

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
        <div className="navigation-two">
          <Header />
        </div>

        <div className="row spinner_wrapper my-5">
          <div className="col-md-10 offset-1 mt-20 ">
            <div className="latest-tranjections-block-inner panel-heading-block mb-2">
              <h5>Withdrawal</h5>
            </div>
            <select
              className="form-control"
              onChange={this.handleCurrencyChange}
            >
              {/* {this.state.currencies.map(c => (
                <option key={c.symbol} value={c.symbol}>
                  {c.name}
                </option>
              ))} */}
              <option value="">BTC</option>
            </select>
          </div>
        </div>

        {Object.keys(selectedCurrency).length > 0 && (
          <React.Fragment>
            <div
              className="
              col-lg-10
              col-md-10
              col-sm-10
              offset-1
              mt-20"
            >
              <table className="table table-borderless   ">
                <tbody>
                  <tr>
                    <td>Total balance</td>
                    <td>
                      {selectedCurrency.total_balance} {symbol}
                    </td>
                  </tr>

                  <tr>
                    <td>In Order</td>
                    <td>
                      {selectedCurrency.in_order_balance} {symbol}
                    </td>
                  </tr>
                  <tr>
                    <td>Available balance</td>
                    <td>
                      {selectedCurrency.total_balance -
                        selectedCurrency.in_order_balance}
                      {symbol}
                    </td>
                    <td>
                      {/* <Link to="/">
                        <i
                          className="fa fa-info-circle fa-fw"
                          aria-hidden="true"
                        ></i>
                        What's
                        {symbol}?
                      </Link> */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-10 offset-1  mb-5">
              <div className="border mb-20 adbox">
                <h5 className="text-warning mt-4 ml-3">
                  <strong>Important</strong>
                </h5>
                <p className="text-warning ml-3">
                  Send only <strong>{symbol}</strong> to this deposit address.
                  Sending any other coin or token to this address may result in
                  the loss of your deposit.
                </p>
                <form onSubmit={this.doSubmit}>
                  <label className="text-warning ml-3" htmlFor="ex">
                    <strong>{symbol} Withdrawal Address</strong>
                  </label>

                  <div className="form-group mx-3">
                    <input
                      ref={this.username}
                      type="text"
                      className="form-control"
                      value=""
                      placeholder="Address"
                    />
                  </div>

                  <label className="text-warning ml-3" htmlFor="ex">
                    <strong>{symbol} Withdrawal Amount</strong>
                  </label>
                  <div className="form-group mx-3">
                    <input
                      type="text"
                      className="form-control"
                      value=""
                      placeholder="Amount"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary ml-3 mb-3">
                    Submit
                  </button>
                </form>
                {this.state.isLoadSpinner ? <Spinner /> : null}
              </div>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Withdrawal;
