import React from "react";
import { Redirect } from "react-router-dom";
import Form from "./common/form";
import Joi from "joi-browser";
import auth from "../services/authService";
import { toast } from "react-toastify";
import Header from "./header";
import Spinner from "./spinner";
import { Link } from "react-router-dom";

class SignUp extends Form {
  state = {
    data: {
      referrer_username: "",
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
      gender: ""
    },
    errors: {},
    loginSpinner: false
  };

  schema = {
    referrer_username: Joi.string().label("Referrer Username"),
    firstname: Joi.string()
      .required()
      .label("First Name"),
    lastname: Joi.string()
      .required()
      .label("Last Name"),
    username: Joi.string()
      .required()
      .label("Username"),
    email: Joi.string()
      .required()
      .email()
      .label("Email"),
    password: Joi.string()
      .min(6)
      .required()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
      .label("Password")
      .error(errors => {
        errors.forEach(error => {
          console.log(error);
          if (error.type === "string.regex.base") {
            error.message =
              "Password must have atleast one capital and one small letter.";
          }
        });
        return errors;
      }),
    confirmpassword: Joi.valid(Joi.ref("password"))
      .required()
      .label("Confirm Password")
      .options({ language: { any: { allowOnly: "must match password" } } }),
    // confirmpassword: Joi.string()
    //   .required()
    //   .label("Confirmpassword"),

    gender: Joi.string().required()
  };

  doSubmit = async () => {
    console.log("form validated");

    try {
      this.setState({ loginSpinner: true });

      const { data } = this.state;
      const response = await auth.signup(
        data.username,
        data.password,
        data.firstname,
        data.lastname,
        data.email,
        data.gender,
        data.referrer_username
      );
      toast.success(response);
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 400) {
          const errors = { ...this.state.errors };
          errors.username = ex.response.data;
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
      loginSpinner: false
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
              <h3>User SignUp</h3>
              <div className="modal-body">
                <div className="modal-info-block">
                  <p>Always ensure you're on the correct website</p>
                  <div className="block-inner">
                    <p>
                      <span>
                        <i className="fas fa-lock"></i>
                        https://
                      </span>
                      www.bittrainex.com
                    </p>
                  </div>
                </div>
                <div className="user-connected-form-block">
                  <form
                    onSubmit={this.handleSubmit}
                    className="user-connected-from user-login-form"
                  >
                    {this.renderLoginFormInput(
                      "referrer_username",
                      "Referrer Username"
                    )}
                    <div className="row">
                      <div className="col-md-6">
                        {this.renderLoginFormInput("firstname", "FirstName")}
                      </div>
                      <div className="col-md-6">
                        {this.renderLoginFormInput("lastname", "LastName")}
                      </div>
                    </div>
                    <Spinner status={this.state.loginSpinner} />
                    {this.renderLoginFormInput("email", "Email", "email")}

                    {this.renderLoginFormInput("username", "Username")}
                    <div className="row">
                      <div className="col-md-6">
                        {this.renderLoginFormInput(
                          "password",
                          "Password",
                          "password"
                        )}
                      </div>
                      <div className="col-md-6">
                        {this.renderLoginFormInput(
                          "confirmpassword",
                          "Confirmpassword",
                          "password"
                        )}
                      </div>
                    </div>
                    <h4 style={{ marginLeft: 20 }}> Gender</h4>
                    {this.renderRadioButton("gender", "Male")}
                    {this.renderRadioButton("gender", "Female")}

                    {this.renderButton("SignUp", "btn-default")}
                  </form>

                  <p>
                    Already on Bittrainex? <Link to="/login">Sign in</Link>
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

export default SignUp;
