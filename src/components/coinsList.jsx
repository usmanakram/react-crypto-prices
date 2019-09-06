import React, { Component } from "react";
import { Link } from "react-router-dom";
import http from "./../services/httpService";
import Table from "./common/table";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import ws from "./../services/webSocketService";

// const apiEndpoint = "http://localhost/projects/bittrain_exchange/coinmarketcap.com/api.php?coins_list=all";
// const apiEndpoint = "?coins_list=all";
const apiEndpoint = "/currencies";

class CoinsList extends Component {
  _isMounted = false;

  columns = [
    {
      path: "pair",
      label: "Coin Name",
      content: coin => (
        <Link to={`/coin-detail/${this.decorateColumnName(coin.pair)}`}>
          {this.decorateColumnName(coin.pair)}
        </Link>
      )
    },
    { path: "last_price", label: "Price" },
    { path: "volume", label: "Volume" },
    {
      path: "price_change_percent",
      label: "Price Change (%)",
      content: coin => parseFloat(coin.price_change_percent).toFixed(2)
    }
  ];

  state = {
    coins: [],
    currentPage: 1,
    pageSize: 10,
    sortColumn: { path: "", order: "asc" }
  };

  sendRequest() {
    // let url = 'https://bittrain.org/API/Welcome/check_web_login';
    // let url = "http://localhost/projects/bittrain_exchange/bittrain_exchange_api/public/api/react-login";
    let url = "/react-login";
    // let url = "http://localhost/test/curl/test.php";
    let data;

    /* data = {
      bit_uname: "tabassumali21",
      bit_password: "!Scitilop!1"
    }; */
    // data = JSON.stringify(data);

    const formData = new FormData();
    formData.append("bit_uname", "tabassumali21");
    formData.append("bit_password", "!Scitilop!1");
    data = formData;

    let headers = {
      // "Content-Type": "application/json"
      "Content-Type": "application/x-www-form-urlencoded"
      // "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      // "Content-Type": "multipart/form-data"
      // "Content-Type": "text/plain"
    };

    http
      .post(url, data)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  decorateColumnName(column) {
    return column.substring(0, column.indexOf("USDT"));
  }

  async componentDidMount() {
    this._isMounted = true;
    const { data } = await http.get(apiEndpoint);
    this.setState({ coins: data });

    /* ws.channel("home").listen("NewMessage", e => {
      console.log(e.message);
    }); */
    ws.channel("live").listen("LiveRates", e => {
      // console.log(e.rates);
      this.setState({ coins: e.rates });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
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
    return { totalCount: allCoins.length, coins };
  };

  render() {
    const { length: count } = this.state.coins;
    const { pageSize, currentPage, sortColumn } = this.state;

    if (count === 0) return <p>There are no coins in the database.</p>;

    const { totalCount, coins } = this.getPagedData();

    return (
      <React.Fragment>
        <button onClick={this.sendRequest}>Send Request</button>
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
