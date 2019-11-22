import React from "react";
import TradingForm from "./tradingForm";
import { Link } from "react-router-dom";
import trade from "../services/tradeService";
import { toast } from "react-toastify";
import Spinner from "./spinner";

class BuyInstantOrderForm extends TradingForm {
  state = {
    data: { price: "", quantity: "", total: "", type: 0 },
    errors: {},
    total: 0,
    spinnerStatus: false
  };

  doSubmit = async () => {
    this.setState({ spinnerStatus: true });
    try {
      const { data } = this.state;

      const response = await trade.buy(
        this.props.selectedPair.id,
        data.type,
        data.price,
        data.quantity
      );

      this.resetFormData();
      this.props.onTrade();

      // console.log(response);
      toast.success(response);
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 400) {
          // const errors = { ...this.state.errors };
          // errors.username = ex.response.data;
          // this.setState({ errors });
          // toast.error(ex.response.data);

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
    this.setState({ spinnerStatus: false });
  };

  render() {
    const { selectedPair, selectedPairStats } = this.props;

    this.state.data.price = selectedPairStats.last_price;

    return (
      <td>
        <div className="tv_ammount-form-block">
          {Object.keys(selectedPair).length > 0 && (
            <form onSubmit={this.handleSubmit} className="form-horizontal">
              {this.renderReadOnlyInputTradeForm(
                "price",
                "Price",
                "Market",
                selectedPair.quote_currency_symbol
              )}
              {this.renderInputHidden("price")}
              {this.renderInputHidden("type")}
              {this.renderInputTradeForm(
                "quantity",
                "Quantity",
                selectedPair.base_currency_symbol,
                "number"
              )}
              {/* {this.renderInputTradeForm(
                "total",
                "Total",
                selectedPair.quote_currency_symbol,
                "number",
                true
              )}
              <div className="form-group row">
                <label
                  htmlFor="tv_a_balance_two"
                  className="col-3 col-form-label"
                >
                  Balance
                </label>
                <div className="col-9 form-input-block readonly">
                  <input
                    className="form-control"
                    type="text"
                    value={this.getAvailableBalance()}
                    id="tv_a_balance_two"
                    readOnly
                  />
                  <span className="tv-btc-tag">
                    {selectedPair.quote_currency_symbol}
                  </span>
                </div>
              </div> */}
              {/* {this.renderInputTradeForm(
                "commission",
                "Commission",
                "EUR",
                "number",
                true
              )} */}
              {/* {this.renderInputTradeForm(
                "balance",
                "Balance",
                "BTC",
                "number",
                true
              )} */}
              {/* {this.renderReadOnlyInputTradeForm(
                "total",
                "Total",
                this.state.total,
                selectedPair.quote_currency_symbol,
                "number"
              )} */}
              {this.renderReadOnlyInputTradeForm(
                "balance",
                "Balance",
                this.getAvailableBalance(),
                selectedPair.quote_currency_symbol,
                "number"
              )}
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

export default BuyInstantOrderForm;
