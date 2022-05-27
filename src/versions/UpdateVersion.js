import React from "react";
import { Button } from "../components/ui";
import Title from "antd/lib/typography/Title";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import styled from "styled-components";

export const UpdateVersion = () => {
  return (
    <Container>
      <WrapperRow gutter={8}>
        <Col span={24}>
          <Wrapper>
            <Title level={2}>
              Actualice para obtener la última versión de la aplicación.
            </Title>
            <Button
              type="primary"
              size="large"
              onClick={() => document.location.reload(true)}
              style={{ margin: "auto" }}
            >
              ACTUALIZAR
            </Button>
          </Wrapper>
        </Col>
      </WrapperRow>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const WrapperRow = styled(Row)`
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
