import React from "react";
import { setDecimalsLength } from "../utils/setDecimalsLength";

const SellOrderBookTable = ({
  selectedPair,
  selectedPairStats,
  sellOrders
}) => {
  const decimalLength = setDecimalsLength(selectedPairStats.last_rate);
  const quantityDecimals =
    decimalLength === undefined ? 8 : decimalLength.quantityDecimals;
  const rateDecimals =
    decimalLength === undefined ? 8 : decimalLength.rateDecimals;

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
                <span className="color-sell">
                  {value.rate.toFixed(rateDecimals)}
                </span>
              </td>
              <td className="col-4">
                <span>{value.tradable_quantity.toFixed(quantityDecimals)}</span>
              </td>
              <td className="col-4">
                {" "}
                <span>
                  {(value.rate * value.tradable_quantity).toFixed(rateDecimals)}
                </span>
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
