import React, { Component } from "react";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import auth from "../services/authService";
import Form from "./common/form";

class ProfileIdentity extends Form {
  state = {
    data: {
      identity_document: "",
    },
    errors: {},
    spinnerStatus: false,
  };

  schema = {
    identity_document: Joi.any()
      .meta({ swaggerType: "file" })
      .optional()
      .allow("")
      .description("image file"),
  };

  doSubmit = async () => {
    try {
      this.setState({ spinnerStatus: true });
      const { onBasicInfoVerify } = this.props;

      const idDoc = document.querySelector("#identity_document");
      // const identity_document = idDoc.files[0];
      const identity_document =
        idDoc && idDoc.files[0] !== undefined ? idDoc.files[0] : "";
      const document_type = "identity_document";

      const response = await auth.updateDocument({
        document_type,
        document: identity_document,
      });
      toast.success(response);
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
    const { name, address, contactNumber, identityStatus } = this.props;

    if (identityStatus === 2) {
      return <h5>Varified</h5>;
    } else {
      if (!name && !address && !contactNumber) {
        return (
          <button
            className="btn btn-danger btn-default"
            onClick={this.handleDisplayInputs}
            disabled
          >
            Verify
          </button>
        );
      } else if (name && address && contactNumber) {
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
  };

  render() {
    const { isInputs } = this.state;
    const { identityStatus } = this.props;
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card-container">
            <div className="card-main">
              <div className="row">
                <div className="col-md-12">
                  <h5 className="card-text my-2">Identity Verification</h5>
                  <hr />
                </div>
                <div className="col-md-12">
                  <p className="card-text my-2">
                    • Increase withdrawal limit to 100BTC <br />• To increase
                    deposit limits for selected local currencies
                  </p>
                  {identityStatus === 0 && (
                    <p className="pro-sts-pen">
                      <strong>• Peanding Upload</strong>
                    </p>
                  )}
                  {identityStatus === 1 && (
                    <p className="pro-sts-ip">
                      <strong>• Verification In Progress</strong>
                    </p>
                  )}
                  {identityStatus === 2 && (
                    <p className="pro-sts-app">
                      <strong>• Document Approved</strong>
                    </p>
                  )}
                  {identityStatus === 3 && (
                    <p className="pro-sts-rej">
                      <strong>• Document Rejected</strong>
                    </p>
                  )}
                </div>
                <div className="col-md-12 text-right">
                  {this.hadldeVerifyButton()}
                </div>
                {isInputs && (
                  <div className="col-md-12">
                    <form onSubmit={this.handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          {this.renderFile(
                            "identity_document",
                            "Upload Identity"
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileIdentity;
