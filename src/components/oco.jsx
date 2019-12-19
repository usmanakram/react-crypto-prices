import React from "react";
import SellOcoForm from "./sellOcoForm";
import BuyOcoForm from "./buyOcoForm";

const Oco = ({
  selectedPairStats,
  selectedPair,
  quoteCurrencyBalance,
  baseCurrencyBalance
}) => {
  return (
    <div role="tabpanel" className="tab-pane fade in show" id="oco">
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
            <BuyOcoForm
              selectedPairStats={selectedPairStats}
              selectedPair={selectedPair}
              balance={quoteCurrencyBalance}
            />
            <SellOcoForm
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

export default Oco;
