import React from "react";
import styled from "styled-components";
import { Select } from "../../components/ui";
import { Col, Row } from "antd";

export const FilterContact = ({ clients }) => {
  console.log(clients);
  const viewClients = clients.map((client) => {
    return {
      value: client.hostname,
      label: client.hostname,
    };
  });

  console.log(viewClients);

  return (
    <Container>
      <Row gutter={16}>
        <Col span={5}>
          <p>Hostname:</p>
          <Select options={viewClients} />
        </Col>
        <Col span={5}>
          <p>Tipo de Contacto:</p>
          <Select
            options={[
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
