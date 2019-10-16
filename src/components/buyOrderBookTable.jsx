import React from "react";

const BuyOrderBookTable = ({ orderBookData }) => {
  return (
    <table className="table das-oreder-table das-buy-table table-hover">
      <thead>
        <tr>
          <th className="text-left" scope="col" style={{ width: "33.33%" }}>
            <span className="color-buy">0.059132</span>
            <img src="./images/exchange/4.png" alt="img" />
          </th>
          <th
            className="text-center"
            scope="col"
            style={{ width: "33.33%" }}
          ></th>
          <th className="text-right" scope="col" style={{ width: "33.33%" }}>
            {/* <img src="./images/exchange/2.png" alt="img" /> */}
          </th>
        </tr>
      </thead>
      <tbody>
        {orderBookData.buyOrders.map(value => (
          <tr key={value.id}>
            <td>
              <span className="color-buy">{value.rate}</span>
            </td>
            <td className="text-right">
              <span>{value.tradable_quantity}</span>
            </td>
            <td className="text-right">
              <span>value.total_BTC</span>
              <div className="rate-ratio"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BuyOrderBookTable;
