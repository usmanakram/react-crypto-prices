import React, { Component } from "react";
import http from "../services/httpService";
import trade from "../services/tradeService";
import Header from "./header";
import ExchangeOneBody from "./exchangeOneBody";
import CurrencyRate from "./currencyRate";
import ThemeTable from "./themeTable";
import GettingStarted from "./gettingStarted";
import auth from "../services/authService";

class Exchange extends Component {
  state = {
    currencyPairs: [],
    selectedPair: {},
    baseCurrencyBalance: {},
    quoteCurrencyBalance: {},
    openOrders: [],
    orderBookData: {
      buyOrders: [],
      sellOrders: []
    },
    tradeHistory: []
  };

  async componentDidMount() {
    try {
      const { data } = await http.get("/currency-pairs");

      // Temporarily block all pairs except Bittrain Coin vs Bitcoin
      const currencyPairs = data.filter(p => p.symbol === "BCBTC");

      this.setState({ currencyPairs, selectedPair: currencyPairs[0] });

      this.setBalances();
      this.setOpenOrders();

      this.setOrderBookAndTradeHistory();
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

  setOpenOrders = async () => {
    const { selectedPair } = this.state;

    if (Object.keys(selectedPair).length) {
      try {
        const orders = await trade.getUserOpenOrders();
        const openOrders = orders.filter(
          o => o.currency_pair_id === selectedPair.id
        );

        this.setState({ openOrders });
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          console.log(ex.response.data);
          // toast.error(ex.response.data);
        }
      }
    }
  };

  handleOrderBook = orderBookData => {
    // Update sellOrders as "decending order rates"
    orderBookData.sellOrders.sort((a, b) => b.rate - a.rate);
    this.setState({ orderBookData });
  };
  handleTradeHistory = tradeHistory => {
    this.setState({ tradeHistory });
  };

  setOrderBookAndTradeHistory = async () => {
    const { selectedPair } = this.state;

    if (Object.keys(selectedPair).length) {
      try {
        const data = await trade.getOrderBook(selectedPair.id);
        const tradeHistory = await trade.getTradeHistory(selectedPair.id);

        this.handleOrderBook(data);
        this.handleTradeHistory(tradeHistory);
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          console.log(ex.response.data);
        }
      }
    }
  };

  render() {
    const user = auth.getCurrentUser();

    const {
      selectedPair,
      orderBookData,
      tradeHistory,
      openOrders
    } = this.state;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>
        <CurrencyRate />
        <ExchangeOneBody
          selectedPair={selectedPair}
          orderBookData={orderBookData}
          onOrderBookUpdate={this.handleOrderBook}
          onTrade={this.setBalances}
          tradeHistory={tradeHistory}
        />

        <ThemeTable openOrders={openOrders} />
        {!user && <GettingStarted />}
      </React.Fragment>
    );
  }
}

export default Exchange;
