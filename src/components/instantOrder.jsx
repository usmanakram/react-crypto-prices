import React from "react";
import SellInstantOrderForm from "./sellInstantOrderForm";
import BuyInstantOrderForm from "./buyInstantOrderForm";
import auth from "../services/authService";

const user = auth.getCurrentUser();
const authorizedUsers = [24, 40];

const InstantOrder = ({
  selectedPair,
  selectedPairStats,
  quoteCurrencyBalance,
  baseCurrencyBalance
}) => {
  return (
    // <div role="tabpanel" className="tab-pane fade" id="">
    //   <div className="tab-content">
    <div role="tabpanel" className="tab-pane fade in active show" id="instant_order">
      <table className="table tv_orde_table">
        <thead>
          <tr>
            {user && authorizedUsers.includes(parseInt(user.sub)) && (
            <th scope="col">Buy {selectedPair.base_currency_symbol}</th>
            )}
            <th scope="col">SELL {selectedPair.base_currency_symbol}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {user && authorizedUsers.includes(parseInt(user.sub)) && (
            <BuyInstantOrderForm
              selectedPair={selectedPair}
              selectedPairStats={selectedPairStats}
              balance={quoteCurrencyBalance}
            />
            )}
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
