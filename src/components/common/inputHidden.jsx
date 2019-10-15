import React from "react";

const InputHidden = ({ name, ...rest }) => {
  return <input name={name} id={name} type="hidden" {...rest} />;
};

export default InputHidden;
