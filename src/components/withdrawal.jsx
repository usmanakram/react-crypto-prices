import React, { Component } from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { Link, Redirect } from "react-router-dom";
import http from "../services/httpService";
import { toast } from "react-toastify";
import auth from "../services/authService";
import Spinner from "./spinner";
import Header from "./header";

class Withdrawal extends Form {
  state = {
    data: { address: "", quantity: "" },
    errors: {},
    selectedCurrency: {},
    currencies: [],
    transactions: []
  };

  schema = {
    address: Joi.string()
      .required()
      .label("Address"),
    quantity: Joi.string()
      .required()
      .label("Quantity")
  };

  async componentDidMount() {
    try {
      const { data } = await http.get("/get-all-currencies");

      const currencies = data.find(c => c.symbol === "BTC");

      // Populate BTC address and relevant data
      const { data: selectedCurrency } = await http.get(
        "/auth/get-deposit-address/BTC"
      );

      this.setState({ currencies, selectedCurrency });
    } catch (ex) {
      console.log(ex);
    }
  }

  doSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("address", this.state.data.address);
      formData.append("quantity", this.state.data.quantity);

      const { data } = await http.post("/auth/withdraw", formData);

      console.log("form response");
      console.log(data);
    } catch (ex) {
      console.log(ex);
    }
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

        <div className="row spinner_wrapper mt-5">
          <div className="col-md-10 offset-1">
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
            <div className="row">
              <div
                className="
              col-lg-10
              col-md-10
              col-sm-10
              offset-1
              my-3"
              >
                <div className="col-12">
                  <strong>Total balance:</strong>{" "}
                  {selectedCurrency.total_balance} {symbol}
                  <br />
                  <strong>In Order </strong> {selectedCurrency.in_order_balance}{" "}
                  {symbol}
                  <br />
                  <strong>Available balance: </strong>{" "}
                  {selectedCurrency.total_balance -
                    selectedCurrency.in_order_balance}
                  {symbol}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-10 offset-1  mb-5">
                <div className="border mb-20 adbox">
                  <h5 className="text-warning mt-4 ml-3">
                    <strong>Important</strong>
                  </h5>
                  <span className="text-warning ml-3">
                    Provide only <strong>{symbol}</strong> address. Providing
                    any other coin or token address may result in the loss of
                    your balance.
                  </span>
                  <form onSubmit={this.handleSubmit}>
                    <div className="mx-3 mb-3">
                      {this.renderInput("address", "Address")}
                      {this.renderInput("quantity", "Quantity")}
                      {this.renderButton("Withdraw", "btn-default")}
                    </div>
                  </form>
                  {this.state.isLoadSpinner ? <Spinner /> : null}
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Withdrawal;
