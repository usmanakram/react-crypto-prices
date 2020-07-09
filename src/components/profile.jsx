import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import auth from "../services/authService";
import Header from "./header";
import ProfileBasicInfo from "./profileBasicInfo";
import ProfileIdentity from "./profileIdentity";
import ProfileSelfie from "./profileSelfie";
import ProfileChangePassword from "./profileChangePassword";

class UserProfile extends Component {
  state = {
    userProfile: {},
  };

  async componentDidMount() {
    this.handleBasicInfoVerify();
  }

  handleBasicInfoVerify = async () => {
    try {
      const userProfile = await auth.getProfile();
      this.setState({ userProfile });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;
    const { userProfile } = this.state;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>

        <div className="container my-3">
          <div className="ticker-head">
            <ul className="nav nav-tabs ticker-nav" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href="#profile-tab"
                  role="tab"
                  data-toggle="tab"
                >
                  Profile
                  <i className="fa fa-stroopwafel"></i>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#changepassword-tab"
                  role="tab"
                  data-toggle="tab"
                >
                  Change Password
                  <i className="fa fa-stroopwafel"></i>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#documents-tab"
                  role="tab"
                  data-toggle="tab"
                >
                  Documents
                  <i className="fa fa-stroopwafel"></i>
                </a>
              </li>
            </ul>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="tab-content latest-tranjections-block-inner">
                <div className="tab-content">
                  <div
                    role="tabpanel"
                    className="tab-pane fade in active show"
                    id="profile-tab"
                  >
                    <ProfileBasicInfo
                      onBasicInfoVerify={this.handleBasicInfoVerify}
                      userProfile={userProfile}
                    />
                  </div>
                  <div
                    role="tabpanel"
                    className="tab-pane fade"
                    id="changepassword-tab"
                  >
                    <ProfileChangePassword />
                  </div>
                  <div
                    role="tabpanel"
                    className="tab-pane fade"
                    id="documents-tab"
                  >
                    <div
                      className="col-12 text-danger"
                      style={{ marginTop: 20 }}
                    >
                      <h5>
                        Profile must be completed before documents verification.
                      </h5>
                    </div>
                    <ProfileIdentity
                      onBasicInfoVerify={this.handleBasicInfoVerify}
                      userProfile={userProfile}
                    />
                    <ProfileSelfie
                      onBasicInfoVerify={this.handleBasicInfoVerify}
                      userProfile={userProfile}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UserProfile;
