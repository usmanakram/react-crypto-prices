import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { Redirect } from "react-router-dom";
import http from "../services/httpService";
import auth from "../services/authService";
import Spinner from "./spinner";
import Header from "./header";
import { toast } from "react-toastify";

class Withdrawal extends Form {
  state = {
    data: { currency: "", address: "", quantity: "", verification_code: "" },
    errors: {},
    selectedCurrency: {},
    currencies: [],
    transactions: [],
    WithdrawalLoader: false
  };

  schema = {
    currency: Joi.string().required(),
    address: Joi.string()
      .required()
      .label("Address"),
    quantity: Joi.string()
      .required()
      .label("Quantity"),
    verification_code: Joi.string()
      .required()
      .label("verification_code")
  };

  async componentDidMount() {
    try {
      this.setState({ WithdrawalLoader: true });
      const { data } = await http.get("/get-all-currencies");

      const currencies = data.filter(c => ["BTC", "BC"].includes(c.symbol));
      // const currencies = [
      //   { name: "Bitcoin", symbol: "BTC" },
      //   { name: "Bittrain Coin", symbol: "BC" }
      // ];
      // Populate BTC address and relevant data
      const { data: selectedCurrency } = await http.get(
        "/auth/get-deposit-address/BTC"
      );

      this.setState({ currencies, selectedCurrency, WithdrawalLoader: false });
    } catch (ex) {
      console.log(ex);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedCurrency } = this.state;
    const { selectedCurrency: prevCurrency } = prevState;

    const data = { currency: selectedCurrency.currency_symbol };

    if (
      Object.keys(selectedCurrency).length &&
      (Object.keys(prevCurrency).length === 0 ||
        selectedCurrency.currency_id !== prevCurrency.currency_id)
    ) {
      if (selectedCurrency.currency_symbol === "BC") {
        if (selectedCurrency.withdrawal_requested) {
          data.verification_code = "";
          this.schema = {
            currency: Joi.string().required(),
            verification_code: Joi.string()
              .required()
              .label("verification_code")
          };
        } else {
          data.quantity = "";
          this.schema = {
            currency: Joi.string().required(),
            quantity: Joi.string()
              .required()
              .label("Quantity")
          };
        }
      } else {
        data.address = "";
        data.quantity = "";
        this.schema = {
          currency: Joi.string().required(),
          address: Joi.string()
            .required()
            .label("Address"),
          quantity: Joi.string()
            .required()
            .label("Quantity")
        };
      }

      this.setState({ data });
    }
  }

  doSubmit = async () => {
    console.log("this.schema");
    console.log(this.schema);
    const { selectedCurrency, data } = this.state;
    let url = "";

    try {
      const formData = new FormData();
      formData.append("currency", data.currency);

      if (selectedCurrency.currency_symbol === "BC") {
        url = "/auth/withdraw-bittrain";
        if (selectedCurrency.withdrawal_requested)
          formData.append("verification_code", data.verification_code);
        else formData.append("quantity", data.quantity);
      } else {
        url = "/auth/withdraw";
        formData.append("address", data.address);
        formData.append("quantity", data.quantity);
      }

      var { data: response } = await http.post(url, formData);

      console.log("form response");
      console.log(response);
      toast.success(response);
      selectedCurrency.withdrawal_requested = true;
      this.setState({ selectedCurrency });
    } catch (ex) {
      if (ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    }
  };

  handleCurrencyChange = async ({ currentTarget: select }) => {
    try {
      this.setState({ WithdrawalLoader: true });

      const { data: selectedCurrency } = await http.get(
        "/auth/get-deposit-address/" + select.value
      );

      this.setState({ selectedCurrency, WithdrawalLoader: false });
    } catch (ex) {
      console.log(ex);
    }
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;

    const { selectedCurrency } = this.state;
    console.log("selectedCurrency");
    console.log(selectedCurrency);
    let symbol;

    if (Object.keys(selectedCurrency).length) {
      /* const {
        selectedCurrency: {
          address,
          currency: { name, symbol }
        }
      } = this.state; */
      // address = selectedCurrency.address;
      // name = selectedCurrency.currency.name;
      symbol = selectedCurrency.currency.symbol;
    }

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>
        <div className="container">
          <div className="row mt-3">
            <div className="col-12">
              <div className="latest-tranjections-block-inner panel-heading-block mb-2">
                <h5>Withdrawal</h5>
              </div>
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

          <React.Fragment>
            <div className="row">
              <div
                className="
              col-12
              my-2"
              >
                <strong>Total balance:</strong>
                {"   "}
                {selectedCurrency.total_balance} {symbol}
                <br />
                <strong>In Order </strong> {selectedCurrency.in_order_balance}
                {"   "}
                {symbol}
                <br />
                <strong>Available balance: </strong>
                {"   "}
                {selectedCurrency.total_balance -
                  selectedCurrency.in_order_balance}
                {symbol}
              </div>
            </div>
            <div className="row">
              <div className="col-12 mb-3">
                <div className="border adbox">
                  <h5 className="text-warning mt-3 ml-3">
                    <strong>Important</strong>
                  </h5>
                  <p className="text-warning ml-3">
                    Provide only <strong>{symbol}</strong> address. Providing
                    any other coin or token address may result in the loss of
                    your balance.
                  </p>
                  <form onSubmit={this.handleSubmit}>
                    {this.renderInputHidden("currency")}
                    <div className="mx-3 mb-3">
                      {selectedCurrency.currency_symbol === "BC"
                        ? null
                        : this.renderInput("address", "Address")}

                      <Spinner status={this.state.WithdrawalLoader} />
                      {selectedCurrency.currency_symbol === "BC" &&
                      selectedCurrency.withdrawal_requested === true
                        ? null
                        : this.renderInput("quantity", "Quantity")}

                      {selectedCurrency.currency_symbol === "BC" &&
                      selectedCurrency.withdrawal_requested === true
                        ? this.renderInput(
                            "verification_code",
                            "Send verification_code Code to your Email Adress (abc123@gmail.com)."
                          )
                        : null}
                      {selectedCurrency.currency_symbol === "BC" &&
                      selectedCurrency.withdrawal_requested === true
                        ? (this.renderButton("Resen Code", "btn-default mr-3"),
                          this.renderButton("Withdraw", "btn-default"))
                        : this.renderButton("Withdraw", "btn-default")}
                    </div>
                  </form>
                  {this.state.isLoadSpinner ? <Spinner /> : null}
                </div>
              </div>
            </div>
          </React.Fragment>
        </div>
      </React.Fragment>
    );
  }
}

export default Withdrawal;
