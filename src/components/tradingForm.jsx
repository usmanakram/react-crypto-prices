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
    data: { price: "", quantity: "", total: "", type: "" },
    errors: {}
  };

  schema = {
    type: Joi.number()
      .required()
      .label("type"),
    price: Joi.number()
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

    let total = { ...this.state.total };

    if (
      (input.name === "quantity" && data.price) ||
      (input.name === "price" && data.quantity)
    ) {
      // data.total = (data.quantity * (data.price * 100000000)) / 100000000;
      data.total = (data.quantity * data.price).toFixed(8);
      total = (data.quantity * data.price).toFixed(8);
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
    // const data = { price: "", quantity: "", total: "" };
    const data = this.state.data;
    data.price = "";
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
