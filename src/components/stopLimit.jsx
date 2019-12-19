import React from "react";
import BuyStopLimitForm from "./buyStopLimitForm";
import SellStopLimitForm from "./sellStopLimitForm";

const StopLimit = ({
  selectedPairStats,
  selectedPair,
  quoteCurrencyBalance,
  baseCurrencyBalance
}) => {
  return (
    <div role="tabpanel" className="tab-pane fade in show" id="stop-limit">
      <table className="table tv_orde_table">
        <thead>
          <tr>
            <th className="tv_orde_1st_th" scope="col">
              Buy {selectedPair.base_currency_symbol}
            </th>

            <th scope="col">SELL {selectedPair.base_currency_symbol}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <BuyStopLimitForm
              selectedPairStats={selectedPairStats}
              selectedPair={selectedPair}
              balance={quoteCurrencyBalance}
            />
            <SellStopLimitForm
              selectedPairStats={selectedPairStats}
              selectedPair={selectedPair}
              balance={baseCurrencyBalance}
            />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StopLimit;
