import React from "react";
import { Link } from "react-router-dom";
import TradingForm from "./tradingForm";
import trade from "../services/tradeService";
import { toast } from "react-toastify";
import Spinner from "./spinner";

class SellLimitOrderForm extends TradingForm {
  state = {
    data: { price: "", quantity: "", total: "", type: 1 },
    errors: {},
    total: 0,
    sellLimitOrderFormSpinner: false
  };

  doSubmit = async () => {
    // console.log("buyOrder form validated");

    try {
      this.setState({ sellLimitOrderFormSpinner: true });
      const { data } = this.state;
      // console.log(data);

      const response = await trade.sell(
        this.props.selectedPair.id,
        data.type,
        data.price,
        data.quantity
      );

      this.resetFormData();
      this.props.onTrade();

      toast.success(response);
      this.setState({ sellLimitOrderFormSpinner: false });
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
              {this.renderInputHidden("type")}
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
                  Available balance
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
                    {selectedPair.base_currency_symbol}
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
                "Available Balance",
                "BTC",
                "number",
                true
              )} */}

              {this.renderReadOnlyInputTradeForm(
                "total",
                "Total",
                this.state.total,
                selectedPair.quote_currency_symbol,
                "number"
              )}
              {this.renderReadOnlyInputTradeForm(
                "balance",
                "Available Balance",
                this.getAvailableBalance(),
                selectedPair.base_currency_symbol,
                "number"
              )}
              <div className="form-group row">
                <label className="col-3 col-form-label"></label>
                <div className="col-9 form-input-block">
                  {this.user &&
                    this.renderTradeButton(
                      `Sell ${selectedPair.base_currency_symbol}`,
                      "sell-btn"
                    )}
                  <Spinner status={this.state.sellLimitOrderFormSpinner} />
                  {!this.user && (
                    <Link to="/login" className="btn sell-btn">
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

export default SellLimitOrderForm;
