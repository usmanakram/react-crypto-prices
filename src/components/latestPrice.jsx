import React from "react";
import MarketsTable from "./marketsTable";

const LatestPrice = () => {
  return (
    <div className="new-ticker-block new-ticker-block-section">
      <div className="container">
        <div className="new-ticker-block-wrap">
          {/* <div className="ticker-head">
            <ul className="nav nav-tabs ticker-nav" role="tablist">
              {tableItems.map((tableItem, key) => (
                <li key={tableItem.href} className="nav-item">
                  <a
                    className={`nav-link ${key === 0 ? "active" : ""}`}
                    href={tableItem.href}
                    role="tab"
                    data-toggle="tab"
                  >
                    <h5>{tableItem.heading}</h5>
                    <i className="fa fa-stroopwafel"></i>
                  </a>
                </li>
              ))}

              <li className="nav-item nav-item-last">
                <form action="#" method="get" className="search-form">
                  <div className="input-box">
                    <input
                      type="text"
                      value=""
                      readOnly
                      required=""
                      name="s"
                      className="form-control"
                      placeholder="Search..."
                    />
                    <button type="submit">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </form>
              </li>
            </ul>
          </div> */}
          <div className="market-ticker-block">
            <div className="tab-content">
              {/* {columns.map((tableItem, key) => (
                <MarketsTable
                  key={key}
                  getTableKey={key}
                  getTable={tableItem}
                  columns={columns}
                  data={data}
                />
              ))} */}

              <MarketsTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestPrice;
