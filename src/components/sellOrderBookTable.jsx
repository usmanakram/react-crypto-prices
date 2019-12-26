import React from "react";

const SellOrderBookTable = ({ selectedPair, sellOrders }) => {
  return (
    <React.Fragment>
      <table className="table table-fixed das-oreder-table exchange-orderBook">
        <thead>
          <tr>
            <th scope="col" className="col-4">
              Price({selectedPair.quote_currency_symbol})
            </th>
            <th scope="col" className="col-4">
              Qty({selectedPair.base_currency_symbol})
            </th>
            <th scope="col" className="col-4">
              Total({selectedPair.quote_currency_symbol})
            </th>
          </tr>
        </thead>
        <tbody>
          {sellOrders.map(value => (
            <tr key={value.id}>
              <td className="col-4">
                <span className="color-sell">{value.rate}</span>
              </td>
              <td className="col-4">
                <span>{value.tradable_quantity.toFixed(8)}</span>
              </td>
              <td className="col-4">
                {" "}
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
