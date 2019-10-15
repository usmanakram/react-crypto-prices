import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";

class Header extends Component {
  state = { user: {} };

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <nav className="navbar main-nav navbar-expand-lg">
          <div className="container">
            <Link className="navbar-brand" to="home">
              <img
                className="navbar-logo"
                src="images/logo.png"
                alt="..."
                style={{ width: 200 }}
              />
            </Link>
            <button
              className="navbar-toggler collapsed"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown">
                  <Link className="nav-link" to="exchange">
                    Exchange
                  </Link>
                </li>
                {user && (
                  <React.Fragment>
                    <li className="nav-item dropdown">
                      <Link className="nav-link" to="">
                        Fund
                      </Link>
                      <ul className="dropdown-menu">
                        <li className="nav-item">
                          <Link className="nav-link" to="balances">
                            Balances
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="deposits2">
                            Deposits
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="withdrawal">
                            Withdrawal
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="transactionHistory">
                            Transaction History
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item dropdown">
                      <Link className="nav-link" to="">
                        Order
                      </Link>
                      <ul className="dropdown-menu">
                        <li className="nav-item">
                          <Link className="nav-link" to="openOrder">
                            Open Order
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="orderHistory">
                            Order History
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="tradeHistory">
                            Trade History
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </React.Fragment>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="features.html">
                    Features
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link" to="#">
                    Support
                  </Link>
                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <Link className="nav-link" to="support.html">
                        Support Default
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="support-details.html">
                        Support Details
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link" to="#">
                    News
                  </Link>
                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <Link className="nav-link" to="latest-news.html">
                        Latest News
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="news-details.html">
                        News Details
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link" to="#">
                    More
                  </Link>
                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <Link className="nav-link" to="faq.html">
                        Faq
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="how-work.html">
                        How Work
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="contact.html">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown language-option">
                  <Link className="nav-link" to="#">
                    <i className="fas fa-globe"></i> EN
                  </Link>
                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <Link className="nav-link" to="#">
                        <i className="fab fa-buysellads"></i> US
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="#">
                        <i className="fas fa-lira-sign"></i> UK
                      </Link>
                    </li>
                  </ul>
                </li>
                {user && (
                  <li className="nav-item button">
                    <Link className="btn nav-link" to="/logout">
                      Logout
                    </Link>
                  </li>
                )}
                {!user && (
                  <React.Fragment>
                    <li className="nav-item button">
                      <Link className="btn nav-link" to="login">
                        Login
                      </Link>
                    </li>

                    <li className="nav-item button active">
                      <Link className="btn nav-link" to="signup.html">
                        Sign Up
                      </Link>
                    </li>
                  </React.Fragment>
                )}
              </ul>
            </div>
          </div>
          {/* <!-- Modal --> */}
        </nav>
      </React.Fragment>
    );
  }
}

export default Header;
