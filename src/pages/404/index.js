import React from "react";
import { Result, Button } from "antd";
import { useHistory } from "react-router";
import styled from "styled-components";

export const Page404 = () => {
  const history = useHistory();

  return (
    <Container>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
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
