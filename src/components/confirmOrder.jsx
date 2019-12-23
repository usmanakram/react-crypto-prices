import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class ConfirmOrder extends Component {
  state = {};

  handleStatements = () => {
    const { data, selectedPair, lastRate, direction } = this.props;

    let message = "";
    // i(data.trigger_rate > "" && data.trigger_rate < data.stop_limit_rate);
    if (data.type === 2) {
      if (direction === "buy") {
        if (data.trigger_rate > lastRate) {
          message = `if the last price rises or above ${data.trigger_rate} ${selectedPair.quote_currency_symbol}, an order to
          buy ${data.quantity} ${selectedPair.base_currency_symbol} at a price of ${data.stop_limit_rate} ${selectedPair.quote_currency_symbol}
          will be placed`;
        } else if (data.trigger_rate < lastRate) {
          message = `if the last price drop or below  ${data.trigger_rate} ${selectedPair.quote_currency_symbol}, an order to
          buy ${data.quantity} ${selectedPair.base_currency_symbol} at a price of ${data.stop_limit_rate} ${selectedPair.quote_currency_symbol}
          will be placed`;
        }
      }
      if (direction === "sell") {
        if (data.trigger_rate > lastRate) {
          message = `if the last price rises or above ${data.trigger_rate} ${selectedPair.quote_currency_symbol}, an order to
          sell ${data.quantity} ${selectedPair.base_currency_symbol} at a price of ${data.stop_limit_rate} ${selectedPair.quote_currency_symbol}
          will be placed`;
        } else if (data.trigger_rate < lastRate) {
          message = `if the last price drop or below ${data.trigger_rate} ${selectedPair.quote_currency_symbol}, an order to
          sell ${data.quantity} ${selectedPair.base_currency_symbol} at a price of ${data.stop_limit_rate} ${selectedPair.quote_currency_symbol}
          will be placed`;
        }
      }
    } else if (data.type === 3) {
      if (direction === "buy") {
        if (data.trigger_rate > lastRate) {
          message = `if the last price rises or above ${data.trigger_rate} ${selectedPair.quote_currency_symbol}, an order to
        buy ${data.quantity} ${selectedPair.base_currency_symbol} at a price of ${data.stop_limit_rate} ${selectedPair.quote_currency_symbol}
        will be placed \n OR if the last price drop to ${data.rate} ${selectedPair.quote_currency_symbol}, buy ${data.quantity} ${selectedPair.base_currency_symbol} at a price of ${data.rate} ${selectedPair.quote_currency_symbol}
        will be executed`;
        }
      }

      if (direction === "sell") {
        if (data.trigger_rate < lastRate) {
          message = `if the last price drop or below ${data.trigger_rate} ${selectedPair.quote_currency_symbol}, an order to
        sell ${data.quantity} ${selectedPair.base_currency_symbol} at a price of ${data.stop_limit_rate} ${selectedPair.quote_currency_symbol}
        will be placed \n OR if the last price rises to ${data.rate} ${selectedPair.quote_currency_symbol}, an order to
        sell ${data.quantity} ${selectedPair.base_currency_symbol} at a price of ${data.rate} ${selectedPair.quote_currency_symbol}
        will be executed`;
        }
      }
    }
    return message;
  };
  render() {
    const { onAllowTrade, onHideModal, show } = this.props;

    return (
      <Modal
        show={show}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <div className="text-center">{this.handleStatements()}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success con-btn" onClick={onAllowTrade}>
            Place Order
          </Button>
          <Button variant="danger con-btn" onClick={onHideModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ConfirmOrder;
