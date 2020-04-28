import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import auth from "../services/authService";
import Header from "./header";
import debug from "../utils/debuger";
import Form from "./common/form";
import Joi from "joi-browser";
import imgUrl from "../images/team-2-800x800.jpg";
class UserProfile extends Form {
  state = {
    data: {
      name: "",
      address: "",
    },
    error: {},
  };

  schema = {
    name: Joi.string().required().label("Name"),
    address: Joi.string().required().label("Address"),
  };

  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;
    // const { name, email, address } = this.state.data;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>

        <div className="container my-3">
          <div class="row">
            <div class="col-md-8">
              <div class="card">
                <div class="card-header">
                  <h5 class="card-title">User Profile</h5>
                </div>
                <div class="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 class="card-text my-2">User Information</h5>
                    </div>
                    <div className="col-md-12">
                      {this.renderInput("name", "Name", "text")}
                    </div>

                    <div className="col-md-12">
                      {this.renderInput("address", "Address", "text")}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      {this.renderInput("s_img", "Upload Selfy", "file")}
                    </div>
                    <div className="col-md-6">
                      {this.renderInput("i_img", "Upload Identity", "file")}
                    </div>
                    <div className="col-md-12 text-right">
                      {this.renderButton("Submit", "btn-default")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  {/* <h5 class="card-title">Special title treatment</h5> */}
                  <div className="row justify-content-center">
                    <div className="col-md-12">
                      <img
                        alt="..."
                        className="rounded-circle center"
                        src={imgUrl}
                        height="160"
                      />
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
