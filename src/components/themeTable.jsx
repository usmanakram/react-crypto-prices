import React from "react";

const ThemeTable = ({ themeTableHeadings, themeTableValue }) => {
  return (
    <div className="latest-tranjections-area">
      <div className="latest-tranjections-block">
        <div className="container">
          <div className="latest-tranjections-block-inner">
            <div className="panel-heading-block">
              <h5>Open Orders</h5>
            </div>
            <table className="table coin-list latest-tranjections-table">
              <thead>
                <tr>
                  {themeTableHeadings.map(themeTableHeading => (
                    <th key={themeTableHeading.themeTableHeading} scope="col">
                      {themeTableHeading.themeTableHeading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {themeTableValue.map(tableValue => (
                  <tr key={tableValue.time}>
                    <td>{tableValue.size}</td>
                    <td>{tableValue.filled}</td>
                    <td>
                      <span className={tableValue.classes1}>
                        {tableValue.price}
                      </span>
                    </td>
                    <td>{tableValue.time}</td>
                    <td>
                      <span className={tableValue.classes2}>
                        {tableValue.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <!-- order-history-block-inner --> */}
        </div>
      </div>
      {/* <!-- latest-tranjections-area --> */}
    </div>
  );
};

export default ThemeTable;
