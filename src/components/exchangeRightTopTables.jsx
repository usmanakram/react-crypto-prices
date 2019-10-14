import React from "react";
import { exchangeRightTopValues } from "../services/fakeExchange";

const exchangeRightTopTables = ({ table }) => {
  let classes = "tab-pane fade das-market-tab-pane ";
  if (table.key == 0) classes += "in  show active";

  return (
    <div role="tabpanel" className={classes} id={table._id}>
      <table className="table coin-list table-hover das-market-table">
        <thead>
          <tr>
            <th></th>
            <th scope="col">Pair</th>
            <th scope="col">Price</th>
            <th scope="col">Change</th>
          </tr>
        </thead>
        <tbody>
          {exchangeRightTopValues.map(value => (
            <tr key={value.price}>
              <td>
                <div className="favorite-coin"></div>
              </td>
              <td>{value.pair}</td>
              <td>
                <span className={value.color1}>{value.price}</span>
              </td>
              <td>
                <span className={value.color2}>{value.change}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default exchangeRightTopTables;
