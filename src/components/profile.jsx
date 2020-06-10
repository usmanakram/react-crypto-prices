import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import auth from "../services/authService";
import Header from "./header";
import ProfileBasicInfo from "./profileBasicInfo";
import ProfileIdentity from "./profileIdentity";
import ProfileSelfie from "./profileSelfie";

class UserProfile extends Component {
  state = {
    username: "",
    name: "",
    email: "",
    contact_number: "",
    address: "",
    identity_document: "",
    selfie_document: "",
    identity_status: "",
    selfie_status: "",
    identity_status_text: "",
    selfie_status_text: "",
  };

  async componentDidMount() {
    try {
      const {
        username,
        name,
        email,
        contact_number,
        address,
        identity_document,
        selfie_document,
        identity_status,
        selfie_status,
        identity_status_text,
        selfie_status_text,
      } = await auth.getProfile();

      this.setState({
        username,
        name,
        email,
        contact_number: contact_number || "",
        address: address || "",
        identity_document,
        selfie_document,
        identity_status,
        selfie_status,
        identity_status_text,
        selfie_status_text,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
  }

  handleBasicInfoVerify = async () => {
    try {
      const {
        name,
        contact_number,
        address,
        identity_document,
        selfie_document,
        identity_status,
        selfie_status,
        identity_status_text,
        selfie_status_text,
      } = await auth.getProfile();

      this.setState({
        name,
        contact_number,
        address,
        identity_document,
        selfie_document,
        identity_status,
        selfie_status,
        identity_status_text,
        selfie_status_text,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;
    const {
      name,
      contact_number,
      address,
      identity_status,
      selfie_status,
      identity_status_text,
      selfie_status_text,
    } = this.state;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>

        <div className="container my-3">
          <div className="pro-header mx-3 my-3">
            <div className="text-css">
              <h4>Profile</h4>
            </div>
          </div>
          <div className="card mx-3 my-3">
            <ProfileBasicInfo
              name={name}
              address={address}
              contactNumber={contact_number}
              identityStatus={identity_status}
              selfieStatus={selfie_status}
              onBasicInfoVerify={this.handleBasicInfoVerify}
            />
            <ProfileIdentity
              name={name}
              address={address}
              contactNumber={contact_number}
              identityStatus={identity_status}
              identityStatusText={identity_status_text}
              onBasicInfoVerify={this.handleBasicInfoVerify}
            />
            <ProfileSelfie
              name={name}
              address={address}
              contactNumber={contact_number}
              selfieStatus={selfie_status}
              selfieStatusText={selfie_status_text}
              onBasicInfoVerify={this.handleBasicInfoVerify}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UserProfile;
