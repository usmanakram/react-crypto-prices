import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ user }) => {
  return (
    <nav className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#navbar"
            aria-expanded="false"
            aria-controls="navbar"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <Link className="navbar-brand" to="/">
            Crypto Prices
          </Link>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          {/* <ul className="nav navbar-nav">
              <li className="active">
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li className="dropdown">
                <a
                  href="#"
                  className="dropdown-toggle"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Dropdown <span className="caret" />
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="#">Action</a>
                  </li>
                  <li>
                    <a href="#">Another action</a>
                  </li>
                  <li>
                    <a href="#">Something else here</a>
                  </li>
                  <li role="separator" className="divider" />
                  <li className="dropdown-header">Nav header</li>
                  <li>
                    <a href="#">Separated link</a>
                  </li>
                  <li>
                    <a href="#">One more separated link</a>
                  </li>
                </ul>
              </li>
            </ul> */}
          <ul className="nav navbar-nav navbar-right">
            {user && (
              <React.Fragment>
                <li className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Funds <span className="caret" />
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/balances">Balances</Link>
                    </li>
                    <li>
                      <Link to="/deposits">Deposits</Link>
                    </li>
                    {/* <li>
                      <Link to="#">Withdrawals</Link>
                    </li> */}
                    <li role="separator" className="divider" />
                    <li className="dropdown-header">Nav header</li>
                    <li>
                      <Link to="/transactions">Transaction History</Link>
                    </li>
                    {/* <li>
                      <Link to="#">One more separated link</Link>
                    </li> */}
                  </ul>
                </li>
                <li>
                  <Link to="/logout">Logout</Link>
                </li>
              </React.Fragment>
            )}
            {!user && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
