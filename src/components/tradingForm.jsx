import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import HorizontalFormInput from "./common/horizontalFormInput";
import { toast } from "react-toastify";

class TradingForm extends Form {
  state = {
    data: { price: "", quantity: "", total: "" },
    errors: {}
  };

  schema = {
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

    if (
      (input.name === "quantity" && data.price) ||
      (input.name === "price" && data.quantity)
    ) {
      // data.total = (data.quantity * (data.price * 100000000)) / 100000000;
      data.total = (data.quantity * data.price).toFixed(8);
    }

    this.setState({ data });
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

    return null;
  };

  resetFormData = () => {
    const data = { price: "", quantity: "", total: "" };
    this.setState({ data });
  };
}

export default TradingForm;
