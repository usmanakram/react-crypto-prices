import React from "react";
import SellInstantOrderForm from "./sellInstantOrderForm";
import BuyInstantOrderForm from "./buyInstantOrderForm";

const InstantOrder = ({
  selectedPair,
  selectedPairStats,
  quoteCurrencyBalance,
  baseCurrencyBalance
}) => {
  return (
    // <div role="tabpanel" className="tab-pane fade" id="">
    //   <div className="tab-content">
    <div role="tabpanel" className="tab-pane fade in show" id="instant_order">
      <table className="table tv_orde_table">
        <thead>
          <tr>
            <th scope="col">Buy {selectedPair.base_currency_symbol}</th>
            <th scope="col">SELL {selectedPair.base_currency_symbol}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <BuyInstantOrderForm
              selectedPair={selectedPair}
              selectedPairStats={selectedPairStats}
              balance={quoteCurrencyBalance}
            />
            <SellInstantOrderForm
              selectedPair={selectedPair}
              selectedPairStats={selectedPairStats}
              balance={baseCurrencyBalance}
            />
          </tr>
        </tbody>
      </table>
    </div>
    // </div>
    // </div>
  );
};

export default InstantOrder;
