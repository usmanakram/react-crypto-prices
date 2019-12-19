import React from "react";

const BuyOrderBookTable = ({ selectedPairStats, orderBookData }) => {
  return (
    <React.Fragment>
      <table className="table das-oreder-table das-buy-table table-hover exchange-orderBook">
        <thead>
          <tr>
            <th
              className="th"
              scope="col"
              //  style={{ width: "33.33%" }}
            >
              <span className="color-buy">
                {Object.keys(selectedPairStats).length > 0 &&
                  selectedPairStats.last_price}
              </span>
              {/* <img src="./images/exchange/4.png" alt="img" /> */}
            </th>
            <th
              className=""
              scope="col"
              // currency-rate
              // style={{ width: "33.33%" }}
            ></th>
            <th
              className="text-right"
              scope="col"
              //  style={{ width: "33.33%" }}
            >
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
              <td className="">
                <span>{value.tradable_quantity.toFixed(8)}</span>
              </td>
              <td className="text-right">
                <span>{(value.rate * value.tradable_quantity).toFixed(8)}</span>
                <div className="rate-ratio"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="container">
        {orderBookData.buyOrders.map(value => (
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
