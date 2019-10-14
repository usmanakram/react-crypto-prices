import React from "react";
import SellInstantOrderForm from "./sellInstantOrderForm";
import BuyInstantOrderForm from "./buyInstantOrderForm";

const InstantOrder = ({ selectedPair, onTrade }) => {
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
                <th scope="col">Buy BTC</th>
                <th scope="col">SELL BTC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <BuyInstantOrderForm
                  selectedPair={selectedPair}
                  onTrade={onTrade}
                />
                <SellInstantOrderForm
                  selectedPair={selectedPair}
                  onTrade={onTrade}
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
