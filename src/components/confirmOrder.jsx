import React from "react";
import { Modal, Button } from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";

const ConfirmOrder = props => {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <ModalHeader closeButton></ModalHeader>
      <Modal.Body>Cras mattis consectetur.</Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={props.onHide}>
          Place Order
        </Button>
        <Button variant="danger" onClick={props.onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmOrder;
