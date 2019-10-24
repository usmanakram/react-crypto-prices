import React from "react";
import { Redirect } from "react-router-dom";
import Form from "./common/form";
import Joi from "joi-browser";
import auth from "../services/authService";
import { toast } from "react-toastify";
import Header from "./header";
import Spinner from "./spinner";

class Login extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
    loginSpinner: false
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    console.log("form validated");

    try {
      this.setState({ loginSpinner: true });

      const { data } = this.state;
      await auth.login(data.username, data.password);

      const { state } = this.props.location;
      // window.location = state ? state.from.pathname : "/";
      window.location = state
        ? state.from.pathname
        : process.env.REACT_APP_BASENAME + "/";
      this.setState({
        loginSpinner: false
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors, loginSpinner: false });

        toast.error(ex.response.data);
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;

    return (
      <div className="user-login-signup-section modal-container">
        <Header />
        <div className="container">
          <div className="user-login-signup-form-wrap">
            <div className="modal-content">
              <h3>User Login</h3>
              <div className="modal-body">
                <div className="modal-info-block">
                  <p>Always ensure you're on the correct website</p>
                  <div className="block-inner">
                    <p>
                      <span>
                        <i className="fas fa-lock"></i>
                        https://
                      </span>
                      www.excoin.com
                    </p>
                  </div>
                </div>
                <div className="user-connected-form-block">
                  <form
                    onSubmit={this.handleSubmit}
                    className="user-connected-from user-login-form"
                  >
                    {this.renderLoginFormInput("username", "Username")}
                    <Spinner status={this.state.loginSpinner} />

                    {this.renderLoginFormInput(
                      "password",
                      "Password",
                      "password"
                    )}

                    {this.renderButton("Login", "btn-default")}
                  </form>
                  <p>
                    Don't have an account? <a href="#e"> Register</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
