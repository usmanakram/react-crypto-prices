import React, { Component } from "react";
import { Link } from "react-router-dom";
import http from "./../services/httpService";
import Table from "./common/table";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import _ from "lodash";

const apiEndpoint =
  "http://localhost/projects/bittrain_exchange/coinmarketcap.com/api.php?coins_list=all";

class CoinsList extends Component {
  columns = [
    {
      path: "name",
      label: "Coin Name",
      content: coin => <Link to={`/coin-detail/${coin.name}`}>{coin.name}</Link>
    }
  ];

  state = {
    coins: [],
    currentPage: 1,
    pageSize: 4,
    sortColumn: { path: "name", order: "asc" }
  };

  async componentDidMount() {
    const { data } = await http.get(apiEndpoint);
    this.setState({ coins: data });
  }

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const { pageSize, currentPage, sortColumn, coins: allCoins } = this.state;

    const sorted = _.orderBy(allCoins, [sortColumn.path], [sortColumn.order]);
    const coins = paginate(sorted, currentPage, pageSize);
    // return { coins: sorted };
    return { totalCount: allCoins.length, coins };
  };

  render() {
    const { length: count } = this.state.coins;
    const { pageSize, currentPage, sortColumn } = this.state;

    if (count === 0) return <p>There are no coins in the database.</p>;

    const { totalCount, coins } = this.getPagedData();

    return (
      <React.Fragment>
        <h1>Coins Listing</h1>
        <Table
          columns={this.columns}
          data={coins}
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

export default CoinsList;
