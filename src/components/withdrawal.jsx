import React, { Component } from "react";
import Header from "./header";
import Table from "./common/table";
import { tHTableHeadings, tHTableValue } from "../services/fakeExchange";

class Withdrawal extends Component {
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
              <div className="latest-tranjections-block-inner panel-heading-block mb-2">
                <h5>Withdrawal</h5>
              </div>
            </div>
          </div>

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

export default Withdrawal;
