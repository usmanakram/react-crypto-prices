import React from "react";

const Banner = () => {
  return (
    <div className="container">
      <div className="offset-md-2 col-md-8">
        <div className="banner-content">
          <h2>Buy and Sell Cryptocurrency</h2>
          <p>
            Many desktop publishing packages and web page editors now use Lorem
            Ipsum <br />
            as their default model text
          </p>
          <form action="#" method="get" className="subs-form">
            <div className="input-box">
              <input
                type="text"
                value=""
                readOnly
                required=""
                name="s"
                className="form-control"
                placeholder="Email"
              />
              <button type="submit">Get Start Now</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Banner;
