import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router";
import styled from "styled-components";

export const Page404 = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Result
        status="404"
        title="404"
        subTitle="Lo sentimos, la página que visitaste no existe."
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
