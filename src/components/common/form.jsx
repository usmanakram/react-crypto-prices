import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import LoginFormInput from "./loginFormInput";
// import { toast } from "react-toastify";

class Form extends Component {
  state = {
    data: {},
    errors: {}
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
      // toast.error(item.message);
    }
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    if (name === "confirmpassword") {
      obj["password"] = this.state.data.password;
      schema["password"] = this.schema.password;
    }
    const { error } = Joi.validate(obj, schema);

    return error ? error.details[0].message : null;
  };

  /**
   * Called when data is validated and ready for submit
   *
   * @abstract
   * @param
   * @void
   */
  doSubmit = async () => {
    throw "Abstract method doSubmit not implemented";
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  renderButton(label, extraClasses = "") {
    const classes = `btn btn-primary ${extraClasses}`;
    return <button className={classes}>{label}</button>;
  }

  renderInput(name, label, type = "text") {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderLoginFormInput(name, placeholder, type = "text") {
    const { data, errors } = this.state;

    return (
      <LoginFormInput
        type={type}
        name={name}
        value={data[name]}
        placeholder={placeholder}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderRadioButton(name, placeholder) {
    const { data, errors } = this.state;

    return (
      <div className="form-check-inline checkbox_inline">
        <label className="form-check-label">
          <input
            type="radio"
            className="form-check-input"
            id={placeholder}
            name={name}
            value={placeholder}
            onChange={this.handleChange}
          />
          {placeholder}
        </label>
      </div>
    );
  }
}

export default Form;
