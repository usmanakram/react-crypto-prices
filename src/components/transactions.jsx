import React, { Component } from "react";
import { Link } from "react-router-dom";
import http from "../services/httpService";

class Transactions extends Component {
  state = {
    transactions: []
  };

  async componentDidMount() {
    try {
      const { data } = await http.get("auth/get-transactions-history");
      console.log(data);

      this.setState({ transactions: data });
    } catch (ex) {
      console.log(ex);
    }
  }

  render() {
    const { transactions } = this.state;

    return (
      <div className="row">
        <div className="col-md-12">
          <h4>Histroy</h4>
          <Link
            className="btn btn-primary"
            style={{ marginBottom: 10, borderRadius: 0 }}
            to="/pathLink#yourAnchorTag"
          >
            Deposits
          </Link>
          <Link
            className="btn btn-primary"
            style={{ marginBottom: 10, borderRadius: 0 }}
            to="/pathLink#yourAnchorTag"
          >
            Withdrawal
          </Link>
          {transactions.length > 0 && (
            <table className="table table-bordered">
              <thead className="theadColor">
                <tr>
                  <th>Status</th>
                  <th>Coin</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Information</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="tbodyColor">
                {transactions.map(t => (
                  <tr key={t.id}>
                    <td>{t.status_text}</td>
                    <td>{t.currency.symbol}</td>
                    <td>{t.amount}</td>
                    <td>{t.created_at}</td>
                    <td>
                      <strong>Address:</strong> {t.address}
                      <br />
                      <strong>Txid:</strong> {t.txn_id}
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {transactions.length === 0 && (
            <div
              className="row border"
              style={{ backgroundColor: "#ffffff", margin: 0 }}
            >
              <div className="center mt-20 mb-20 ">
                <i className="fa fa-search fa-3x" aria-hidden="true"></i>

                <p>You have no deposit history.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Transactions;
