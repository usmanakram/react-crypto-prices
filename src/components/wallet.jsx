import React from "react";

const Wallet = ({ wallets }) => {
  return (
    <div className="wallets-section">
      <div className="container">
        <div className="setion-title-two">
          <h5>Our Wallets</h5>
        </div>
        <div className="row">
          <div className="offset-lg-3 col-lg-6 offset-md-2 col-md-8">
            <div className="wallets-block">
              <img
                src="./images/others/5.png"
                alt="img"
                className="img-responsive"
              />
              <h5>Fully compatible with iOS, Android, Mac & Windows</h5>
              <h5 className="base-color">Select one & Download</h5>
              <div className="download-option-block">
                {wallets.map(wallet => (
                  <div key={wallet.deviceName} className="download-wrap">
                    <div className="download-wrap-inner">
                      <input
                        type="radio"
                        id={wallet.deviceName}
                        name="radio"
                        className="input-hidden"
                      />

                      <label
                        htmlFor={wallet.deviceName}
                        className="download-option"
                      >
                        <i className={wallet.fontAwesome}></i>
                      </label>
                    </div>
                    <h4>{wallet.deviceName}</h4>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button className="btn download-btn">Download Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // {/* <!-- wallets-section --> */}
  );
};

export default Wallet;
