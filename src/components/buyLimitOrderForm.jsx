import React from "react";
import { Link } from "react-router-dom";
import TradingForm from "./tradingForm";
import trade from "../services/tradeService";
import { toast } from "react-toastify";

class BuyLimitOrderForm extends TradingForm {
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
      <td>
        <div className="tv_ammount-form-block">
          {Object.keys(selectedPair).length > 0 && (
            <form onSubmit={this.handleSubmit} className="form-horizontal">
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

              {this.renderInputTradeForm(
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
                  Available Balance
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
              </div>
              {/* {this.renderInputTradeForm(
                "commission",
                "Commission",
                "EUR",
                "number",
                true
              )} */}
              {/* {this.renderInputTradeForm(
                "balance",
                "Available Balance",
                "BTC",
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

export default BuyLimitOrderForm;
