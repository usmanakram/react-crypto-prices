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

  getUserDetail() {
    let url = "/auth/user";
    /* let headers = {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVkYzU1YTMyOWMzOTczYmNjMzI5ZWNiNjZkNzc4ZTBmNzFiYTg1OGRjMDhkNDI4OTZiNjcxYWIxN2NlYjZkMGFkNTRiMWE3ZGE4YWE1MTkzIn0.eyJhdWQiOiIxIiwianRpIjoiNWRjNTVhMzI5YzM5NzNiY2MzMjllY2I2NmQ3NzhlMGY3MWJhODU4ZGMwOGQ0Mjg5NmI2NzFhYjE3Y2ViNmQwYWQ1NGIxYTdkYThhYTUxOTMiLCJpYXQiOjE1Njg1MTkzNzcsIm5iZiI6MTU2ODUxOTM3NywiZXhwIjoxNjAwMTQxNzc3LCJzdWIiOiI1MzgiLCJzY29wZXMiOltdfQ.lrcPKxC23SFSjpSphzAkOmy13dfIJFoUiXBR0gzEA2K2cKjHTEB5ot0BdFaUSEY0H6IoH3dDnY-LdaToM-wE-fWW6DkEqPIeq0WiV-3Nv6bKzGMqJM4grFSr2ytqps-NvkgztOQyTi-ImfIHITh0_TzMjc1g5dzkIaA3AOGyQ8H4NI4kg2yFU4_FXo0eGuBfynx4y1x3vWOU5R94JW6-Ilwi4tNqRXQiMANnFIaTjur51WjYw27YqeTSF2zmJLt-XyJEDbCudEGN44g_ZO2sLG2LSuq01xNS2ZveHrn3eB8SZgaTQ_UxctGKWFoY_OCRrZprYthBG2F4QCV-4OqRaV_THboQjCWu4ucVkGY3QMOcb1b3ddUVAXzBCozqGK-9oXwSYQwpiyqEWXNGab4edEyIZqLKiUXekXA4rRTzyfERvx_iF9uv4AFJoA40gqJXC45f82k_HopGmODSJqjrVni3Tqyv2NVFzou9Mn2MXPozwLEPgmsaUypUjFkbyCvfSYJ9GnPJQiwUIIpjsJp8W8vIQZUJjbyfKbYQ6Nz-Tq3clkH3fd3zHtDVAaTPJZFxlTbB0VtODLKAbibeFkukmmjaDN6qh2WSUN72D85925hbAbs3eLr7o7xm6Si8XWQqdicNKjTQpVw6IzbQYURMwio6RizKIbgxbuYwShQgces"
    }; */

    http
      .get(url)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });

    /* try {
      const user = await http.get(uri, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response);
      }
      console.log(ex);
    } */
  }

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

    /* let headers = {
      // "Content-Type": "application/json"
      "Content-Type": "application/x-www-form-urlencoded"
      // "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      // "Content-Type": "multipart/form-data"
      // "Content-Type": "text/plain"
    }; */

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
        {/* <button onClick={this.sendRequest}>Send Request</button>
        <button onClick={this.getUserDetail}>Get User Detail</button> */}
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
