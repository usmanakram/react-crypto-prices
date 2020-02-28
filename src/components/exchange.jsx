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
// import { handleWidth } from "../services/custom";
import storage from "../utils/storage";

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
    isDarkBg: false,
    isFullWidth: false
  };

  user = auth.getCurrentUser();

  constructor() {
    super();
    const { isDarkBg, isFullWidth } = this.state;
    this.state.isDarkBg = storage.get("isDarkBg") || isDarkBg;
    this.state.isFullWidth = storage.get("isFullWidth") || isFullWidth;
  }

  componentDidMount() {
    this.getCurrencyPairs();
    this.handleUserStream();
  }

  componentWillUnmount() {
    if (this.user) {
      ws.leaveChannel("User." + this.user.sub);
    }
    ws.leaveChannel("live");
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const symbol = this.props.match.params.symbol;
    if (this.state.selectedPair.symbol !== symbol)
      this.handleCurrencyPairChange(symbol);
  }

  /* static getDerivedStateFromProps(props, state) {
    console.log("inside getDerivedStateFromProps method");
    return null;
  } */

  getCurrencyPairs = async () => {
    try {
      const { data: currencyPairs } = await http.get("/currency-pairs");
      this.setState({ currencyPairs });
    } catch (ex) {
      console.log(ex);
    }
  };

  handleCurrencyPairChange = async symbol => {
    const { currencyPairs } = this.state;
    const selectedPair = currencyPairs.find(p => p.symbol === symbol);

    if (selectedPair === undefined) {
      const defaultPairData = currencyPairs.find(
        p => p.symbol === exchangeDefaultPair
      );
      let url;
      if (defaultPairData !== undefined) {
        // Open exchange with default pair selection
        url = "/exchange/" + exchangeDefaultPair;
      } else if (currencyPairs.length > 0) {
        // Open exchange with first pair (in pairs array) selection
        url = "/exchange/" + currencyPairs[0].symbol;
      } else {
        // Redirect to home page, if pairs array is empty
        url = "/";
      }
      this.props.history.replace(url);
      return;
    }

    await this.setState({ selectedPair });

    if (this.user) {
      this.setBalances();
    }

    // this.setOrderBookAndTradeHistory();
    this.handleSelectedPairStats(selectedPair.latest_rate);

    ws.leaveChannel("live");
    ws.channel("live")
      .listen("LiveRates", e => {
        this.setState({ currencyPairs: e.rates });
        const pair = e.rates.find(p => p.id === selectedPair.id);
        this.handleSelectedPairStats(pair.latest_rate);
      })
      .listen("CurrencyPairsUpdated", e => {
        this.setState({ currencyPairs: e.pairs });
        const symbol = this.props.match.params.symbol;
        this.handleCurrencyPairChange(symbol);
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
    storage.set("isDarkBg", !this.state.isDarkBg);
    this.setState({ isDarkBg: !this.state.isDarkBg });
  };
  handleWidthChange = () => {
    storage.set("isFullWidth", !this.state.isFullWidth);
    this.setState({ isFullWidth: !this.state.isFullWidth });
    // handleWidth();
  };

  render() {
    const {
      selectedPair,
      selectedPairStats,
      baseCurrencyBalance,
      quoteCurrencyBalance,
      currencyPairs,
      isDarkBg,
      isFullWidth
    } = this.state;

    return (
      <div className={isDarkBg ? "dark-blue-bg" : ""}>
        <div className="navigation-two">
          <Header isFullWidth={isFullWidth} />
        </div>
        <CurrencyRate
          isDarkBg={isDarkBg}
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
        <ExchangeOpenOrder
          selectedPair={selectedPair}
          isFullWidth={isFullWidth}
        />
        <GettingStarted />
      </div>
    );
  }
}

export default Exchange;
