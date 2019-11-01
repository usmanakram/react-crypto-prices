import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom"
class GettingStarted extends Component {
  state = {};
  render() {
    const user = auth.getCurrentUser();
    return (
      <React.Fragment>
        {!user && (
          <div className="colto-section">
            <div className="container">
              <div className="colto-content-wrap">
                <div className="colto-content">
                  <h3>Getting started</h3>
                  <p>
                    We provide professional and secure trading services for
                    investors
                  </p>
                </div>
                <div className="colto-btn-group">
                  <Link to='/login' className="btn callto-btn">Log In</Link>
                  {/* <span>or</span>
                <button className="btn callto-btn">Create Account</button> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default GettingStarted;
