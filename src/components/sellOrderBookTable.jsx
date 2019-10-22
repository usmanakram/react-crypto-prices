import React from "react";

const SellOrderBookTable = ({ selectedPair, orderBookData }) => {
  return (
    <React.Fragment>
      <table className="table das-oreder-table table-hover">
        <thead>
          <tr>
            <th className="text-center" scope="col">
              Price({selectedPair.quote_currency_symbol})
            </th>
            <th className="text-center" scope="col">
              Qty({selectedPair.base_currency_symbol})
            </th>
            <th className="text-right" scope="col">
              Total({selectedPair.quote_currency_symbol})
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
                <span>{(value.rate * value.tradable_quantity).toFixed(8)}</span>
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
