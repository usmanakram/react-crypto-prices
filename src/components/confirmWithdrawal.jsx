import React, { Component } from "react";
import trade from "../services/tradeService";
import { toast } from "react-toastify";
import Header from "./header";

class ConfirmWithdrawal extends Component {
  state = {
    id: "",
    transaction_id: "",
    verification_token: "",
    username: "",
    quantity: "",
    currency: "",
    address: "",
  };

  async componentDidMount() {
    const { id, transaction_id, verification_token } = this.props.match.params;
    this.setState({ id, transaction_id, verification_token });

    try {
      const response = await trade.getWithdrawalRequest([
        id,
        transaction_id,
        verification_token,
      ]);

      this.setState({
        username: response.user.username,
        quantity: response.amount,
        currency: response.currency.symbol,
        address: response.address,
      });
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 400) {
          toast.error(ex.response.data);
        } else if (ex.response.status === 404) {
          toast.error("Invalid / Expired URL");
        } else if (ex.response.status === 422) {
          // Laravel returns 422 against form validation errors
          const { errors } = ex.response.data;

          for (let item in errors) {
            toast.error(errors[item][0]);
          }
        }
        setTimeout(function () {
          window.location =
            process.env.REACT_APP_BASENAME + "/transactionHistory";
        }, 3000);
      }
    }
  }

  doSubmit = async (status) => {
    const { id, transaction_id, verification_token } = this.state;

    try {
      const response = await trade.updateWithdrawalRequest({
        id,
        transaction_id,
        verification_token,
        status,
      });

      toast.success(response);

      setTimeout(function () {
        window.location =
          process.env.REACT_APP_BASENAME + "/transactionHistory";
      }, 3000);
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 400) {
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
  };

  confirmWithdrawal = () => this.doSubmit(1);
  cancelWithdrawal = () => this.doSubmit(2);

  render() {
    const { username, quantity, currency, address } = this.state;

    return (
      <div className="user-login-signup-section modal-container">
        <Header />
        <div className="container">
          <div className="user-login-signup-form-wrap">
            <div className="modal-content">
              <h3>Confirm Withdrawal Request</h3>
              <div className="modal-body">
                <div className="modal-info-block">
                  <p>Always ensure you're on the correct website</p>
                  <div className="block-inner">
                    <p>
                      <span>
                        <i className="fas fa-lock"></i>
                        https://
                      </span>
                      zuedex.com
                    </p>
                  </div>
                </div>
                <div className="user-connected-form-block">
                  <p>Hi {username},</p>
                  <p>
                    You have requested to withdraw {quantity} {currency} to{" "}
                    {address}.
                  </p>
                  <p>Kindly, confirm your withdrawal request.</p>
                  <div className="text-center my-2">
                    <button
                      className="btn btn-success"
                      style={{ margin: "0 5px" }}
                      onClick={this.confirmWithdrawal}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ margin: "0 5px" }}
                      onClick={this.cancelWithdrawal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmWithdrawal;
