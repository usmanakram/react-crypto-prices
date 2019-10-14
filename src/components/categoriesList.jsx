import React from "react";

const categoriesList = ({ categories }) => {
  return (
    <React.Fragment>
      <div className="catagori-content-block">
        <nav className="catagori-list">
          <ul className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
            {categories.map((categorie, key) => (
              <li key={categorie.categorie} className="nav-item">
                <a
                  className={`nav-link ${key === 0 ? "active" : ""}`}
                  href="#nav_wallet"
                  role="tab"
                  data-toggle="tab"
                >
                  <h4>{categorie.categorie}</h4>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="tab-content catagoritab-content" id="nav-tabContent">
          <div
            role="tabpanel"
            className="tab-pane fade show active"
            id="nav_wallet"
          >
            <div className="catagori-content">
              <img
                src="./images/others/6.png"
                alt="img"
                className="img-responsive"
              />
              <p className="catagori-info">
                Advanced users searching for a Bitcoin mobile digital wallet,
                should look no further than mycelium. The Mycelium mobile wallet
                allows iPhone and Android users to send and receive bitcoins and
                keep complete control over bitcoins. No third party can freeze
                or lose your funds! With enterprise-level security superior to
                most other apps and features like cold storage and encrypted PDF
                backups, an integrated QR-code scanner receive bitcoins and
                keep.
              </p>
              <div className="pros-cons-block">
                <div className="pros-block">
                  <h5 className="cp_level">Pros: </h5>
                  <p>
                    Good privacy, advanced security, feature-rich, open source
                    Software, free
                  </p>
                </div>
                <div className="cons-block">
                  <h5 className="cp_level">Cons: </h5>
                  <p>
                    No web or desktop interface, hot wallet, not for beginners
                  </p>
                </div>
              </div>
            </div>
            {/* <!-- catagori-content --> */}
          </div>
          <div role="tabpanel" className="tab-pane fade" id="nav_mycelium">
            <div className="catagori-content">
              <img
                src="./images/others/6.png"
                alt="img"
                className="img-responsive"
              />
              <p className="catagori-info">
                Advanced users searching for a Bitcoin mobile digital wallet,
                should look no further than mycelium. The Mycelium mobile wallet
                allows iPhone and Android users to send and receive bitcoins and
                keep complete control over bitcoins. No third party can freeze
                or lose your funds! With enterprise-level security superior to
                most other apps and features like cold storage and encrypted PDF
                backups, an integrated QR-code scanner receive bitcoins and
                keep.
              </p>
              <div className="pros-cons-block">
                <div className="pros-block">
                  <h5 className="base-color">Pros: </h5>
                  <p>
                    Good privacy, advanced security, feature-rich, open source
                    Software, free
                  </p>
                </div>
                <div className="cons-block">
                  <h5 className="base-color">Cons: </h5>
                  <p>
                    No web or desktop interface, hot wallet, not for beginners
                  </p>
                </div>
              </div>
            </div>
            {/* <!-- catagori-content --> */}
          </div>
          <div role="tabpanel" className="tab-pane fade" id="nav_exodus">
            <div className="catagori-content">
              <img
                src="./images/others/6.png"
                alt="img"
                className="img-responsive"
              />
              <p className="catagori-info">
                Advanced users searching for a Bitcoin mobile digital wallet,
                should look no further than mycelium. The Mycelium mobile wallet
                allows iPhone and Android users to send and receive bitcoins and
                keep complete control over bitcoins. No third party can freeze
                or lose your funds! With enterprise-level security superior to
                most other apps and features like cold storage and encrypted PDF
                backups, an integrated QR-code scanner receive bitcoins and
                keep.
              </p>
              <div className="pros-cons-block">
                <div className="pros-block">
                  <h5 className="base-color">Pros: </h5>
                  <p>
                    Good privacy, advanced security, feature-rich, open source
                    Software, free
                  </p>
                </div>
                <div className="cons-block">
                  <h5 className="base-color">Cons: </h5>
                  <p>
                    No web or desktop interface, hot wallet, not for beginners
                  </p>
                </div>
              </div>
            </div>
            {/* <!-- catagori-content --> */}
          </div>
          <div role="tabpanel" className="tab-pane fade" id="nav_copay">
            <div className="catagori-content">
              <img
                src="./images/others/6.png"
                alt="img"
                className="img-responsive"
              />
              <p className="catagori-info">
                Advanced users searching for a Bitcoin mobile digital wallet,
                should look no further than mycelium. The Mycelium mobile wallet
                allows iPhone and Android users to send and receive bitcoins and
                keep complete control over bitcoins. No third party can freeze
                or lose your funds! With enterprise-level security superior to
                most other apps and features like cold storage and encrypted PDF
                backups, an integrated QR-code scanner receive bitcoins and
                keep.
              </p>
              <div className="pros-cons-block">
                <div className="pros-block">
                  <h5 className="base-color">Pros: </h5>
                  <p>
                    Good privacy, advanced security, feature-rich, open source
                    Software, free
                  </p>
                </div>
                <div className="cons-block">
                  <h5 className="base-color">Cons: </h5>
                  <p>
                    No web or desktop interface, hot wallet, not for beginners
                  </p>
                </div>
              </div>
            </div>
            {/* <!-- catagori-content --> */}
          </div>
          <div role="tabpanel" className="tab-pane fade" id="nav_nano">
            <div className="catagori-content">
              <img
                src="./images/others/6.png"
                alt="img"
                className="img-responsive"
              />
              <p className="catagori-info">
                Advanced users searching for a Bitcoin mobile digital wallet,
                should look no further than mycelium. The Mycelium mobile wallet
                allows iPhone and Android users to send and receive bitcoins and
                keep complete control over bitcoins. No third party can freeze
                or lose your funds! With enterprise-level security superior to
                most other apps and features like cold storage and encrypted PDF
                backups, an integrated QR-code scanner receive bitcoins and
                keep.
              </p>
              <div className="pros-cons-block">
                <div className="pros-block">
                  <h5 className="base-color">Pros: </h5>
                  <p>
                    Good privacy, advanced security, feature-rich, open source
                    Software, free
                  </p>
                </div>
                <div className="cons-block">
                  <h5 className="base-color">Cons: </h5>
                  <p>
                    No web or desktop interface, hot wallet, not for beginners
                  </p>
                </div>
              </div>
            </div>
            {/* <!-- catagori-content --> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default categoriesList;
