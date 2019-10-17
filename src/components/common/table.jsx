import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

const Table = ({ columns, sortColumn, onSort, data, classes }) => {
  return (
    <React.Fragment>
      <table className={`table ${classes}`}>
        <TableHeader
          columns={columns}
          sortColumn={sortColumn}
          onSort={onSort}
        />
        <TableBody columns={columns} data={data} />
      </table>
      {data.length === 0 && <h4 className="text-center">No Record Fount</h4>}
    </React.Fragment>
  );
};

export default Table;
