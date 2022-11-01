import React from "react";
import { Form, Radio } from "antd";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { includes, orderBy } from "lodash";

export const FiltersContact = ({
  onSetStatus,
  onSetClientId,
  status,
  clientId,
  clients,
  authUser,
}) => {
  const handleStatusChange = (e) => onSetStatus(e.target.value);

  const handleClientCodeChange = (e) => onSetClientId(e.target.value);

  const viewClients = orderBy(
    clients.filter((client) => includes(authUser?.clientsIds, client.id)),
    ["name"],
    ["asc"]
  );

  return (
    <Row gutter={[16, 0]}>
      <Col>
        <Form.Item label="Código cliente">
          <Radio.Group value={clientId} onChange={handleClientCodeChange}>
            <Radio.Button value="all">Todos</Radio.Button>
            {viewClients.map((client, index) => (
              <Radio.Button key={index} value={client.id}>
                {client.name}
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
