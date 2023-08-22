import React from "react";
import { Radio } from "antd";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { capitalize } from "lodash";

export const FiltersContact = ({
  onSetStatus,
  onSetClientId,
  status,
  clientId,
  clients,
}) => {
  const handleStatusChange = (e) => onSetStatus(e.target.value);

  const handleClientCodeChange = (e) => onSetClientId(e.target.value);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={18} md={20}>
        <div>
          <label>Cliente:</label>
        </div>
        <div>
          <Radio.Group value={clientId} onChange={handleClientCodeChange}>
            <Radio.Button value="all">Todos</Radio.Button>
            {clients.map((client, index) => (
              <Radio.Button key={index} value={client.id}>
                {capitalize(client.name)}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      </Col>
      <Col xs={24} sm={6} md={4}>
        <div>
          <label>Estado:</label>
        </div>
        <div>
          <Radio.Group value={status} onChange={handleStatusChange}>
            <Radio.Button value="pending">Pendientes</Radio.Button>
            <Radio.Button value="attended">Atendidos</Radio.Button>
          </Radio.Group>
        </div>
      </Col>
    </Row>
  );
};
