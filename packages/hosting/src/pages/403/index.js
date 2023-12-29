import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { Button, Result } from "antd";

export const Page403 = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Result
        status="403"
        title="403"
        subTitle="Lo sentimos, no está autorizado para acceder a esta página."
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            Ir atras
          </Button>
        }
      />
    </Container>
  );
};

const Container = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
