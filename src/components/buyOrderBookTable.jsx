import React from "react";
import { setDecimalsLength } from "../utils/setDecimalsLength";

const BuyOrderBookTable = ({ selectedPairStats, buyOrders }) => {
  const decimalLength = setDecimalsLength(selectedPairStats.last_rate);
  const quantityDecimals =
    decimalLength === undefined ? 8 : decimalLength.quantityDecimals;
  const rateDecimals =
    decimalLength === undefined ? 8 : decimalLength.rateDecimals;

  return (
    <React.Fragment>
      <table className="table table-fixed das-oreder-table das-buy-table exchange-orderBook">
        <thead>
          <tr>
            <th scope="col" className="col-4 th">
              <span className="color-buy">
                {Object.keys(selectedPairStats).length > 0 &&
                  selectedPairStats.last_rate}
              </span>
            </th>
            <th scope="col" className="col-4"></th>
            <th scope="col" className="col-4"></th>
          </tr>
        </thead>
        <tbody>
          {buyOrders.map(value => (
            <tr key={value.id}>
              <td className="col-4">
                <span className="color-buy">
                  {value.rate.toFixed(rateDecimals)}
                </span>
              </td>
              <td className="col-4">
                <span>{value.tradable_quantity.toFixed(quantityDecimals)}</span>
              </td>
              <td className="col-4">
                <span>
                  {(value.rate * value.tradable_quantity).toFixed(rateDecimals)}
                </span>
                <div className="rate-ratio"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="container">
          {buyOrders.map(value => (
            <div className="row orderBookRow" key={value.id}>
              <div className="rate-ratio" style={{}}></div>
              <div className="col-md-4">
                <span className="color-buy">{value.rate}</span>
              </div>
              <div className=" col-md-4">
                <span>{value.tradable_quantity}</span>
              </div>
              <div className="col-md-4 text-right">
                <span>{(value.rate * value.tradable_quantity).toFixed(8)}</span>
              </div>
  
            </div>
          ))}
        </div> */}
    </React.Fragment>
  );
};

export default BuyOrderBookTable;
