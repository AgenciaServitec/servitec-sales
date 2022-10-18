import React from "react";
import { Form, Radio } from "antd";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { clientData } from "../../../data-list";
import { useQueryString } from "../../../hooks/useQueryString";

export const FiltersContact = () => {
  const [status, setStatus] = useQueryString("status", "pending");
  const [hostname, setHostname] = useQueryString("hostname", "all");

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleHostnameChange = (e) => {
    setHostname(e.target.value);
  };

  return (
    <Row gutter={[16, 0]}>
      <Col>
        <Form.Item label="Hostname">
          <Radio.Group value={hostname} onChange={handleHostnameChange}>
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
