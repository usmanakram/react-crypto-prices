import React from "react";

const BuyOrderBookTable = ({ selectedPairStats, buyOrders }) => {
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
                <span className="color-buy">{value.rate}</span>
              </td>
              <td className="col-4">
                <span>{value.tradable_quantity.toFixed(8)}</span>
              </td>
              <td className="col-4">
                <span>{(value.rate * value.tradable_quantity).toFixed(8)}</span>
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
