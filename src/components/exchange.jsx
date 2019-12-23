import React, { Component } from "react";
import { exchangeDefaultPair } from "../config.json";
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
import { handleWidth } from "../services/custom";

class Exchange extends Component {
  state = {
    currencyPairs: [],
    selectedPair: {},
    selectedPairStats: {
      last_rate: "",
      volume: "",
      low: "",
      high: "",
      rate_change: ""
    },
    baseCurrencyBalance: {},
    quoteCurrencyBalance: {},
    // OrderBookAndTradeHistorySpinner: false,
    darkBg: false,
    isFullWidth: false
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

    if (selectedPair === undefined) {
      this.props.history.replace("/exchange/" + exchangeDefaultPair);
      return;
    }

    await this.setState({ selectedPair });

    if (this.user) {
      this.setBalances();
    }

    // this.setOrderBookAndTradeHistory();
    this.handleSelectedPairStats(selectedPair.latest_rate);

    ws.leaveChannel("live");
    ws.channel("live").listen("LiveRates", e => {
      this.setState({ currencyPairs: e.rates });
      const pair = e.rates.find(p => p.id === selectedPair.id);
      this.handleSelectedPairStats(pair.latest_rate);
    });
  };

  handleSelectedPairStats = latest_rate => {
    this.setState({
      selectedPairStats: {
        last_rate: latest_rate.last_rate,
        volume: latest_rate.volume,
        low: latest_rate.low,
        high: latest_rate.high,
        rate_change: latest_rate.rate_change
      }
    });
  };

  handleUserStream = () => {
    if (this.user) {
      ws.channel("User." + this.user.sub)
        .listen("BalanceUpdated", e => {
          this.handleBalances(e.balances);
        })
        .listen("TradeOrderFilled", e => {
          toast.success(e.message);
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

  setOrderBookAndTradeHistory = async () => {
    const { selectedPair } = this.state;

    if (Object.keys(selectedPair).length) {
      try {
        // this.setState({ OrderBookAndTradeHistorySpinner: true });

        const pair = await trade.getLatestRate(selectedPair.id);
        /* const dataPromise = trade.getOrderBook(selectedPair.id);
        const pairPromise = trade.getLatestRate(selectedPair.id);
        const [data, pair] = await Promise.all([dataPromise, pairPromise]); */

        this.handleSelectedPairStats(pair.latest_rate);
        // this.setState({ OrderBookAndTradeHistorySpinner: false });
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
  handleWidthChange = () => {
    this.setState({ isFullWidth: !this.state.isFullWidth });
    handleWidth();
  };

  render() {
    const {
      selectedPair,
      selectedPairStats,
      baseCurrencyBalance,
      quoteCurrencyBalance,
      currencyPairs,
      darkBg,
      isFullWidth
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
          isFullWidth={isFullWidth}
          onWidthChange={this.handleWidthChange}
        />
        <ExchangeBody
          isFullWidth={isFullWidth}
          currencyPairs={currencyPairs}
          selectedPair={selectedPair}
          selectedPairStats={selectedPairStats}
          quoteCurrencyBalance={quoteCurrencyBalance}
          baseCurrencyBalance={baseCurrencyBalance}
        />
        <ExchangeOpenOrder selectedPair={selectedPair} />
        <GettingStarted />
      </div>
    );
  }
}

export default Exchange;
