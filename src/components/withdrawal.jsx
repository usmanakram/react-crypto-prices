import React, { Component } from "react";

import Header from "./header";
import ThemeTable from "./themeTable";
import { themeTableHeadings, themeTableValue } from "../services/fakeExchange";

class Withdrawal extends Component {
  state = {
    themeTableHeadings: themeTableHeadings,
    themeTableValue: themeTableValue
  };

  render() {
    return (
      <React.Fragment>
        <div className="navigation-two">
          <Header />
        </div>

        <ThemeTable
          themeTableHeadings={this.state.themeTableHeadings}
          themeTableValue={this.state.themeTableValue}
        />
      </React.Fragment>
    );
  }
}

export default Withdrawal;
