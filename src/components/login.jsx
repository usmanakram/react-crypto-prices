import React from "react";
import { Redirect } from "react-router-dom";
import Form from "./common/form";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import Spinner from "./spinner";
import auth from "../services/authService";
import Header from "./header";
import { Link } from "react-router-dom";
import debug from "../utils/debuger";
import ResendVerificationEmail from "./resendVerificationEmail";

class Login extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
    loginSpinner: false,
    isInput: false,
  };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    debug.log("form validated");

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
        loginSpinner: false,
      });
    } catch (ex) {
      this.setState({ loginSpinner: false });
      if (ex.response) {
        if (ex.response.status === 400) {
          const errors = { ...this.state.errors };
          errors.username = ex.response.data;
          this.setState({ errors });

          toast.error(ex.response.data);
          if (ex.response.data === "Verifiy your email first before login.") {
            this.handleDisplayInputs();
          }
        } else if (ex.response.status === 422) {
          // Laravel returns 422 against form validation errors
          const { errors } = ex.response.data;

          for (let item in errors) {
            toast.error(errors[item][0]);
          }
        }
      }
    }
  };

  handleDisplayInputs = () => {
    const { isInput } = this.state;
    this.setState({ isInput: !isInput });
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    const { isInput } = this.state;
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
                      zuedex.com
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
                    <Link to="/forgot-password">Forgot password?</Link>
                  </p>
                  <p>
                    Don't have an account? <Link to="/signup">Register</Link>
                  </p>
                  {isInput && <ResendVerificationEmail />}
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
