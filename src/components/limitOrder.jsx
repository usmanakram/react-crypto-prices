import React from "react";
import BuyLimitOrderForm from "./buyLimitOrderForm";
import SellLimitOrderForm from "./sellLimitOrderForm";

const LimitOrder = ({
  selectedPair,
  onTrade,
  quoteCurrencyBalance,
  baseCurrencyBalance
}) => {
  return (
    <div
      role="tabpanel"
      className="tab-pane fade in active show"
      id="limit_order"
    >
      <table className="table tv_orde_table">
        <thead>
          <tr>
            <th className="tv_orde_1st_th" scope="col">
              Buy BTC
            </th>
            <th scope="col">SELL BTC</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <BuyLimitOrderForm
              selectedPair={selectedPair}
              onTrade={onTrade}
              balance={quoteCurrencyBalance}
            />
            <SellLimitOrderForm
              selectedPair={selectedPair}
              onTrade={onTrade}
              balance={baseCurrencyBalance}
            />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LimitOrder;
