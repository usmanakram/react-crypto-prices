import React from "react";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import auth from "../services/authService";
import Form from "./common/form";
import Spinner from "./spinner";

class ProfileSelfie extends Form {
  state = {
    data: {
      selfie_document: "",
    },
    errors: {},
    spinnerStatus: false,
  };

  schema = {
    selfie_document: Joi.any()
      .meta({ swaggerType: "file" })
      .required()
      .description("image file"),
  };

  doSubmit = async () => {
    try {
      this.setState({ spinnerStatus: true });
      const { onBasicInfoVerify } = this.props;
      const slfDoc = document.querySelector("#selfie_document");
      const selfie_document = slfDoc.files[0];
      const document_type = "selfie_document";

      const response = await auth.updateDocument({
        document_type,
        document: selfie_document,
      });
      toast.success(response);
      this.handleDisplayInputs();
      onBasicInfoVerify();
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
    this.setState({ spinnerStatus: false });
  };

  handleDisplayInputs = () => {
    const { isInputs } = this.state;
    this.setState({ isInputs: !isInputs });
  };

  hadldeVerifyButton = () => {
    const { name, address, contactNumber, selfieStatus } = this.props;
    const { isInputs } = this.state;
    if (selfieStatus === 2) {
      return <h5>Varified</h5>;
    } else if (selfieStatus === 1) {
      return <h5>Varification in progress</h5>;
    } else {
      if (!name && !address && !contactNumber) {
        if (!isInputs) {
          return (
            <button
              className="btn btn-danger btn-default"
              onClick={this.handleDisplayInputs}
              disabled
            >
              Verify
            </button>
          );
        }
      } else if (name && address && contactNumber) {
        if (!isInputs) {
          return (
            <button
              className="btn btn-danger btn-default"
              onClick={this.handleDisplayInputs}
            >
              Verify
            </button>
          );
        }
      }
    }
  };

  render() {
    const { isInputs } = this.state;
    const { selfieStatus } = this.props;
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card-container">
            <div className="card-main">
              <div className="row">
                <div className="col-md-12">
                  <h5 className="card-text my-2">Selfie Verification</h5>
                  <hr />
                </div>
                <div className="col-md-12">
                  <p className="card-text my-2">
                    • Increase withdrawal limit to 10BTC <br />• To increase
                    deposit limits for selected local currencies
                  </p>

                  {selfieStatus === 0 && (
                    <p className="pro-sts-pen">
                      <strong>• Pending Upload</strong>
                    </p>
                  )}
                  {selfieStatus === 1 && (
                    <p className="pro-sts-ip">
                      <strong>• Verification In Progress</strong>
                    </p>
                  )}
                  {selfieStatus === 2 && (
                    <p className="pro-sts-app">
                      <strong>• Document Approved</strong>
                    </p>
                  )}
                  {selfieStatus === 3 && (
                    <p className="pro-sts-rej">
                      <strong>• Document Rejected</strong>
                    </p>
                  )}
                </div>
                <div className="col-md-12 text-right">
                  <Spinner status={this.state.spinnerStatus} />
                  {this.hadldeVerifyButton()}
                </div>
                {isInputs && (
                  <div className="col-md-12">
                    <form onSubmit={this.handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          {this.renderFile("selfie_document", "Upload Selfie")}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 text-right">
                          <button
                            className="btn btn-danger btn-default mr-2"
                            onClick={this.handleDisplayInputs}
                          >
                            Cancel
                          </button>
                          {this.renderButton("Submit", "btn-default")}
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileSelfie;
