import React from "react";
import TradingForm from "./tradingForm";
import trade from "../services/tradeService";
import { toast } from "react-toastify";

class BuyOrderForm extends TradingForm {
  doSubmit = async () => {
    // console.log("buyOrder form validated");

    try {
      const { data } = this.state;
      // console.log(data);

      const response = await trade.buy(
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

    return (
      <div className="col-md-6">
        <h3>
          Buy {selectedPair.base_currency_symbol}{" "}
          <small>
            {this.getAvailableBalance()} {selectedPair.quote_currency_symbol}
          </small>
        </h3>
        {Object.keys(selectedPair).length > 0 && (
          <form onSubmit={this.handleSubmit} className="form-horizontal">
            {this.renderHorizontalFormInput("price", "Price", "number")}
            {this.renderHorizontalFormInput("quantity", "Quantity", "number")}
            {this.renderHorizontalFormInput("total", "Total", "number", true)}
            {this.renderButton(
              `Buy ${selectedPair.base_currency_symbol}`,
              "btn-block btn-success"
            )}
          </form>
        )}
      </div>
    );
  }
}

export default BuyOrderForm;
