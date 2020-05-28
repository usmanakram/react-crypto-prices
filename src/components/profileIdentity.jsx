import React from "react";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import auth from "../services/authService";
import Form from "./common/form";
import Spinner from "./spinner";

class ProfileIdentity extends Form {
  state = {
    data: {
      identity_document: "",
    },
    errors: {},
    spinnerStatus: false,
    isInputs: false,
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

      if (
        identity_document === "" ||
        identity_document.size > 1024 * 1024 * 1
      ) {
        toast.error("Image must be 1MB or less.");
        this.setState({ spinnerStatus: false });
        return;
      }

      const response = await auth.updateDocument({
        document_type: "identity_document",
        document: identity_document,
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
    this.setState({ isInputs: !this.state.isInputs });
  };

  hadldeVerifyButton = () => {
    const { isInputs } = this.state;
    const { name, address, contactNumber, identityStatus } = this.props;

    if (identityStatus === 2) {
      return <h5>Verified</h5>;
    } else if (identityStatus === 1) {
      return <h5>Verification in progress</h5>;
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
    } else {
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
    }
  };

  handleChange = ({ currentTarget: input }) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        if (document.querySelector("#identity-preview img"))
          document.querySelector("#identity-preview img").remove();

        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "img-thumbnail";
        // img.width = 250;
        // img.height = 200;
        document.querySelector("#identity-preview").appendChild(img);
      };

      reader.readAsDataURL(input.files[0]);
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
                    • Increase withdrawal limit to 10BTC <br />• To increase
                    deposit limits for selected local currencies
                  </p>
                  {identityStatus === 0 && (
                    <p className="pro-sts-pen">
                      <strong>• Pending Upload</strong>
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
                  <Spinner status={this.state.spinnerStatus} />
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
                        <div className="col-md-6" id="identity-preview"></div>
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

export default ProfileIdentity;
