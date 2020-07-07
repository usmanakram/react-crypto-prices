import React from "react";
import { Redirect } from "react-router-dom";
import auth from "../services/authService";
import Header from "./header";
import Table from "./common/table";
import http from "../services/httpService";
import Form from "./common/form";
import Joi from "joi-browser";
import Spinner from "./spinner";
import { toast } from "react-toastify";
import debug from "../utils/debuger";

class NovusTransactionHistory extends Form {
  state = {
    deposits: [],
    withdrawals: [],
    data: { currency: "", address: "", quantity: "", verification_code: "" },
    errors: {},
    selectedCurrency: {},
    isTransferAreaVisible: false,
    isLoadSpinner: false,
  };

  columns = [
    { path: "status_text", label: "Status" },
    { path: "currency.symbol", label: "Coin" },
    { path: "amount", label: "Amount" },
    { path: "fee", label: "Fee", content: (t) => t.fee.toFixed(8) },
    { path: "created_at", label: "Date" },
    // { path: "address", label: "Information" },
  ];

  schema = { currency: Joi.string().required() };

  async componentDidMount() {
    this.setState({ isLoadSpinner: true });
    try {
      // const { data } = await http.get("/auth/get-transactions-history?currency=BC");
      // // Populate NTN data
      // const { data: selectedCurrency } = await http.get("/auth/get-deposit-address/NTN");

      const dataPromise = http.get(
        "/auth/get-transactions-history?currency=NTN"
      );
      // Populate NTN data
      const selectedCurrencyPromise = http.get("/auth/get-deposit-address/NTN");
      const userPromise = http.get("/auth/profile");
      const [
        { data },
        { data: selectedCurrency },
        { data: user },
      ] = await Promise.all([
        dataPromise,
        selectedCurrencyPromise,
        userPromise,
      ]);

      if (user.belongsTo !== "novus") {
        console.log("condition met");
        window.location = process.env.REACT_APP_BASENAME + "/";
      }

      const dataState = this.handleValidation(selectedCurrency);

      this.setState({
        deposits: data.deposits,
        withdrawals: data.withdrawals,
        selectedCurrency,
        data: dataState,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        debug.log(ex.response.data);
      }
    }
    this.setState({ isLoadSpinner: false });
  }

  handleValidation = (selectedCurrency) => {
    const data = { currency: selectedCurrency.currency_symbol };

    if (Object.keys(selectedCurrency).length) {
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

      return data;
    }
  };

  doSubmit = async () => {
    const { selectedCurrency, data } = this.state;
    let url = "";

    this.setState({ isLoadSpinner: true });
    try {
      const formData = new FormData();
      formData.append("currency", data.currency);

      url = "/auth/withdraw-novus";
      if (selectedCurrency.withdrawal_requested)
        formData.append("verification_code", data.verification_code);
      else formData.append("quantity", data.quantity);

      const { data: response } = await http.post(url, formData);

      toast.success(response);

      data.quantity = "";

      const historyPromise = http.get(
        "/auth/get-transactions-history?currency=NTN"
      );
      const selectedCurrencyPromise = http.get("/auth/get-deposit-address/NTN");
      const [
        { data: history },
        { data: selectedCurrencyData },
      ] = await Promise.all([historyPromise, selectedCurrencyPromise]);

      this.setState({
        data,
        deposits: history.deposits,
        withdrawals: history.withdrawals,
        selectedCurrency: selectedCurrencyData,
      });

      // Withdraw to Novus without verification implemented
      // selectedCurrency.withdrawal_requested = !selectedCurrency.withdrawal_requested;
      // const dataState = this.handleValidation(selectedCurrency);
      // this.setState({ selectedCurrency, data: dataState });
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

  handleTransferAreaVisibility = () => {
    this.setState({ isTransferAreaVisible: !this.state.isTransferAreaVisible });
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;
    const {
      deposits,
      withdrawals,
      selectedCurrency,
      isLoadSpinner,
    } = this.state;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>

        <div className="container my-3">
          <div className="row">
            <div className="col-12">
              <div className="text-right mb-2">
                {this.state.isTransferAreaVisible || (
                  <button
                    className="btn btn-primary"
                    onClick={this.handleTransferAreaVisibility}
                  >
                    Transfer to Novus
                  </button>
                )}
              </div>
            </div>
          </div>
          {this.state.isTransferAreaVisible && (
            <div className="row">
              <div className="col-12">
                <div className="latest-tranjections-block-inner panel-heading-block mb-2">
                  <h5>Transfer to Novus</h5>
                </div>
              </div>

              <div className="col-12">
                <div className="col-12">
                  <strong>Total balance:</strong>
                  {"   "}
                  {selectedCurrency.total_balance}{" "}
                  {selectedCurrency.currency_symbol}
                  <br />
                  <strong>In Order:</strong> {selectedCurrency.in_order_balance}
                  {"   "}
                  {selectedCurrency.currency_symbol}
                  <br />
                  <strong>Available balance:</strong>
                  {"   "}
                  {selectedCurrency.total_balance -
                    selectedCurrency.in_order_balance}
                  {selectedCurrency.currency_symbol}
                </div>
              </div>

              <div className="col-12 mb-3">
                <div className="border adbox">
                  <h5 className="text-danger mt-3 ml-3">
                    <strong>Important</strong>
                  </h5>
                  <p className="text-danger ml-3">
                    Minimum 20 NTN can be transferred.
                  </p>
                  <form onSubmit={this.handleSubmit}>
                    {this.renderInputHidden("currency")}
                    <div className="mx-3 mb-3">
                      <Spinner status={isLoadSpinner} />
                      {selectedCurrency.withdrawal_requested === true
                        ? this.renderInput(
                            "verification_code",
                            "Verification Code"
                          )
                        : this.renderInput("quantity", "Quantity")}
                      {selectedCurrency.withdrawal_requested === true
                        ? (this.renderButton("Resen Code", "btn-default mr-3"),
                          this.renderButton("Withdraw", "btn-default"))
                        : this.renderButton("Withdraw", "btn-default")}

                      <button
                        className="btn btn-primary float-right"
                        onClick={this.handleTransferAreaVisibility}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                  {isLoadSpinner ? <Spinner /> : null}
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-12">
              <div className="latest-tranjections-block-inner panel-heading-block mb-2">
                <h5>Novus Transaction History</h5>
              </div>
            </div>
          </div>

          <div className="ticker-head">
            <ul className="nav nav-tabs ticker-nav" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href="#deposits"
                  role="tab"
                  data-toggle="tab"
                >
                  Deposits History
                  <i className="fa fa-stroopwafel"></i>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#withdrawals"
                  role="tab"
                  data-toggle="tab"
                >
                  Withdrawals History
                  <i className="fa fa-stroopwafel"></i>
                </a>
              </li>
            </ul>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="tab-content latest-tranjections-block-inner">
                <div className="tab-content">
                  <div
                    role="tabpanel"
                    className="tab-pane fade in active show"
                    id="deposits"
                  >
                    <Table
                      columns={this.columns}
                      data={deposits}
                      classes="coin-list latest-tranjections-table"
                      sortColumn=""
                    />
                  </div>
                  <div
                    role="tabpanel"
                    className="tab-pane fade"
                    id="withdrawals"
                  >
                    <Table
                      columns={this.columns}
                      data={withdrawals}
                      classes="coin-list latest-tranjections-table"
                      sortColumn=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NovusTransactionHistory;
