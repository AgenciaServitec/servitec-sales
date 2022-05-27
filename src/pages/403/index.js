import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import { Button, Result } from "antd";

export const Page403 = () => {
  const history = useHistory();

  return (
    <Container>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={() => history.goBack()}>
            Go Back
          </Button>
        }
      />
    </Container>
  );
};

const Container = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
