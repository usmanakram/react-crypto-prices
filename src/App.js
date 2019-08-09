import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import NavBar from "./components/navbar";
import CoinsList from "./components/coinsList";
import CoinDetail from "./components/coinDetail";
import NotFound from "./components/notFound";

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <div className="container">
        <Switch>
          <Route path="/coin-detail/:coin" component={CoinDetail} />
          <Route path="/not-found" component={NotFound} />
          <Route path="/" exact component={CoinsList} />
          <Redirect to="/not-found" />
        </Switch>
      </div>
    </React.Fragment>
  );
}

export default App;
