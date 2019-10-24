import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <div className="footer-upper-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-4">
                <div className="footer-logo">
                  <Link to="#">
                    <img
                      src="./images/logo.png"
                      alt="img"
                      className="img-responsive"
                      style={{ width: 200 }}
                    />
                  </Link>
                </div>
              </div>
              <div className="col-lg-2 col-md-4">
                <div className="footer-info-list">
                  <h4>About Us</h4>
                  <ul>
                    <li>
                      <Link to="#">Our Team</Link>
                    </li>
                    <li>
                      <Link to="#">Our Company</Link>
                    </li>
                    <li>
                      <Link to="#">Contact Us</Link>
                    </li>
                    <li>
                      <Link to="#">Token Listing</Link>
                    </li>
                    <li>
                      <Link to="#">Join Us</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-2 col-md-4">
                <div className="footer-info-list">
                  <h4>Learn</h4>
                  <ul>
                    <li>
                      <Link to="#">Legal</Link>
                    </li>
                    <li>
                      <Link to="#">Terms of Use</Link>
                    </li>
                    <li>
                      <Link to="#">AML and CFT</Link>
                    </li>
                    <li>
                      <Link to="#">Privacy Policy</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-2 col-md-4">
                <div className="footer-info-list">
                  <h4>Help</h4>
                  <ul>
                    <li>
                      <Link to="#">Support</Link>
                    </li>
                    <li>
                      <Link to="#">API Support</Link>
                    </li>
                    <li>
                      <Link to="#">Coin/Token Listing</Link>
                    </li>
                    <li>
                      <Link to="#">Partnership</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-4">
                <div className="footer-info-list">
                  <h4>Contact Us</h4>
                  <ul className="contact-info">
                    <li>
                      Email: <span>info.excoin@gmail.com</span>
                    </li>
                    <li>
                      Phone: <span>+99 5589 54789</span>
                    </li>
                  </ul>
                  <ul className="social-style-two">
                    <li>
                      <Link to="#">
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="fab fa-twitter"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="fab fa-google-plus-g"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="fab fa-github"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="fab fa-linkedin-in"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-icon-wrap">
            <Link to="#">
              <img
                src="./images/others/31.png"
                alt="img"
                className="img-responsive"
              />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="footer-bottom-wrap">
              <div className="trade-volume-block">
                <ul>
                  <li>
                    <span>39151</span> Active Traders
                  </li>
                  <li>
                    <span>4191 BTC</span> 24h Volume
                  </li>
                </ul>
              </div>
              <div className="copyright-text">
                © 2019 <Link to="#">Excoin</Link>. All Rights Reserved
              </div>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
