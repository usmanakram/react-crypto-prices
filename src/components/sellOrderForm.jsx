import React from "react";
import TradingForm from "./tradingForm";
import trade from "../services/tradeService";
import { toast } from "react-toastify";
import auth from "../services/authService";
import { Link } from "react-router-dom";

class SellOrderForm extends TradingForm {
  doSubmit = async () => {
    // console.log("sellOrder form validated");

    try {
      const { data } = this.state;
      // console.log(data);

      const response = await trade.sell(
        this.props.selectedPair.id,
        data.price,
        data.quantity
      );

      this.resetFormData();
      this.props.onTrade();

      // console.log(response);
      toast.success(response);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        // const errors = { ...this.state.errors };
        // errors.username = ex.response.data;
        // this.setState({ errors });
        // toast.error(ex.response.data);

        // console.log(ex.response.data);
        toast.error(ex.response.data);
      }
    }
  };

  render() {
    const { selectedPair } = this.props;
    const user = auth.getCurrentUser();

    return (
      <div className="col-md-6">
        <h3>
          Sell {selectedPair.base_currency_symbol}{" "}
          <small>
            {this.getAvailableBalance()} {selectedPair.base_currency_symbol}
          </small>
        </h3>
        {Object.keys(selectedPair).length > 0 && (
          <form onSubmit={this.handleSubmit} className="form-horizontal">
            {this.renderHorizontalFormInput("price", "Price", "number")}
            {this.renderHorizontalFormInput("quantity", "Quantity", "number")}
            {this.renderHorizontalFormInput("total", "Total", "number", true)}
            {user &&
              this.renderButton(
                `Sell ${selectedPair.base_currency_symbol}`,
                "btn-block btn-danger"
              )}
            {!user && (
              <Link to="/login" className="btn btn-primary btn-block">
                Login
              </Link>
            )}
          </form>
        )}
      </div>
    );
  }
}

export default SellOrderForm;
