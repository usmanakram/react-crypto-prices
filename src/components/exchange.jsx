import React, { Component } from "react";
import http from "../services/httpService";
import trade from "../services/tradeService";
import Header from "./header";
import ExchangeOneBody from "./exchangeOneBody";
import CurrencyRate from "./currencyRate";
import ThemeTable from "./themeTable";
import GettingStarted from "./gettingStarted";
import auth from "../services/authService";
import ws from "../services/webSocketService";
import { toast } from "react-toastify";
import _ from "lodash";

class Exchange extends Component {
  state = {
    currencyPairs: [],
    selectedPair: {},
    selectedPairStats: {
      last_price: "",
      volume: ""
    },
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
      const selectedPair = currencyPairs[0];

      this.setState({ currencyPairs, selectedPair });

      this.setBalances();
      this.setOpenOrders();

      this.setOrderBookAndTradeHistory();

      ws.channel("live").listen("LiveRates", e => {
        const pair = e.rates.find(p => p.id === selectedPair.id);
        this.handleSelectedPairStats(pair.latest_price);
      });
    } catch (ex) {
      console.log(ex);
    }

    this.handleUserStream();
  }

  handleSelectedPairStats = latest_price => {
    this.setState({
      selectedPairStats: {
        last_price: latest_price.last_price,
        volume: latest_price.volume
      }
    });
  };

  handleUserStream = () => {
    const user = auth.getCurrentUser();

    if (auth.getCurrentUser()) {
      ws.channel("User." + user.sub)
        .listen("TradeOrderFilled", e => {
          /**
           * It's temporary solution. Balances will be received over websocket connection at OrderFiled event.
           */
          // this.props.onTrade();
          this.setBalances();

          toast.success(e.message);
        })
        .listen("OpenOrdersUpdated", e => {
          this.handleOpenOrders(e.openOrders);
        });
    }
  };

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

  handleOpenOrders = orders => {
    const { selectedPair } = this.state;

    const openOrders = orders.filter(
      o => o.currency_pair_id === selectedPair.id
    );

    this.setState({ openOrders });
  };

  setOpenOrders = async () => {
    const { selectedPair } = this.state;

    if (Object.keys(selectedPair).length) {
      try {
        const orders = await trade.getUserOpenOrders();

        this.handleOpenOrders(orders);
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          console.log(ex.response.data);
          // toast.error(ex.response.data);
        }
      }
    }
  };

  handleOrderBook = orderBookData => {
    orderBookData.sellOrders = _(orderBookData.sellOrders)
      .take(5)
      .value();
    orderBookData.buyOrders = _(orderBookData.buyOrders)
      .take(5)
      .value();

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
        const pair = await trade.getLatestPrice(selectedPair.id);

        this.handleOrderBook(data);
        this.handleTradeHistory(tradeHistory);
        this.handleSelectedPairStats(pair.latest_price);
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
      selectedPairStats,
      orderBookData,
      tradeHistory,
      openOrders,
      baseCurrencyBalance,
      quoteCurrencyBalance
    } = this.state;

    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>
        <CurrencyRate
          selectedPair={selectedPair}
          selectedPairStats={selectedPairStats}
        />
        <ExchangeOneBody
          selectedPair={selectedPair}
          selectedPairStats={selectedPairStats}
          orderBookData={orderBookData}
          onOrderBookUpdate={this.handleOrderBook}
          onTrade={this.setBalances}
          tradeHistory={tradeHistory}
          quoteCurrencyBalance={quoteCurrencyBalance}
          baseCurrencyBalance={baseCurrencyBalance}
          onTradeHistoryUpdate={this.handleTradeHistory}
        />

        <ThemeTable selectedPair={selectedPair} openOrders={openOrders} />
        <GettingStarted />
      </React.Fragment>
    );
  }
}

export default Exchange;
