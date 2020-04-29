import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import http from "../services/httpService";
import { toast } from "react-toastify";

class Banner extends Form {
  state = {
    data: { email: "" },
    errors: {},
    loginSpinner: false,
  };

  schema = {
    email: Joi.string().email().required().label("Email"),
  };

  doSubmit = async () => {
    try {
      this.setState({ loginSpinner: true });

      const formData = new FormData();
      formData.append("email", this.state.data.email);
      const { data: response } = await http.post(
        "/subscribe-newsletters",
        formData
      );

      toast.success(response);
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 400) {
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
    this.setState({ loginSpinner: false, data: { email: "" } });
  };

  render() {
    return (
      <div className="container">
        <div className="offset-md-2 col-md-8">
          <div className="banner-content">
            <h2>Buy and Sell Cryptocurrency</h2>
            <p>
              The World's Leading Cryptocurrency Exchange.
              <br />
              Trade Bitcoin, NToken and hundreds of other cryptocurrencies in
              minutes.
            </p>
            <form className="subs-form" onSubmit={this.handleSubmit}>
              <div className="input-box">
                <input
                  type="text"
                  value={this.state.data.email}
                  required=""
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={this.handleChange}
                />
                <button type="submit">Get Start Now</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Banner;
