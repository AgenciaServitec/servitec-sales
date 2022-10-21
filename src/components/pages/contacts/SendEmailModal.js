import React from "react";
import { Modal } from "../../ui";
import Row from "antd/lib/row";
import Col from "antd/lib/col";

export const SendEmailModal = ({
  contact,
  isVisibleSendEmailModal,
  onCLickIsVisibleSendEmailModal,
}) => {
  return (
    <Modal
      open={isVisibleSendEmailModal}
      closable={onCLickIsVisibleSendEmailModal}
      onCancel={onCLickIsVisibleSendEmailModal}
    >
      <Row>
        <Col>Modal send email</Col>
      </Row>
    </Modal>
  );
};
