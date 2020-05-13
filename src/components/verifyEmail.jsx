import React from "react";
import { Redirect } from "react-router-dom";
import Form from "./common/form";
import auth from "../services/authService";
import { toast } from "react-toastify";
import Header from "./header";
// import Spinner from "./spinner";
import { Link } from "react-router-dom";

class VerifyEmail extends Form {
  state = {
    email: "",
    code: "",
    progressMessage: "Verification in Progress...",
    isVerified: false,
  };

  componentDidMount() {
    const { email, code } = this.props.match.params;
    this.setState({ email, code });
    this.doSubmit(email, code);
  }

  doSubmit = async (email, code) => {
    try {
      this.setState({ isSpinner: true });

      const response = await auth.verifyEmail(email, code);

      this.setState({
        isVerified: true,
        progressMessage: "Verification Successfull",
      });
      toast.success(response);
    } catch (ex) {
      if (ex.response) {
        if (ex.response.status === 400) {
          this.setState({ progressMessage: ex.response.data });
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
    this.setState({ isSpinner: false });
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;

    return (
      <div className="user-login-signup-section modal-container">
        <Header />
        <div className="container">
          <div className="user-login-signup-form-wrap">
            <div className="modal-content">
              <h3>Email Verification</h3>
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
                  <h3 className="text-center my-5 text-primary">
                    {this.state.progressMessage}
                  </h3>

                  {this.state.isVerified && (
                    <p className="text-center" style={{ fontSize: 20 }}>
                      <Link to="/login">Sign In</Link>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VerifyEmail;
