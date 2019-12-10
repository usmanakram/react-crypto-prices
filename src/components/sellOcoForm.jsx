import React from "react";
import { Link } from "react-router-dom";
import TradingForm from "./tradingForm";
import Joi from "joi-browser";
import trade from "../services/tradeService";
import { toast } from "react-toastify";
import Spinner from "./spinner";
import ConfirmOrder from "./confirmOrder";

class SellOcoForm extends TradingForm {
  state = {
    data: {
      stop: "",
      price: "",
      stop_limit_rate: "",
      quantity: "",
      total: "",
      type: 3
    },
    errors: {},
    total: 0,
    spinnerStatus: false,
    modalShow: false
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
    stop_limit_rate: Joi.number()
      .required()
      .label("Limit"),
    quantity: Joi.number()
      .required()
      .label("Quantity"),
    total: Joi.number()
      .required()
      .label("Total")
  };

  doSubmit = async () => {
    this.setState({ modalShow: true });
    this.setState({ spinnerStatus: true });
    try {
      const { data } = this.state;
      // console.log(data);

      const response = await trade.sell(
        this.props.selectedPair.id,
        data.type,
        data.price,
        data.quantity,
        data.stop,
        data.stop_limit_rate
      );

      this.resetFormData();
      this.props.onTrade();

      toast.success(response);
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 400) {
          // const errors = { ...this.state.errors };
          // errors.username = ex.response.data;
          // this.setState({ errors });
          // toast.error(ex.response.data);

          // console.log(ex.response.data);
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
    const { selectedPair } = this.props;
    return (
      <React.Fragment>
        <td>
          <div className="tv_ammount-form-block">
            {Object.keys(selectedPair).length > 0 && (
              <form onSubmit={this.handleSubmit} className="form-horizontal">
                {this.renderInputHidden("type")}
                <div className="dashes">
                  {this.renderInputTradeForm(
                    "price",
                    "Price",
                    selectedPair.quote_currency_symbol,
                    "number"
                  )}
                </div>
                {this.renderInputTradeForm(
                  "stop",
                  "Stop",
                  selectedPair.quote_currency_symbol,
                  "number"
                )}
                <div className="dashes">
                  {this.renderInputTradeForm(
                    "stop_limit_rate",
                    "Limit",
                    selectedPair.quote_currency_symbol,
                    "number"
                  )}
                </div>

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
                  selectedPair.base_currency_symbol,
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
                        `Sell ${selectedPair.base_currency_symbol}`,
                        "sell-btn"
                      )}
                    <Spinner status={this.state.spinnerStatus} />

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
        <ConfirmOrder
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
        />
      </React.Fragment>
    );
  }
}

export default SellOcoForm;
