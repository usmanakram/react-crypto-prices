import React from "react";
import CategoriesList from "./categoriesList";

const WalletCategories = ({ categories }) => {
  return (
    <React.Fragment>
      <div className="catagori-section">
        <div className="section-title-one">
          <h3>Categories of Wallets</h3>
          <p>
            If you are going to use a passage of Lorem Ipsum, you need to be
            sure there isn't <br /> anything embarrassing hidden in the middle
            of text.
          </p>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <CategoriesList categories={categories} />
              {/* <!-- catagori-content-block --> */}
            </div>
            <div className="col-lg-3">
              <div className="catagori-vintage">
                <img
                  src="./images/others/7.png"
                  alt="img"
                  className="img-responsive"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- catagori-section --> */}
    </React.Fragment>
  );
};

export default WalletCategories;
