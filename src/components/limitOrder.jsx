import React from "react";
import BuyLimitOrderForm from "./buyLimitOrderForm";
import SellLimitOrderForm from "./sellLimitOrderForm";

const LimitOrder = ({
  selectedPair,
  quoteCurrencyBalance,
  baseCurrencyBalance
}) => {
  return (
    <div
      role="tabpanel"
      className="tab-pane fade in show"
      id="limit_order"
    >
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
            <BuyLimitOrderForm
              selectedPair={selectedPair}
              balance={quoteCurrencyBalance}
            />
            <SellLimitOrderForm
              selectedPair={selectedPair}
              balance={baseCurrencyBalance}
            />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LimitOrder;
