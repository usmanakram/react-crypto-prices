import React from "react";
import { Redirect } from "react-router-dom";
import Form from "./common/form";
import Joi from "joi-browser";
import auth from "../services/authService";
import { toast } from "react-toastify";
import Header from "./header";
import Spinner from "./spinner";
import { Link } from "react-router-dom";

class ResetPassword extends Form {
  state = {
    data: { email: "", code: "", password: "", confirmpassword: "" },
    errors: {},
    isSpinner: false,
  };

  schema = {
    // password: Joi.string().required().label("Password"),
    email: Joi.string().email().required().label("Email"),
    code: Joi.string().required().label("Code"),
    password: Joi.string()
      .min(6)
      .required()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
      .label("Password")
      .error((errors) => {
        errors.forEach((error) => {
          if (error.type === "string.regex.base") {
            error.message =
              "Password must have atleast one capital, one small letter and one number.";
          }
        });
        return errors;
      }),
    confirmpassword: Joi.valid(Joi.ref("password"))
      .required()
      .label("Confirm Password")
      .options({ language: { any: { allowOnly: "must match password" } } }),
  };

  componentDidMount() {
    const { email, code } = this.props.match.params;
    this.setState({ data: { email, code, password: "", confirmpassword: "" } });
  }

  doSubmit = async () => {
    try {
      this.setState({ isSpinner: true });

      const { data } = this.state;
      const response = await auth.resetPassword(
        data.email,
        data.code,
        data.password
      );

      toast.success(response);
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 400) {
          const errors = { ...this.state.errors };
          errors.password = ex.response.data;
          this.setState({ errors });

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
    this.setState({
      isSpinner: false,
      data: { password: "", confirmpassword: "" },
    });
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;

    return (
      <div className="user-login-signup-section modal-container">
        <Header />
        <div className="container">
          <div className="user-login-signup-form-wrap">
            <div className="modal-content">
              <h3>Reset password</h3>
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
                    {this.renderLoginFormInput(
                      "password",
                      "Enter new Password",
                      "password"
                    )}
                    {this.renderLoginFormInput(
                      "confirmpassword",
                      "Confirm password",
                      "password"
                    )}
                    <Spinner status={this.state.isSpinner} />

                    {this.renderButton("Reset Password", "btn-default")}
                  </form>

                  <p>
                    Don't have an account? <Link to="/signup">Register</Link> |{" "}
                    <Link to="/login">Sign In</Link>
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

export default ResetPassword;
