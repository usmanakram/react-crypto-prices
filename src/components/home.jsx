import React, { Component } from "react";
import Header from "./header";
import {
  highlights,
  news,
  activities,
  wallets,
  categories,
} from "../services/fakeActivity";
import GettingStarted from "./gettingStarted";
import LeatestNews from "./leatestNews";
import Wallet from "./wallet";
// import WalletCategories from "./walletCategories";
import ActivitySection from "./activitySection";
import LatestRate from "./latestRate";
import Banner from "./banner";
import HighLightWedget from "./highLightWidget";

class Home extends Component {
  state = {
    highlights: highlights,
    news: news,
    wallets: wallets,
    categories: categories,
    activities: activities,
  };
  render() {
    return (
      <React.Fragment>
        <div className="banner-block">
          <Header />

          <Banner />
          <HighLightWedget highlights={this.state.highlights} />
        </div>
        <LatestRate />
        <ActivitySection activities={this.state.activities} />
        {/* <WalletCategories categories={this.state.categories} />s */}
        <Wallet wallets={this.state.wallets} />
        <LeatestNews news={this.state.news} />
        <GettingStarted />
      </React.Fragment>
    );
  }
}

export default Home;
