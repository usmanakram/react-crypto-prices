import React from "react";
import { Link } from "react-router-dom";
import TradingForm from "./tradingForm";
import Joi from "joi-browser";
import trade from "../services/tradeService";
import { toast } from "react-toastify";
import Spinner from "./spinner";

class BuyStopLimitForm extends TradingForm {
  state = {
    data: {
      stop: "",
      price: "",
      quantity: "",
      total: "",
      type: 2
    },
    errors: {},
    total: 0,
    spinnerStatus: false
  };

  schema = {
    type: Joi.number()
      .required()
      .label("type"),
    stop: Joi.number()
      .required()
      .label("Stop"),
    price: Joi.number()
      .required()
      .label("Price"),
    quantity: Joi.number()
      .required()
      .label("Quantity"),
    total: Joi.number()
      .required()
      .label("Total")
  };

  doSubmit = async () => {
    this.setState({ spinnerStatus: true });

    // console.log("buyOrder form validated");

    try {
      const { data } = this.state;
      // console.log(data);

      const response = await trade.buy(
        this.props.selectedPair.id,
        data.type,
        data.price,
        data.quantity,
        data.stop
      );

      this.resetFormData();
      this.props.onTrade();

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
    this.setState({ spinnerStatus: false });
  };

  render() {
    const { selectedPair } = this.props;

    return (
      <td>
        <div className="tv_ammount-form-block">
          {Object.keys(selectedPair).length > 0 && (
            <form onSubmit={this.handleSubmit} className="form-horizontal">
              {this.renderInputHidden("type")}
              {this.renderInputTradeForm(
                "stop",
                "Stop",
                selectedPair.quote_currency_symbol,
                "number"
              )}
              {this.renderInputTradeForm(
                "price",
                "Price",
                selectedPair.quote_currency_symbol,
                "number"
              )}
              {this.renderInputTradeForm(
                "quantity",
                "Quantity",
                selectedPair.base_currency_symbol,
                "number"
              )}
              {this.renderReadOnlyInputTradeForm(
                "total",
                "Total",
                this.state.total,
                selectedPair.quote_currency_symbol,
                "number"
              )}
              {this.renderReadOnlyInputTradeForm(
                "balance",
                "Balance",
                this.getAvailableBalance(),
                selectedPair.quote_currency_symbol,
                "number"
              )}
              {/* {this.renderInputTradeForm(
                "commission",
                "Commission",
                "EUR",
                "number",
                true
              )} */}
              <div className="form-group row">
                <label className="col-3 col-form-label"></label>
                <div className="col-9 form-input-block">
                  {this.user &&
                    this.renderTradeButton(
                      `Buy ${selectedPair.base_currency_symbol}`,
                      "buy-btn"
                    )}
                  <Spinner status={this.state.spinnerStatus} />

                  {!this.user && (
                    <Link to="/login" className="btn buy-btn">
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </td>
    );
  }
}

export default BuyStopLimitForm;
