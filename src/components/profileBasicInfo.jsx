import React from "react";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import auth from "../services/authService";
import Form from "./common/form";
import Spinner from "./spinner";

class ProfileBasicInfo extends Form {
  state = {
    data: {
      name: "",
      contact_number: "",
      address: "",
      city: "",
      country: "",
      postal_code: "",
      btc_address: "",
    },
    errors: {},
    spinnerStatus: false,
    // isInputs: false,
    isInputs: true,
  };

  schema = {
    name: Joi.string().required().label("Full Name"),
    contact_number: Joi.string().required().label("Contact Number"),
    address: Joi.string().required().label("Address"),
    city: Joi.string().required().label("City"),
    country: Joi.string().required().label("Country"),
    postal_code: Joi.string().required().label("Postal Code"),
    btc_address: Joi.string().required().label("Bitcoin Address"),
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { userProfile } = this.props;
    if (
      userProfile.name !== prevProps.userProfile.name ||
      userProfile.contact_number !== prevProps.userProfile.contact_number ||
      userProfile.address !== prevProps.userProfile.address ||
      userProfile.city !== prevProps.userProfile.city ||
      userProfile.country !== prevProps.userProfile.country ||
      userProfile.postal_code !== prevProps.userProfile.postal_code ||
      userProfile.btc_address !== prevProps.userProfile.btc_address
    ) {
      this.updateData();
    }
  }
  updateData = () => {
    const data = { ...this.state.data };
    const { userProfile } = this.props;

    data.name = userProfile.name || "";
    data.contact_number = userProfile.contact_number || "";
    data.address = userProfile.address || "";
    data.city = userProfile.city || "";
    data.country = userProfile.country || "";
    data.postal_code = userProfile.postal_code || "";
    data.btc_address = userProfile.btc_address || "";

    this.setState({ data });
  };

  doSubmit = async () => {
    try {
      this.setState({ spinnerStatus: true });
      const { onBasicInfoVerify } = this.props;

      const response = await auth.updateBasicInfo({
        ...this.state.data,
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
    // this.setState({ isInputs: !this.state.isInputs });
  };

  hadldeVerifyButton = () => {
    const {
      name,
      address,
      contact_number,
      identityStatus,
      selfieStatus,
    } = this.props.userProfile;

    if (
      identityStatus === 2 ||
      selfieStatus === 2 ||
      (name && contact_number && address)
    ) {
      return <h5>Verified</h5>;
    } else if (!this.state.isInputs) {
      return (
        <button
          className="btn btn-danger btn-default"
          onClick={this.handleDisplayInputs}
        >
          Verify
        </button>
      );
    }
  };

  render() {
    const { isInputs } = this.state;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card-container">
            <div className="card-main">
              <div className="row">
                <div className="col-md-12">
                  <h5 className="card-text my-2">Basic Information</h5>
                  <hr />
                </div>
                <div className="col-md-12">
                  <p className="card-text my-2 text-danger">
                    Basic Information must be completed before proceeding with
                    other verification types
                  </p>
                </div>
                <div className="col-md-12 text-right">
                  <Spinner status={this.state.spinnerStatus} />
                  {/* {this.hadldeVerifyButton()} */}
                </div>
                {isInputs && (
                  <div className="col-md-12">
                    <form onSubmit={this.handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          {this.renderInput("name", "Full Name", "text")}
                        </div>
                        <div className="col-md-6">
                          {this.renderInput(
                            "contact_number",
                            "Contact Number",
                            "text"
                          )}
                        </div>
                        <div className="col-md-6">
                          {this.renderInput("address", "Address", "text")}
                        </div>
                        <div className="col-md-6">
                          {this.renderInput("city", "City", "text")}
                        </div>
                        <div className="col-md-6">
                          {this.renderInput("country", "Country", "text")}
                        </div>
                        <div className="col-md-6">
                          {this.renderInput(
                            "postal_code",
                            "Postal Code",
                            "text"
                          )}
                        </div>
                        <div className="col-md-6">
                          {this.renderInput(
                            "btc_address",
                            "Bitcoin Address",
                            "text"
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 text-right">
                          {/* <button
                            className="btn btn-danger btn-default mr-2"
                            onClick={this.handleDisplayInputs}
                          >
                            Cancel
                          </button> */}
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

export default ProfileBasicInfo;
