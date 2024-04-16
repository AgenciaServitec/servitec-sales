import React from "react";
import styled from "styled-components";
import { Select } from "../../components/ui";
import { Col, Row } from "antd";
import { concat } from "lodash";

export const FilterContacts = ({
  clients,
  hostname,
  onSetHostname,
  typeContact,
  onSetTypeContact,
}) => {
  return (
    <Container>
      <Row gutter={16}>
        <Col span={24} md={5}>
          <p>Hostname:</p>
          <Select
            value={hostname}
            options={concat(
              [{ value: "all", label: "Todos" }],
              clients.map((client) => ({
                label: client.hostname,
                value: client.hostname,
              }))
            )}
            onChange={onSetHostname}
          />
        </Col>
        <Col span={24} md={5}>
          <p>Tipo de Contacto:</p>
          <Select
            value={typeContact}
            options={[
              {
                value: "all",
                label: "Todos",
              },
              {
                value: "contact",
                label: "Contacto",
              },
              {
                value: "claim",
                label: "Sugerencia/Reclamo",
              },
              {
                value: "request",
                label: "Solicitud",
              },
            ]}
            onChange={onSetTypeContact}
          />
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.section`
  margin-bottom: 2em;
  p {
    margin: 0 0 0.5em;
  }
`;
