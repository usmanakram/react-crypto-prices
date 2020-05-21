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
    },
    errors: {},
    spinnerStatus: false,
    isInputs: false,
  };

  schema = {
    name: Joi.string().required().label("Full Name"),
    contact_number: Joi.string().required().label("Contact Number"),
    address: Joi.string().required().label("Address"),
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { name, address, contactNumber } = this.props;
    if (
      this.props.name !== prevProps.name ||
      this.props.address !== prevProps.address ||
      this.props.contactNumber !== prevProps.contactNumber
    ) {
      this.updateData();
    }
  }
  updateData = () => {
    const data = { ...this.state.data };
    const { name, address, contactNumber: contact_number } = this.props;
    data.name = name;
    data.address = address;
    data.contact_number = contact_number;

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
    const { isInputs } = this.state;
    this.setState({ isInputs: !isInputs });
  };

  hadldeVerifyButton = () => {
    const {
      name: p_name,
      address: p_address,
      contactNumber,
      identityStatus,
      selfieStatus,
    } = this.props;
    if (identityStatus === 2 || selfieStatus === 2) {
      return <h5>Varified</h5>;
    } else {
      if (!p_name && !p_address && !contactNumber) {
        return (
          <button
            className="btn btn-danger btn-default"
            onClick={this.handleDisplayInputs}
          >
            Verify
          </button>
        );
      } else if (p_name && p_address && contactNumber) {
        return (
          <h5 onClick={this.handleDisplayInputs} className="pointer">
            Varified
          </h5>
        );
      }
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
                  <p className="card-text my-2">
                    Basic Information must be completed before proceeding with
                    other verification types
                  </p>
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
                          {this.renderInput("name", "Full Name", "text")}
                        </div>
                        <div className="col-md-6">
                          {this.renderInput(
                            "contact_number",
                            "Contact Number",
                            "text"
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          {this.renderInput("address", "Address", "text")}
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

export default ProfileBasicInfo;
