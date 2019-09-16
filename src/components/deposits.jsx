import React, { Component } from "react";
import http from "../services/httpService";

class Deposits extends Component {
  state = {
    transactions: []
  };

  async componentDidMount() {
    const { data } = await http.get("/auth/user-deposit-addresses");
    console.log(data);
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <h1>Deposit</h1>
        </div>
      </div>
    );
  }
}

export default Deposits;
