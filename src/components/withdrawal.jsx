import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { Redirect } from "react-router-dom";
import http from "../services/httpService";
import auth from "../services/authService";
import Spinner from "./spinner";
import Header from "./header";
import { toast } from "react-toastify";
import debug from "../utils/debuger";

class Withdrawal extends Form {
  state = {
    data: { currency: "", address: "", quantity: "", verification_code: "" },
    errors: {},
    selectedCurrency: {},
    currencies: [],
    transactions: [],
    isLoadSpinner: false,
  };

  schema = { currency: Joi.string().required() };

  async componentDidMount() {
    try {
      this.setState({ isLoadSpinner: true });
      const { data } = await http.get("/get-all-currencies");

      const currencies = data.filter(
        (c) =>
          ["BTC", "BC", "NTN"].includes(c.symbol) &&
          c.is_withdraw_allowed === true
      );
      // const currencies = [
      //   { name: "Bitcoin", symbol: "BTC" },
      //   { name: "Bittrain Coin", symbol: "BC" }
      // ];

      /**
       * for BC withdrawal:
       * if request already placed then show hidden field for enter code.
       * and hide quantity field
       */
      // Populate BTC address and relevant data
      const { data: selectedCurrency } = await http.get(
        "/auth/get-deposit-address/BTC"
      );

      const dataState = this.handleValidation(selectedCurrency);

      this.setState({
        currencies,
        selectedCurrency,
        data: dataState,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
      debug.log(ex);
    }
    this.setState({ isLoadSpinner: false });
  }

  doSubmit = async () => {
    const { selectedCurrency, data } = this.state;
    let url = "";

    try {
      this.setState({ isLoadSpinner: true });
      const formData = new FormData();
      formData.append("currency", data.currency);

      if (selectedCurrency.currency_symbol === "BC") {
        url = "/auth/withdraw-bittrain";
        if (selectedCurrency.withdrawal_requested)
          formData.append("verification_code", data.verification_code);
        else formData.append("quantity", data.quantity);
      } else if (selectedCurrency.currency_symbol === "NTN") {
        url = "/auth/withdraw-novus";
        if (selectedCurrency.withdrawal_requested)
          formData.append("verification_code", data.verification_code);
        else formData.append("quantity", data.quantity);
      } else {
        url = "/auth/withdraw";
        formData.append("address", data.address);
        formData.append("quantity", data.quantity);
      }

      const { data: response } = await http.post(url, formData);

      toast.success(response);

      // if (selectedCurrency.currency_symbol === "BC") {
      if (["BC", "NTN"].includes(selectedCurrency.currency_symbol)) {
        selectedCurrency.withdrawal_requested = !selectedCurrency.withdrawal_requested;
        const dataState = this.handleValidation(selectedCurrency);
        this.setState({ selectedCurrency, data: dataState });
      }
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 404) {
          debug.log(ex.response.data);
        } else if (ex.response.status === 400) {
          toast.error(ex.response.data);
        } else if (ex.response.status === 422) {
          // Laravel returns 422 against form validation errors
          const { errors } = ex.response.data;

          for (let item in errors) {
            toast.error(errors[item][0]);
          }
        }
      }
    }
    this.setState({ isLoadSpinner: false });
  };

  handleValidation = (selectedCurrency) => {
    const data = { currency: selectedCurrency.currency_symbol };

    if (Object.keys(selectedCurrency).length) {
      // if (selectedCurrency.currency_symbol === "BC") {
      if (["BC", "NTN"].includes(selectedCurrency.currency_symbol)) {
        if (selectedCurrency.withdrawal_requested) {
          data.verification_code = "";
          this.schema = {
            currency: Joi.string().required(),
            verification_code: Joi.string()
              .required()
              .length(6)
              .label("Verification Code"),
          };
        } else {
          data.quantity = "";
          this.schema = {
            currency: Joi.string().required(),
            quantity: Joi.string().required().label("Quantity"),
          };
        }
      } else {
        data.address = "";
        data.quantity = "";
        this.schema = {
          currency: Joi.string().required(),
          address: Joi.string().required().label("Address"),
          quantity: Joi.string().required().label("Quantity"),
        };
      }

      // this.setState({ data });
      // this.state.data = data;
      return data;
    }
  };

  handleCurrencyChange = async ({ currentTarget: select }) => {
    try {
      this.setState({ isLoadSpinner: true });

      const { data: selectedCurrency } = await http.get(
        "/auth/get-deposit-address/" + select.value
      );

      const data = this.handleValidation(selectedCurrency);
      this.setState({ selectedCurrency, isLoadSpinner: false, data });
    } catch (ex) {
      debug.log(ex);
    }
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;

    const { selectedCurrency, isLoadSpinner } = this.state;
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
                {this.state.currencies.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
                <h5 className="text-danger mt-3 ml-3">
                  <strong>Important</strong>
                </h5>
                <p className="text-danger ml-3">
                  Provide only <strong>{symbol}</strong> address. Providing any
                  other coin or token address may result in the loss of your
                  balance.
                </p>
                <form onSubmit={this.handleSubmit}>
                  {this.renderInputHidden("currency")}
                  <div className="mx-3 mb-3">
                    {["BC", "NTN"].includes(selectedCurrency.currency_symbol)
                      ? null
                      : this.renderInput("address", "Address")}

                    <Spinner status={isLoadSpinner} />
                    {["BC", "NTN"].includes(selectedCurrency.currency_symbol) &&
                    selectedCurrency.withdrawal_requested === true
                      ? null
                      : this.renderInput("quantity", "Quantity")}

                    {["BC", "NTN"].includes(selectedCurrency.currency_symbol) &&
                    selectedCurrency.withdrawal_requested === true
                      ? this.renderInput(
                          "verification_code",
                          "Verification Code"
                        )
                      : null}
                    {["BC", "NTN"].includes(selectedCurrency.currency_symbol) &&
                    selectedCurrency.withdrawal_requested === true
                      ? (this.renderButton("Resen Code", "btn-default mr-3"),
                        this.renderButton("Withdraw", "btn-default"))
                      : this.renderButton("Withdraw", "btn-default")}
                  </div>
                </form>
                {isLoadSpinner ? <Spinner /> : null}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Withdrawal;
