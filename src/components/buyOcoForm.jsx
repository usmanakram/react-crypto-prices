import React from "react";
import { Link } from "react-router-dom";
import TradingForm from "./tradingForm";
import Joi from "joi-browser";
import trade from "../services/tradeService";
import { toast } from "react-toastify";
import Spinner from "./spinner";
import ConfirmOrder from "./confirmOrder";
import debug from "../utils/debuger";

class BuyOcoForm extends TradingForm {
  state = {
    data: {
      trigger_rate: "",
      rate: "",
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

  isAllowTrade = false;

  schema = {
    type: Joi.number()
      .required()
      .label("type"),
    trigger_rate: Joi.number()
      .required()
      .label("Stop"),
    rate: Joi.number()
      .min(0)
      .required()
      .label("Price"),
    stop_limit_rate: Joi.number()
      .min(0)
      .required()
      .label("Limit"),
    quantity: Joi.number()
      .min(0)
      .required()
      .label("Quantity"),
    total: Joi.number()
      .required()
      .label("Total")
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedPairStats: currentStats } = this.props;
    const { selectedPairStats: prevStats } = prevProps;

    if (
      Object.keys(currentStats).length &&
      (Object.keys(prevStats).length === 0 ||
        currentStats.last_rate !== prevStats.last_rate)
    ) {
      this.schema.rate = Joi.number()
        .required()
        .less(currentStats.last_rate)
        .label("Price");
      this.schema.trigger_rate = Joi.number()
        .required()
        .greater(currentStats.last_rate)
        .label("Stop");
    }
  }

  handleAllowTrade = () => {
    this.isAllowTrade = true;
    this.doSubmit();
  };

  doSubmit = async () => {
    if (this.isAllowTrade === false) {
      this.setState({ modalShow: true });
      return;
    }
    this.setState({ modalShow: false });
    this.setState({ spinnerStatus: true });
    try {
      const { data } = this.state;
      // debug.log(data);

      const response = await trade.buy(
        this.props.selectedPair.id,
        data.type,
        data.rate,
        data.quantity,
        data.trigger_rate,
        data.stop_limit_rate
      );

      this.resetFormData();

      toast.success(response);
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 400) {
          // const errors = { ...this.state.errors };
          // errors.username = ex.response.data;
          // this.setState({ errors });
          // toast.error(ex.response.data);

          // debug.log(ex.response.data);
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
    this.isAllowTrade = false;
  };

  render() {
    const { selectedPair, selectedPairStats } = this.props;

    return (
      <React.Fragment>
        <td>
          <div className="tv_ammount-form-block">
            {Object.keys(selectedPair).length > 0 && (
              <form onSubmit={this.handleSubmit} className="form-horizontal">
                {this.renderInputHidden("type")}
                <div className="dashes">
                  {this.renderInputTradeForm(
                    "rate",
                    "Price",
                    selectedPair.quote_currency_symbol,
                    "number"
                  )}
                </div>
                {this.renderInputTradeForm(
                  "trigger_rate",
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
        <ConfirmOrder
          selectedPair={selectedPair}
          lastRate={selectedPairStats.last_rate}
          data={this.state.data}
          direction="buy"
          onAllowTrade={this.handleAllowTrade}
          show={this.state.modalShow}
          onHideModal={() => this.setState({ modalShow: false })}
        />
      </React.Fragment>
    );
  }
}

export default BuyOcoForm;
