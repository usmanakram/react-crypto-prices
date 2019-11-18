import React from "react";
import SellOcoForm from "./sellOcoForm";
import BuyOcoForm from "./buyOcoForm";

const Oco = ({
  selectedPair,
  onTrade,
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
              selectedPair={selectedPair}
              onTrade={onTrade}
              balance={quoteCurrencyBalance}
            />
            <SellOcoForm
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

export default Oco;
