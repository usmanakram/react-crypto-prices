import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import HorizontalFormInput from "./common/horizontalFormInput";
import InpuTradeForm from "./common/inputTradeForm";
import { toast } from "react-toastify";
import auth from "../services/authService";
import InputHidden from "./common/inputHidden";

class TradingForm extends Form {
  state = {
    data: { rate: "", quantity: "", total: "", type: "" },
    errors: {}
  };

  schema = {
    type: Joi.number()
      .required()
      .label("type"),
    rate: Joi.number()
      .required()
      .label("Price"),
    quantity: Joi.number()
      .required()
      .label("Quantity"),
    total: Joi.number()
      .required()
      .label("Total")
    // commission: Joi.number()
    //   .required()
    //   .label("Commission"),
    // balance: Joi.number()
    //   .required()
    //   .label("Balance")
  };

  user = auth.getCurrentUser();

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;

      // Temporiraly excluded "total" field from validation
      if (item.path[0] !== "total") toast.error(item.message);
    }
    return errors;
  };

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;

    let total = this.state.total;

    if (
      (input.name === "quantity" && (data.rate || data.stop_limit_rate)) ||
      (["rate", "stop_limit_rate"].includes(input.name) && data.quantity)
    ) {
      // data.total = (data.quantity * (data.rate * 100000000)) / 100000000;

      /**
       * Taking "rate" or "stop_limit_rate" as per availability.
       * If both are available, then take higher value.
       */
      let rate = data.rate || data.stop_limit_rate;
      rate = data.rate && data.rate > rate ? data.rate : rate;
      rate =
        data.stop_limit_rate && data.stop_limit_rate > rate
          ? data.stop_limit_rate
          : rate;
      total = data.total = (data.quantity * rate).toFixed(8);
    }

    this.setState({ data, total });
  };

  renderHorizontalFormInput(name, label, type = "text", readOnly = false) {
    const { data, errors } = this.state;

    return (
      <HorizontalFormInput
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        readOnly={readOnly}
      />
    );
  }

  getAvailableBalance = () => {
    const { balance } = this.props;

    if (Object.keys(balance).length)
      return (
        (balance.total_balance * 100000000 -
          balance.in_order_balance * 100000000) /
        100000000
      );

    // return null;
    return "";
  };

  resetFormData = () => {
    // const data = { rate: "", quantity: "", total: "" };
    const data = this.state.data;
    data.rate = "";
    data.quantity = "";
    this.setState({ data });
  };

  renderInputTradeForm(
    name,
    label,
    symbol,
    type = "text",
    readOnly = false,
    step = "any"
  ) {
    const { data, errors } = this.state;

    return (
      <InpuTradeForm
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        symbol={symbol}
        readOnly={readOnly}
        step={step}
      />
    );
  }

  renderReadOnlyInputTradeForm(
    name,
    label,
    value,
    symbol,
    type = "text",
    step = "any"
  ) {
    return (
      <InpuTradeForm
        type={type}
        name={name}
        value={value}
        label={label}
        symbol={symbol}
        readOnly={true}
        step={step}
      />
    );
  }

  renderInputHidden(name) {
    const { data, errors } = this.state;

    return (
      <InputHidden
        name={name}
        value={data[name]}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderTradeButton(label, extraClasses = "") {
    const classes = `btn ${extraClasses}`;
    return <button className={classes}>{label}</button>;
  }
}

export default TradingForm;
