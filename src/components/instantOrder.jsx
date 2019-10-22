import React from "react";
import SellInstantOrderForm from "./sellInstantOrderForm";
import BuyInstantOrderForm from "./buyInstantOrderForm";

const InstantOrder = ({
  selectedPair,
  selectedPairStats,
  onTrade,
  quoteCurrencyBalance,
  baseCurrencyBalance
}) => {
  return (
    <div role="tabpanel" className="tab-pane fade" id="instant_order">
      <div className="tab-content">
        <div
          role="tabpanel"
          className="tab-pane fade in active show"
          id="buy_btc_two"
        >
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
                  onTrade={onTrade}
                  balance={quoteCurrencyBalance}
                />
                <SellInstantOrderForm
                  selectedPair={selectedPair}
                  selectedPairStats={selectedPairStats}
                  onTrade={onTrade}
                  balance={baseCurrencyBalance}
                />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstantOrder;
