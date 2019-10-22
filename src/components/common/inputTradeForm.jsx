import React from "react";

const InpuTradeForm = ({ name, label, symbol, ...rest }) => {
  return (
    <div className="form-group row">
      <label htmlFor={name} className="col-3 col-form-label">
        {label}
      </label>
      <div className="col-9 form-input-block">
        <input name={name} id={name} {...rest} className="form-control" />
        <span className="tv-btc-tag">{symbol}</span>
      </div>
    </div>
  );
};

export default InpuTradeForm;
