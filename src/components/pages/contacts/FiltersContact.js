import React from "react";
import { Form, Radio } from "antd";
import Row from "antd/lib/row";
import Col from "antd/lib/col";

export const FiltersContact = ({
  onSetStatus,
  onSetClientCode,
  status,
  clientCode,
  authUser,
}) => {
  console.log("authUser->", authUser);

  const handleStatusChange = (e) => onSetStatus(e.target.value);

  const handleClientCodeChange = (e) => onSetClientCode(e.target.value);

  const viewCLientsIds = (authUser?.clientsIds || []).sort();

  return (
    <Row gutter={[16, 0]}>
      <Col>
        <Form.Item label="Código cliente">
          <Radio.Group value={clientCode} onChange={handleClientCodeChange}>
            {/*<Radio.Button value="all">Todos</Radio.Button>*/}
            {viewCLientsIds.map((clientId, index) => (
              <Radio.Button key={index} value={clientId}>
                {clientId === "all" ? "Todos" : clientId}
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
