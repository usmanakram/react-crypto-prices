import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import logo from "./logo.svg";
import "./App.css";
import NavBar from "./components/navbar";
import CoinsList from "./components/coinsList";
import Login from "./components/login";
import CoinDetail from "./components/coinDetail";
import NotFound from "./components/notFound";
import "react-toastify/dist/ReactToastify.min.css";

function App() {
  return (
    <React.Fragment>
      <ToastContainer />
      <NavBar />
      <div className="container">
        <Switch>
          <Route path="/coin-detail/:coin" component={CoinDetail} />
          <Route path="/login" component={Login} />
          <Route path="/not-found" component={NotFound} />
          <Route path="/" exact component={CoinsList} />
          <Redirect to="/" />
        </Switch>
      </div>
    </React.Fragment>
  );
}

export default App;
