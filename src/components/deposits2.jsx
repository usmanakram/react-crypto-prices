import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import http from "../services/httpService";
import { toast } from "react-toastify";
import auth from "../services/authService";
import Spinner from "./spinner";

import copy from "copy-to-clipboard";
import Header from "./header";
import ThemeTable from "./themeTable";
import { themeTableHeadings, themeTableValue } from "../services/fakeExchange";

var QRCode = require("qrcode.react");

class Deposits2 extends Component {
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

  handleLoadComponent = () => {
    this.setState({
      isLoadComponent: true
    });
  };

  handleCopy = () => {
    const username = this.username.current.value;
    copy(username);
  };

  handleLoadSpinner = () => {
    this.setState({
      isLoadComponent: true
    });
  };

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
          this.value +
          " is not functional right now. Please, try again later"
      );
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
        <div className="row spinner_wrapper my-5">
          <div className="col-md-10 offset-1 mt-20 ">
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
                    <td>0.00000000 {symbol}</td>
                  </tr>

                  <tr>
                    <td>In Order</td>
                    <td>0.00000000 {symbol}</td>
                  </tr>
                  <tr>
                    <td>Available balance</td>
                    <td>0.00000000 {symbol}</td>
                    <td>
                      <Link to="/">
                        <i
                          className="fa fa-info-circle fa-fw"
                          aria-hidden="true"
                        ></i>
                        What's
                        {symbol}?
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-10 offset-1  ">
              <div className="border mb-20 adbox">
                <h5 className="text-warning mt-4 ml-3">
                  <strong>Important</strong>
                </h5>
                <p className="text-warning ml-3">
                  Send only <strong>{symbol}</strong> to this deposit address.
                  Sending any other coin or token to this address may result in
                  the loss of your deposit.
                </p>
                <h5 className="text-warning ml-3 mb-3">
                  <strong>{symbol} Deposit Address</strong>
                </h5>

                <div className="form-group addpdglr15">
                  <input
                    ref={this.username}
                    readOnly
                    type="text"
                    className="form-control disabled text-center"
                    value={address}
                  />
                </div>

                <button
                  onClick={this.handleLoadComponent}
                  type="button"
                  className="btn btn-primary btn-md mt-20 mx-3 mb-4 "
                  style={{ marginBottom: 20 }}
                  data-toggle="modal"
                  data-target="#myModal"
                >
                  <i className="fa fa-qrcode fa-fw" aria-hidden="true"></i>
                  Show QR Code
                </button>

                <button
                  onClick={this.handleCopy}
                  type="button"
                  className="btn btn-primary btn-md mt-20 ml-1 mb-4"
                  style={{ marginBottom: 20 }}
                >
                  <i className="fa fa-clipboard fa-fw" aria-hidden="true"></i>
                  Copy Address
                </button>
              </div>
            </div>

            {this.state.isLoadSpinner ? <Spinner /> : null}

            <div className="modal fade" id="myModal" role="dialog">
              <div className="modal-dialog modal-sm">
                {/* <!-- Modal content--> */}
                <div className="modal-content">
                  <div className="modal-header ">
                    Deposit Address
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                    ></button>
                  </div>
                  <div className="modal-body">
                    {this.state.isLoadComponent ? (
                      <div className="center">
                        <QRCode
                          value={address}
                          size={230}
                          level={"H"}
                          includeMargin={true}
                        />
                      </div>
                    ) : null}
                    <p className="ow">{address}</p>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}

        {/* <ThemeTable
          themeTableHeadings={themeTableHeadings}
          themeTableValue={themeTableValue}
        /> */}
      </React.Fragment>
    );
  }
}

export default Deposits2;
