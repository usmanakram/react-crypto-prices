import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import Spinner from "./spinner";
import { toast } from "react-toastify";
import auth from "../services/authService";

class ProfileChangePassword extends Form {
  state = {
    data: { old_password: "", password: "", confirmpassword: "" },
    errors: {},
    spinnerStatus: false,
  };

  schema = {
    old_password: Joi.string().required().label("Old Password"),
    password: Joi.string()
      .min(6)
      .required()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
      .label("Password")
      .error((errors) => {
        errors.forEach((error) => {
          if (error.type === "string.regex.base") {
            error.message =
              "Password must have atleast one capital, one small letter, one number and no special character.";
          }
        });
        return errors;
      }),
    confirmpassword: Joi.valid(Joi.ref("password"))
      .required()
      .label("Confirm Password")
      .options({ language: { any: { allowOnly: "must match password" } } }),
  };

  resetFormData = () => {
    const data = {
      old_password: "",
      password: "",
      confirmpassword: "",
    };

    this.setState({ data });
  };

  doSubmit = async () => {
    this.setState({ spinnerStatus: true });
    try {
      const response = await auth.updatePassword({ ...this.state.data });

      this.resetFormData();
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
    this.setState({ spinnerStatus: false });
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card-container">
            <div className="card-main">
              <div className="row">
                <div className="col-md-12">
                  <h5 className="card-text my-2">Change Password</h5>
                  <hr />
                </div>
                <div className="col-md-12">
                  {/* <p className="card-text my-2">Note * (Your new password must contain atleast one upper case letter, one lower case letter, and one number)</p> */}
                  <p className="card-text my-2 text-danger">
                    Note * (Your new password must have atleast one capital, one
                    small letter, one number and no special character.)
                  </p>
                </div>
                <div className="col-md-12 text-right">
                  <Spinner status={this.state.spinnerStatus} />
                </div>

                <div className="col-md-12">
                  <form onSubmit={this.handleSubmit}>
                    <div className="row">
                      <div className="col-md-12">
                        {this.renderInput(
                          "old_password",
                          "Old Password",
                          "password"
                        )}
                      </div>
                      <div className="col-md-12">
                        {this.renderInput(
                          "password",
                          "New Password",
                          "password"
                        )}
                      </div>
                      <div className="col-md-12">
                        {this.renderInput(
                          "confirmpassword",
                          "Confirm New Password",
                          "password"
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 text-right">
                        {this.renderButton("Submit", "btn-default")}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileChangePassword;
