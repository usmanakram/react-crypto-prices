import React, { Component } from "react";
import auth from "../services/authService";

class Logout extends Component {
  async componentDidMount() {
    const { state } = this.props.location;

    await auth.logout();

    // window.location = state ? state.from.pathname : "/";
    // window.location = "/";
    window.location = process.env.REACT_APP_BASENAME + "/";
  }

  render() {
    return null;
  }
}

export default Logout;
