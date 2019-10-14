import React, { Component } from "react";
import { exchangeRightTopHeadings } from "../services/fakeExchange";
import ExchangeRightTopTables from "./exchangeRightTopTables";

class exchangeRightTopTable extends Component {
  state = {};

  componentDidMount() {
    window.$(".dashboard-ticker-block-three").slimScroll({
      height: "570px"
    });
  }

  render() {
    return (
      <div className="das-market-block">
        <div className="new-ticker-block market-new-ticker-block">
          <div className="ticker-head">
            <ul className="nav nav-tabs ticker-nav" role="tablist">
              {exchangeRightTopHeadings.map(heading => (
                <li key={heading._id} className="nav-item">
                  <a
                    className={`nav-link ${
                      heading.key === "0" ? "active" : null
                    }`}
                    href={heading.href}
                    role="tab"
                    data-toggle="tab"
                  >
                    <i
                      className={heading.key === "0" ? "far fa-star" : null}
                    ></i>
                    {heading.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="market-ticker-block dashboard-ticker-block-three">
            <div className="tab-content">
              {exchangeRightTopHeadings.map(table => (
                <ExchangeRightTopTables table={table} key={table._id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default exchangeRightTopTable;
