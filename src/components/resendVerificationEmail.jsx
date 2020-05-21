import React from "react";
import Joi from "joi-browser";
import Spinner from "./spinner";
import auth from "../services/authService";
import Form from "./common/form";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

class ResendVerificationEmail extends Form {
  state = {
    data: { email: "" },
    errors: {},
    loginSpinner: false,
    isInput: false,
    modalShow: false,
  };

  schema = {
    email: Joi.string().email().required().label("Email"),
  };

  //   doSubmit = async () => {
  resendVerificatoinEmail = async () => {
    this.setState({ loginSpinner: true });
    try {
      await auth.resendVerificatoinEmail(this.state.data.email);
      this.setState({ modalShow: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });

        toast.error(ex.response.data);
      }
    }
    this.setState({ loginSpinner: false });
  };

  handleModle = () => {
    this.setState({ modalShow: true });
  };

  render() {
    const { modalShow: show } = this.state;

    return (
      <React.Fragment>
        <p
          onClick={this.handleModle}
          className="pointer"
          style={{ color: "red" }}
        >
          Resend verificatoin email
        </p>
        <Modal
          show={show}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <h5>Enter email for verification code</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <form
                onSubmit={this.handleSubmit}
                className="user-connected-from user-login-form"
              >
                <div className="row">
                  <div className="col-md-12 pt-2">
                    <Spinner status={this.state.loginSpinner} />
                    {this.renderLoginFormInput("email", "Email")}
                  </div>
                </div>
              </form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success con-btn"
              onClick={this.resendVerificatoinEmail}
            >
              Send Code
            </Button>
            <Button
              variant="danger con-btn"
              onClick={() => this.setState({ modalShow: false })}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ResendVerificationEmail;
