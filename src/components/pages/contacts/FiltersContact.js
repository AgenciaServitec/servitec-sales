import React from "react";
import { Form, Radio } from "antd";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { clientData } from "../../../data-list";

export const FiltersContact = ({
  onSetStatus,
  onSetClientCode,
  status,
  clientCode,
}) => {
  const handleStatusChange = (e) => onSetStatus(e.target.value);

  const handleClientCodeChange = (e) => onSetClientCode(e.target.value);

  return (
    <Row gutter={[16, 0]}>
      <Col>
        <Form.Item label="Código cliente">
          <Radio.Group value={clientCode} onChange={handleClientCodeChange}>
            <Radio.Button value="all">Todos</Radio.Button>
            {clientData.map((client, index) => (
              <Radio.Button key={index} value={client.code}>
                {client.code}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
      </Col>
      <Col>
        <Form.Item label="Estado">
          <Radio.Group value={status} onChange={handleStatusChange}>
            <Radio.Button value="pending">Pendientes</Radio.Button>
            <Radio.Button value="attended">Atendidos</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Col>
    </Row>
  );
};
