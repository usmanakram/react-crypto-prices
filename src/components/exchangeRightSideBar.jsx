import React from "react";
import ExchangeRightBottomTable from "./exchangeRightBottomTable";

const ExchangeRightSideBar = ({ ...rest }) => {
  return (
    <React.Fragment>
      {/* <ExchangeRightTopTable /> */}
      <ExchangeRightBottomTable {...rest} />
    </React.Fragment>
  );
};

export default ExchangeRightSideBar;
