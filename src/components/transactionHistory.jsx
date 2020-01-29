import React, { Component } from "react";
import Header from "./header";
import Table from "./common/table";
import http from "../services/httpService";

class TransactionHistory extends Component {
  state = {
    deposits: [],
    withdrawals: []
  };

  columns = [
    { path: "status_text", label: "Status" },
    { path: "currency.symbol", label: "Coin" },
    { path: "amount", label: "Amount" },
    { path: "fee", label: "Fee", content: t => t.fee.toFixed(8) },
    { path: "created_at", label: "Date" },
    { path: "address", label: "Information" }
  ];

  async componentDidMount() {
    try {
      const { data } = await http.get("/auth/get-transactions-history");

      this.setState({ deposits: data.deposits, withdrawals: data.withdrawals });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
  }

  render() {
    const { deposits, withdrawals } = this.state;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>

        <div className="container my-3">
          <div className="row">
            <div className="col-12">
              <div className="latest-tranjections-block-inner panel-heading-block mb-2">
                <h5>Transaction History</h5>
              </div>
            </div>
          </div>
          {/* /////// */}
          <div className="ticker-head">
            <ul className="nav nav-tabs ticker-nav" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href="#deposits"
                  role="tab"
                  data-toggle="tab"
                >
                  Deposits History
                  <i className="fa fa-stroopwafel"></i>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#withdrawals"
                  role="tab"
                  data-toggle="tab"
                >
                  Withdrawal History
                  <i className="fa fa-stroopwafel"></i>
                </a>
              </li>
            </ul>
          </div>

          {/* // */}
          <div className="row">
            <div className="col-12">
              <div className="tab-content latest-tranjections-block-inner">
                <div className="tab-content">
                  <div
                    role="tabpanel"
                    className="tab-pane fade in active show"
                    id="deposits"
                  >
                    <Table
                      columns={this.columns}
                      data={deposits}
                      classes="coin-list latest-tranjections-table"
                      sortColumn=""
                    />
                  </div>
                  <div
                    role="tabpanel"
                    className="tab-pane fade"
                    id="withdrawals"
                  >
                    <Table
                      columns={this.columns}
                      data={withdrawals}
                      classes="coin-list latest-tranjections-table"
                      sortColumn=""
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

export default TransactionHistory;
