import React, { Component } from "react";
import { Link } from "react-router-dom";
import http from "../services/httpService";
import Table from "./common/table";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import moment from "moment";

// const apiEndpoint = "http://localhost/projects/bittrain_exchange/coinmarketcap.com/api.php?coin=";
// const apiEndpoint = "?coin=";
const apiEndpoint = "/currencies/";

class CoinDetail extends Component {
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
    // console.log(moment(1565222400000).format("MMMM Do YYYY, h:mm:ss a"));
    const coin = this.props.match.params.coin;
    const { data } = await http.get(apiEndpoint + coin);
    this.setState({ coinHistory: data });
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

    if (count === 0)
      return (
        <p>
          There are not any historical data against{" "}
          {this.props.match.params.coin} in the database.
        </p>
      );

    const { totalCount, coinHistory } = this.getPagedData();

    return (
      <React.Fragment>
        <h1>
          {this.props.match.params.coin}{" "}
          <Link to="/" className="btn btn-primary pull-right">
            Back to coins list
          </Link>
        </h1>
        <Table
          columns={this.columns}
          data={coinHistory}
          sortColumn={sortColumn}
          onSort={this.handleSort}
        />
        <Pagination
          itemsCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
      </React.Fragment>
    );
  }
}

export default CoinDetail;
