import React, { Component } from "react";
import http from "../services/httpService";
import Table from "./common/table";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import moment from "moment";
import Header from "./header";

class CoinInfo extends Component {
  columns = [
    {
      path: "open_time",
      label: "Date",
      content: history =>
        moment.unix(history.open_time / 1000).format("MMM D, YYYY")
    },
    { path: "open", label: "Open" },
    { path: "high", label: "High" },
    { path: "low", label: "Low" },
    { path: "close", label: "Close" },
    { path: "volume", label: "Volume" }
  ];

  state = {
    coinHistory: [],
    currentPage: 1,
    pageSize: 100,
    sortColumn: { path: "open_time", order: "desc" }
  };

  async componentDidMount() {
    // debug.log(moment(1565222400000).format("MMMM Do YYYY, h:mm:ss a"));
    const pairId = this.props.match.params.pairId;
    const { data } = await http.get("pair-history/" + pairId);
    this.setState({ coinHistory: data.historical_prices });
  }

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      coinHistory: allHistory
    } = this.state;

    const sorted = _.orderBy(allHistory, [sortColumn.path], [sortColumn.order]);
    const coinHistory = paginate(sorted, currentPage, pageSize);
    return { totalCount: allHistory.length, coinHistory };
  };

  render() {
    const { length: count } = this.state.coinHistory;
    const { pageSize, currentPage, sortColumn } = this.state;

    const { totalCount, coinHistory } = this.getPagedData();

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>

        <div className="container my-5">
          <div className="row">
            <div className="col-12">
              <div className="latest-tranjections-block-inner panel-heading-block mb-2">
                <h5>Hitorical Data</h5>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="latest-tranjections-block-inner pagination-margin">
                {count === 0 ? (
                  <p className="my-3">
                    There are not any historical data against{" "}
                    {this.props.match.params.coin} in the database.
                  </p>
                ) : (
                  <React.Fragment>
                    <Table
                      columns={this.columns}
                      data={coinHistory}
                      sortColumn={sortColumn}
                      onSort={this.handleSort}
                      classes="coin-list latest-tranjections-table"
                    />
                    <Pagination
                      itemsCount={totalCount}
                      pageSize={pageSize}
                      currentPage={currentPage}
                      onPageChange={this.handlePageChange}
                    />
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CoinInfo;
