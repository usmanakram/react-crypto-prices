import React from "react";
import ExchangeRightBottomTable from "./exchangeRightBottomTable";

const ExchangeRightSideBar = ({ tradeHistory }) => {
  return (
    <React.Fragment>
      {/* <ExchangeRightTopTable /> */}
      <ExchangeRightBottomTable tradeHistory={tradeHistory} />
    </React.Fragment>
  );
};

export default ExchangeRightSideBar;
