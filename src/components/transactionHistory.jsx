import React, { Component } from "react";

import { tableItems } from "../services/fakeActivity";
import Header from "./header";
import Table from "./common/table";
import { tHTableHeadings, tHTableValue } from "../services/fakeExchange";

class TransactionHistory extends Component {
  state = {
    themeTableHeadings: tHTableHeadings,
    themeTableValue: tHTableValue
  };

  columns = [
    {
      path: "status",
      label: "Status"
    },
    {
      path: "coin",
      label: "Coin"
    },
    {
      path: "amount",
      label: "Amount"
    },
    {
      path: "date",
      label: "Date"
    },
    {
      path: "information",

      label: "Information"
    }
  ];

  render() {
    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>

        <div className="container my-5">
          <div className="row">
            <div className="col-12">
              <h4>Open Order</h4>
            </div>
          </div>
          {/* /////// */}
          <div className="ticker-head">
            <ul className="nav nav-tabs ticker-nav" role="tablist">
              <li className="nav-item">
                <a className="nav-link" href="" role="tab" data-toggle="tab">
                  <h5>Deposits History</h5>
                  <i className="fa fa-stroopwafel"></i>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href=""
                  role="tab"
                  data-toggle="tab"
                >
                  <h5>Withd rawal History</h5>
                  <i className="fa fa-stroopwafel"></i>
                </a>
              </li>
            </ul>
          </div>

          {/* // */}
          <div className="row">
            <div className="col-12">
              <div className="latest-tranjections-block-inner">
                <Table
                  columns={this.columns}
                  data={tHTableValue}
                  classes="coin-list latest-tranjections-table"
                  sortColumn=""
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TransactionHistory;
