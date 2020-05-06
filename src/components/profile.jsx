import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import auth from "../services/authService";
import Header from "./header";

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
      } = await auth.getProfile();

      this.setState({
        username,
        name,
        email,
        contact_number,
        address,
        identity_document,
        selfie_document,
        identity_status,
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
      contact_number,
      address,
      identity_document,
      selfie_document,
      identity_status,
    } = this.state;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>

        <div className="container my-3">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">
                    Profile
                    <Link className="h6 float-right" to="/edit-profile">
                      Edit
                    </Link>
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h5 className="card-text my-2">User Information</h5>
                    </div>
                    {/* <div className="col-md-6 text-right">
                      <Link className="h6" to="/edit-profile">
                        Edit
                      </Link>
                    </div> */}
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="card-text">
                        <strong>Username: </strong>
                        {username}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="card-text">
                        <strong>Full Name: </strong>
                        {name}
                      </p>
                    </div>
                    <div className="col-md-12">
                      <hr />
                    </div>

                    <div className="col-md-12">
                      <h5 className="card-text my-2">Contect Information</h5>
                    </div>
                    <div className="col-md-6">
                      <p className="card-text">
                        <strong>Email: </strong>
                        {email}
                      </p>
                      <p className="card-text">
                        <strong>Contact No: </strong>
                        {contact_number}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="card-text">
                        <strong>Address: </strong>
                        {address}
                      </p>
                    </div>
                    <hr />
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      {identity_status === 0 && (
                        <div className="col-md-12 text-center">
                          <p
                            style={{
                              fontSize: 20,
                              marginBottom: 15,
                              color: "blue",
                            }}
                          >
                            <Link to="/edit-profile">
                              Please, upload required documents.
                            </Link>
                          </p>
                        </div>
                      )}

                      {identity_status === 3 && (
                        <div className="col-md-12 text-center">
                          <p
                            style={{
                              fontSize: 20,
                              marginBottom: 15,
                              color: "red",
                            }}
                          >
                            Documents Rejected
                          </p>
                        </div>
                      )}

                      {identity_status === 1 && (
                        <div className="col-md-12 text-center">
                          <p
                            style={{
                              fontSize: 20,
                              marginBottom: 15,
                              color: "blue",
                            }}
                          >
                            Verification in Progress
                          </p>
                        </div>
                      )}
                      {identity_status === 2 && (
                        <div className="col-md-12 text-center">
                          <p
                            style={{
                              fontSize: 20,
                              marginBottom: 15,
                              color: "green",
                            }}
                          >
                            Approved
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-md-4">
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
            </div> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UserProfile;
