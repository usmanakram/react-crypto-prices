import React, { Component } from "react";
import { exchangeDefaultPair } from "../config.json";
import { Link } from "react-router-dom";
import auth from "../services/authService";
import { header } from "../services/custom";
import logo from "../images/logo.png";

class Header extends Component {
  state = { user: {} };

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });

    header();
    this.getUser();
  }

  getUser = async () => {
    try {
      const user = await auth.getUser();
      console.log(user);
      this.setState({ user });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response.data);
      }
    }
  };

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <nav className="navbar main-nav navbar-expand-lg">
          <div
            className={this.props.isFullWidth ? "container-fluid" : "container"}
          >
            <Link className="navbar-brand" to="/">
              <img className="navbar-logo" src={logo} alt="..." />
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
                <li className="nav-item ">
                  <Link
                    className="nav-link"
                    to={`/exchange/${exchangeDefaultPair}`}
                  >
                    Exchange
                  </Link>
                </li>
                {user && (
                  <React.Fragment>
                    <li className="nav-item dropdown">
                      <Link
                        onClick={e => e.preventDefault()}
                        className="nav-link"
                        to=""
                      >
                        Fund
                      </Link>
                      <ul className="dropdown-menu">
                        <li className="nav-item">
                          <Link className="nav-link" to="/balances">
                            Balances
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="/deposits">
                            Deposits
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="/withdrawal">
                            Withdrawal
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="/transactionHistory">
                            Transaction History
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item dropdown">
                      <Link
                        onClick={e => e.preventDefault()}
                        className="nav-link"
                        to=""
                      >
                        Order
                      </Link>
                      <ul className="dropdown-menu">
                        <li className="nav-item">
                          <Link className="nav-link" to="/openOrder">
                            Open Order
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="/orderHistory">
                            Order History
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="/tradeHistory">
                            Trade History
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </React.Fragment>
                )}
                {/* <li className="nav-item">
                  <Link className="nav-link" to="features">
                    Features
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link" to="#">
                    Support
                  </Link>
                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <Link className="nav-link" to="support">
                        Support Default
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="support-details">
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
                      <Link className="nav-link" to="latest-news">
                        Latest News
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="news-details">
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
                      <Link className="nav-link" to="faq">
                        Faq
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="how-work">
                        How Work
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="contact">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </li> */}
                {user && (
                  <li className="nav-item dropdown">
                    <Link
                      onClick={e => e.preventDefault()}
                      className="nav-link"
                      to=""
                    >
                      {user.username}
                    </Link>
                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <Link className="nav-link" to="/logout">
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                {!user && (
                  <React.Fragment>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">
                        Login
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/signup">
                        Sign Up
                      </Link>
                    </li>
                    {/* <li className="nav-item dropdown language-option">
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
                  </li> */}
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
