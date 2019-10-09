import React, { Component } from "react";
import OrderBook from "./orderBook";
import BuyOrderForm from "./buyOrderForm";
import SellOrderForm from "./sellOrderForm";
import Select from "./common/select";
import http from "../services/httpService";
import trade from "../services/tradeService";

class Exchange extends Component {
  state = {
    currencyPairs: [],
    selectedPair: {},
    baseCurrencyBalance: {},
    quoteCurrencyBalance: {},
    orderBookData: {
      buyOrders: [],
      sellOrders: []
    }
  };

  async componentDidMount() {
    try {
      const { data } = await http.get("/currency-pairs");

      // Temporarily block all pairs except Bittrain Coin vs Bitcoin
      const currencyPairs = data.filter(p => p.symbol === "BCBTC");

      this.setState({ currencyPairs, selectedPair: currencyPairs[0] });

      this.setBalances();

      this.setOrderBook();
    } catch (ex) {
      console.log(ex);
    }
  }

  setBalances = async () => {
    const { selectedPair } = this.state;

    if (Object.keys(selectedPair).length) {
      try {
        const balances = await trade.getBalances();

        const baseCurrencyBalance = balances.find(
          b => b.id === selectedPair.base_currency_id
        );
        const quoteCurrencyBalance = balances.find(
          b => b.id === selectedPair.quote_currency_id
        );

        this.setState({ baseCurrencyBalance, quoteCurrencyBalance });
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          console.log(ex.response.data);
          // toast.error(ex.response.data);
        }
      }
    }
  };

  handleOrderBook = orderBookData => {
    this.setState({ orderBookData });
  };

  setOrderBook = async () => {
    const { selectedPair } = this.state;

    if (Object.keys(selectedPair).length) {
      try {
        const data = await trade.getOrderBook(selectedPair.id);

        this.handleOrderBook(data);
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          console.log(ex.response.data);
        }
      }
    }
  };

  render() {
    const {
      currencyPairs,
      selectedPair,
      baseCurrencyBalance,
      quoteCurrencyBalance,
      orderBookData
    } = this.state;

    return (
      <div className="row">
        <div className="col-md-12">
          <h1>Exchange Page</h1>
          <div className="row">
            <div className="col-md-3">
              <Select
                name="pairs"
                label="Trading Pairs"
                options={currencyPairs}
              />
            </div>
            <div className="col-md-3">
              <OrderBook
                selectedPair={selectedPair}
                orderBookData={orderBookData}
                onOrderBookUpdate={this.handleOrderBook}
                onTrade={this.setBalances}
              />
            </div>
            <div className="col-md-6">
              <div className="row">
                <BuyOrderForm
                  selectedPair={selectedPair}
                  balance={quoteCurrencyBalance}
                  onTrade={this.setBalances}
                />
                <SellOrderForm
                  selectedPair={selectedPair}
                  balance={baseCurrencyBalance}
                  onTrade={this.setBalances}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Exchange;
