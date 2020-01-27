import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import logo from "./logo.svg";
import "./App.css";
import Login from "./components/login";
import Logout from "./components/logout";
import CoinInfo from "./components/coinInfo";
import Deposits from "./components/deposits";
import Withdrawal from "./components/withdrawal";
import OrderHistory from "./components/orderHistory";
import Balances from "./components/balances";
import Exchange from "./components/exchange";
import NotFound from "./components/notFound";
import "react-toastify/dist/ReactToastify.min.css";
import Footer from "./components/footer";
import Home from "./components/home";
import TradeHistory from "./components/tradeHistory";
import OpenOrder from "./components/openOrder";
import TransactionHistory from "./components/transactionHistory";
import SignUp from "./components/signUp";

const App = () => {
  return (
    <React.Fragment>
      <ToastContainer />
      <div id="content">
        <Switch>
          <Route path="/coin-info/:pairId" component={CoinInfo} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/home" component={Home} />
          <Route path="/logout" component={Logout} />
          <Route path="/deposits" component={Deposits} />
          <Route path="/withdrawal" component={Withdrawal} />
          <Route path="/orderHistory" component={OrderHistory} />
          <Route path="/tradeHistory" component={TradeHistory} />
          <Route path="/openOrder" component={OpenOrder} />
          <Route path="/balances" component={Balances} />
          <Route path="/transactionHistory" component={TransactionHistory} />
          <Route path="/exchange/:symbol" component={Exchange} />
          <Route path="/not-found" component={NotFound} />
          <Route path="/" exact component={Home} />
          <Redirect to="/" />
        </Switch>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default App;
