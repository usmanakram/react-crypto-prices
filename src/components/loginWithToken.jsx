import React, { Component } from "react";
import auth from "../services/authService";

class LoginWithToken extends Component {
  state = {};

  componentDidMount() {
    const { token } = this.props.match.params;
    if (token) {
      auth.loginWithToken(token);
    }
    window.location = process.env.REACT_APP_BASENAME + "/";
  }

  render() {
    return null;
  }
}

export default LoginWithToken;
