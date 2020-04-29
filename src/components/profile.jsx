import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import auth from "../services/authService";
import Header from "./header";
import Form from "./common/form";
class UserProfile extends Form {
  state = {
    username: "",
    name: "",
    email: "",
    address: "",
    identity_document: "",
    selfie_document: "",
  };

  async componentDidMount() {
    try {
      const {
        username,
        name,
        email,
        address,
        identity_document,
        selfie_document,
      } = await auth.getProfile();

      this.setState({
        username,
        name,
        email,
        address,
        identity_document,
        selfie_document,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
  }

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;
    const {
      username,
      name,
      email,
      address,
      identity_document,
      selfie_document,
    } = this.state;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>

        <div className="container my-3">
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Profile</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h5 className="card-text my-2">User Information</h5>
                    </div>
                    <div className="col-md-6 text-right">
                      <Link className="h6" to="/edit-profile">
                        Edit
                      </Link>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="card-text">{`Username: ${username}`}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="card-text">{`Name: ${name}`}</p>
                    </div>
                    <div className="col-md-12">
                      <hr />
                    </div>

                    <div className="col-md-12">
                      <h5 className="card-text my-2">Contect Information</h5>
                    </div>
                    <div className="col-md-6">
                      <p className="card-text">{`Email: ${email}`}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="card-text">{`Address: ${address}`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="row justify-content-center">
                    <div className="col-md-12">
                      <h5 className="card-text my-2">Documents</h5>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="card"
                        style={{
                          height: "143px",
                          padding: 5,
                        }}
                      >
                        <img
                          className="card-img-top"
                          src={selfie_document}
                          alt="selfie_document image"
                          style={{
                            height: "135px",
                          }}
                        />
                      </div>
                      <p className="card-text">{`Selfie Document`}</p>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="card"
                        style={{
                          height: "143px",
                          padding: 5,
                        }}
                      >
                        <img
                          className="card-img-top"
                          src={identity_document}
                          alt="identity_document image"
                          style={{
                            height: "135px",
                          }}
                        />
                      </div>
                      <p className="card-text">{`Identity Document`}</p>
                    </div>
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
