import React, { Component } from "react";
import http from "../services/httpService";
import trade from "../services/tradeService";
import Header from "./header";
import ExchangeBody from "./exchangeBody";
import CurrencyRate from "./currencyRate";
import ExchangeOpenOrder from "./exchangeOpenOrder";
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
      volume: "",
      low: "",
      high: "",
      price_change: ""
    },
    baseCurrencyBalance: {},
    quoteCurrencyBalance: {},
    openOrders: [],
    orderBookData: {
      buyOrders: [],
      sellOrders: []
    },
    tradeHistory: [],
    openOrderSpinner: false,
    OrderBookAndTradeHistorySpinner: false,
    darkBg: false
  };

  user = auth.getCurrentUser();

  async componentDidMount() {
    const symbol = this.props.match.params.symbol;

    try {
      const { data: currencyPairs } = await http.get("/currency-pairs");

      // Temporarily block all pairs except Bittrain Coin vs Bitcoin
      // const currencyPairs = data.filter(p => p.symbol === "BCBTC");

      this.setState({ currencyPairs });
    } catch (ex) {
      console.log(ex);
    }

    this.handleUserStream();
  }

  componentWillUnmount() {
    if (this.user) {
      ws.leaveChannel("User." + this.user.sub);
    }
    ws.leaveChannel("live");
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log("inside componentDidUpdate method");
    const symbol = this.props.match.params.symbol;
    if (this.state.selectedPair.symbol !== symbol)
      this.handleCurrencyPairChange(symbol);
  }

  /* static getDerivedStateFromProps(props, state) {
    console.log("inside getDerivedStateFromProps method");
    return null;
  } */

  handleCurrencyPairChange = async symbol => {
    const selectedPair = this.state.currencyPairs.find(
      p => p.symbol === symbol
    );

    await this.setState({ selectedPair });

    if (this.user) {
      this.setBalances();
      this.setOpenOrders();
    }

    this.setOrderBookAndTradeHistory();

    ws.leaveChannel("live");
    ws.channel("live").listen("LiveRates", e => {
      const pair = e.rates.find(p => p.id === selectedPair.id);
      this.handleSelectedPairStats(pair.latest_price);
    });
  };

  handleSelectedPairStats = latest_price => {
    this.setState({
      selectedPairStats: {
        last_price: latest_price.last_price,
        volume: latest_price.volume,
        low: latest_price.low,
        high: latest_price.high,
        price_change: latest_price.price_change
      }
    });
  };

  handleUserStream = () => {
    if (this.user) {
      ws.channel("User." + this.user.sub)
        .listen("BalanceUpdated", e => {
          this.handleBalances(e.balances);
        })
        // .listen("TradeOrderPlaced", e => {
        //   this.handleBalances(e.balances);
        // })
        .listen("TradeOrderFilled", e => {
          toast.success(e.message);
        })
        .listen("OpenOrdersUpdated", e => {
          this.handleOpenOrders(e.openOrders);
        });
    }
  };

  handleBalances = balances => {
    const { selectedPair } = this.state;

    const baseCurrencyBalance = balances.find(
      b => b.id === selectedPair.base_currency_id
    );
    const quoteCurrencyBalance = balances.find(
      b => b.id === selectedPair.quote_currency_id
    );

    this.setState({ baseCurrencyBalance, quoteCurrencyBalance });
  };

  setBalances = async () => {
    if (Object.keys(this.state.selectedPair).length) {
      try {
        const balances = await trade.getBalances();
        this.handleBalances(balances);
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          console.log(ex.response.data);
          // toast.error(ex.response.data);
        }
      }
    }
  };

  handleOpenOrders = orders => {
    const openOrders = orders.filter(
      o => o.currency_pair_id === this.state.selectedPair.id
    );

    this.setState({ openOrders });
  };

  setOpenOrders = async () => {
    if (Object.keys(this.state.selectedPair).length) {
      try {
        this.setState({ openOrderSpinner: true });
        const orders = await trade.getUserOpenOrders();

        this.handleOpenOrders(orders);
        this.setState({ openOrderSpinner: false });
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
        this.setState({ OrderBookAndTradeHistorySpinner: true });

        /* const data = await trade.getOrderBook(selectedPair.id);
        const tradeHistory = await trade.getTradeHistory(selectedPair.id);
        const pair = await trade.getLatestPrice(selectedPair.id); */
        const dataPromise = trade.getOrderBook(selectedPair.id);
        const tradeHistoryPromise = trade.getTradeHistory(selectedPair.id);
        const pairPromise = trade.getLatestPrice(selectedPair.id);
        const [data, tradeHistory, pair] = await Promise.all([
          dataPromise,
          tradeHistoryPromise,
          pairPromise
        ]);

        this.handleOrderBook(data);
        this.handleTradeHistory(tradeHistory);
        this.handleSelectedPairStats(pair.latest_price);
        this.setState({ OrderBookAndTradeHistorySpinner: false });
      } catch (ex) {
        if (ex.response && ex.response.status === 400) {
          console.log(ex.response.data);
        }
      }
    }
  };

  handleChangeBg = () => {
    this.setState({ darkBg: !this.state.darkBg });
  };

  render() {
    const {
      selectedPair,
      selectedPairStats,
      orderBookData,
      tradeHistory,
      openOrders,
      baseCurrencyBalance,
      quoteCurrencyBalance,
      currencyPairs,
      darkBg
    } = this.state;

    return (
      <div className={darkBg ? "dark-blue-bg" : ""}>
        <div className="navigation-two">
          <Header />
        </div>
        <CurrencyRate
          darkBg={darkBg}
          onBgChangeRequest={this.handleChangeBg}
          selectedPair={selectedPair}
          currencyPairs={currencyPairs}
          selectedPairStats={selectedPairStats}
        />
        <ExchangeBody
          currencyPairs={currencyPairs}
          status={this.state.OrderBookAndTradeHistorySpinner}
          selectedPair={selectedPair}
          selectedPairStats={selectedPairStats}
          orderBookData={orderBookData}
          onOrderBookUpdate={this.handleOrderBook}
          tradeHistory={tradeHistory}
          quoteCurrencyBalance={quoteCurrencyBalance}
          baseCurrencyBalance={baseCurrencyBalance}
          onTradeHistoryUpdate={this.handleTradeHistory}
        />
        <ExchangeOpenOrder
          status={this.state.openOrderSpinner}
          selectedPair={selectedPair}
          openOrders={openOrders}
          onCancelOrder={this.handleOpenOrders}
        />
        <GettingStarted />
      </div>
    );
  }
}

export default Exchange;
