import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import logo from "./logo.svg";
// import "./App.css";
import "./App2.css";
import CoinsList from "./components/coinsList";
import Login from "./components/login";
import Logout from "./components/logout";
import CoinDetail from "./components/coinDetail";
// import Deposits from "./components/deposits";
import Deposits2 from "./components/deposits2";
import Withdrawal from "./components/withdrawal";
import OrderHistory from "./components/orderHistory";
import Transactions from "./components/transactions";
import Balances from "./components/balances";
import Exchange from "./components/exchange";
import NotFound from "./components/notFound";
import "react-toastify/dist/ReactToastify.min.css";
import Footer from "./components/footer";
import Home from "./components/home";
import TradeHistory from "./components/tradeHistory";
import OpenOrder from "./components/openOrder";

const App = () => {
  return (
    <React.Fragment>
      <ToastContainer />
      <Switch>
        <Route path="/coin-detail/:coin" component={CoinDetail} />
        <Route path="/login" component={Login} />
        <Route path="/home" component={Home} />
        <Route path="/logout" component={Logout} />
        <Route path="/deposits2" component={Deposits2} />
        {/* <Route path="/deposits" component={Deposits} /> */}
        <Route path="/withdrawal" component={Withdrawal} />
        <Route path="/orderHistory" component={OrderHistory} />
        <Route path="/tradeHistory" component={TradeHistory} />
        <Route path="/openOrder" component={OpenOrder} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/balances" component={Balances} />
        <Route path="/exchange" component={Exchange} />
        <Route path="/not-found" component={NotFound} />
        <Route path="/" exact component={Home} />
        <Redirect to="/" />
      </Switch>
      <Footer />
    </React.Fragment>
  );
};

export default App;
