import React, { Component } from "react";
import { Link } from "react-router-dom";
import { exchangeRightTopValues } from "../services/fakeExchange";

class CurrencyPairsTables extends Component {
  state = {
    favorites: []
  };

  favoritesKey = "favoritePairs";

  componentDidMount() {
    const favorites = JSON.parse(localStorage.getItem(this.favoritesKey)) || [];
    this.setState({ favorites });
  }

  setFavorites = symbol => {
    const { favorites } = this.state;

    const index = favorites.indexOf(symbol);
    if (index === -1) favorites.push(symbol);
    else favorites.splice(index, 1);

    localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    this.setState({ favorites });
  };

  render() {
    const { currencyPairs } = this.props;
    const { favorites } = this.state;

    const quoteCurrencies = [
      ...new Set(currencyPairs.map(p => p.quote_currency_symbol))
    ].sort();

    return (
      <div className="tab-content">
        <div
          role="tabpanel"
          className="tab-pane fade das-market-tab-pane"
          id="favorite_ticker"
        >
          <table className="table das-oreder-table table-hover exchange-orderBook">
            {/* <table className="table coin-list table-hover das-market-table"> */}
            <thead>
              <tr>
                <th></th>
                <th scope="col">Pair</th>
                <th scope="col">Price</th>
                <th scope="col">Change</th>
              </tr>
            </thead>
            <tbody>
              {currencyPairs
                .filter(p => favorites.includes(p.symbol))
                .map(value => (
                  <tr key={value.id}>
                    <td>
                      <div
                        className={`favorite-coin ${
                          favorites.includes(value.symbol) ? "active" : ""
                        }`}
                        onClick={() => this.setFavorites(value.symbol)}
                      ></div>
                    </td>
                    <td>
                      <Link to={`/exchange/${value.symbol}`}>
                        {value.symbol}
                      </Link>
                    </td>
                    <td>
                      <span className={value.color1}>
                        {value.latest_rate.last_rate}
                      </span>
                    </td>
                    <td>
                      <span className={value.color2}>
                        {value.latest_rate.rate_change.toFixed(8)}
                      </span>
                    </td>
                  </tr>
                ))}
              {/* {exchangeRightTopValues.map(value => (
                <tr key={value.price}>
                  <td>
                    <div className="favorite-coin"></div>
                  </td>
                  <td>{value.pair}</td>
                  <td>
                    <span className={value.color1}>{value.price}</span>
                  </td>
                  <td>
                    <span className={value.color2}>{value.change}</span>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
        {quoteCurrencies.map((c, i) => (
          <div
            key={c}
            role="tabpanel"
            className={`tab-pane fade das-market-tab-pane ${
              i === 0 ? "in active show" : ""
            }`}
            id={c}
          >
            <table className="table das-oreder-table table-hover exchange-orderBook">
              <thead>
                <tr>
                  <th></th>
                  <th scope="col">Pair</th>
                  <th scope="col">Price</th>
                  <th scope="col">Change</th>
                </tr>
              </thead>
              <tbody>
                {currencyPairs
                  .filter(p => p.quote_currency_symbol === c)
                  .map(value => (
                    <tr key={value.id}>
                      <td>
                        <div
                          className={`favorite-coin ${
                            favorites.includes(value.symbol) ? "active" : ""
                          }`}
                          onClick={() => this.setFavorites(value.symbol)}
                        ></div>
                      </td>
                      <td>
                        <Link to={`/exchange/${value.symbol}`}>
                          {value.symbol}
                        </Link>
                      </td>
                      <td>
                        <span className={value.color1}>
                          {value.latest_rate.last_rate}
                        </span>
                      </td>
                      <td>
                        <span className={value.color2}>
                          {value.latest_rate.rate_change.toFixed(8)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
        {/* <div
          role="tabpanel"
          className="tab-pane fade das-market-tab-pane"
          id="USDT"
        >
          <table className="table das-oreder-table table-hover exchange-orderBook">
            <thead>
              <tr>
                <th></th>
                <th scope="col">Pair</th>
                <th scope="col">Price</th>
                <th scope="col">Change</th>
              </tr>
            </thead>
            <tbody>
              {exchangeRightTopValues.map(value => (
                <tr key={value.price}>
                  <td>
                    <div className="favorite-coin"></div>
                  </td>
                  <td>{value.pair}</td>
                  <td>
                    <span className={value.color1}>{value.price}</span>
                  </td>
                  <td>
                    <span className={value.color2}>{value.change}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          role="tabpanel"
          className="tab-pane fade das-market-tab-pane"
          id="BTC"
        >
          <table className="table das-oreder-table table-hover exchange-orderBook">
            <thead>
              <tr>
                <th></th>
                <th scope="col">Pair</th>
                <th scope="col">Price</th>
                <th scope="col">Change</th>
              </tr>
            </thead>
            <tbody>
              {exchangeRightTopValues.map(value => (
                <tr key={value.price}>
                  <td>
                    <div className="favorite-coin"></div>
                  </td>
                  <td>{value.pair}</td>
                  <td>
                    <span className={value.color1}>{value.price}</span>
                  </td>
                  <td>
                    <span className={value.color2}>{value.change}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </div>
    );
  }
}

export default CurrencyPairsTables;
