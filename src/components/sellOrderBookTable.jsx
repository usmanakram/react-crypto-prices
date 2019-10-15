import React from "react";
import Spinner from "./spinner";

const SellOrderBookTable = ({ orderBookData }) => {
  return (
    <React.Fragment>
      {orderBookData.buyOrders == 0 && <Spinner />}

      <table className="table das-oreder-table table-hover">
        <thead>
          <tr>
            <th className="text-center" scope="col">
              Price(BTC)
            </th>
            <th className="text-center" scope="col">
              AMT(ETH)
            </th>
            <th className="text-right" scope="col">
              Total(BTC)
            </th>
          </tr>
        </thead>
        <tbody>
          {orderBookData.sellOrders.map(value => (
            <tr key={value.id}>
              <td>
                <span className="color-sell">{value.rate}</span>
              </td>
              <td className="text-right">
                <span>{value.tradable_quantity}</span>
              </td>
              <td className="text-right">
                <span>total_BTC</span>
                <div className="rate-ratio"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default SellOrderBookTable;
