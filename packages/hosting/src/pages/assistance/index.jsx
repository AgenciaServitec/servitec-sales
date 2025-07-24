import React, { useEffect } from "react";
import {
  notification,
  Spinner,
  Row,
  Col,
  Button,
  Title,
} from "../../components";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { assistancesRef } from "../../firebase/collections";
import { useNavigate } from "react-router";
import { useAuthentication } from "../../providers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { AssistancesTable } from "./Assistances.Table";
import styled from "styled-components";

export const AssistancesIntegration = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const [assistances = [], assistancesLoading, assistancesError] =
    useCollectionData(assistancesRef.where("isDeleted", "==", false));

  useEffect(() => {
    assistancesError && notification({ type: "error" });
  }, [assistancesError]);

  const onNavigateGoTo = (pathname = "/") => navigate(pathname);

  return (
    <Wrapper>
      {assistancesLoading ? (
        <Spinner height="40svh" size="4x" />
      ) : (
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Actions>
              <Button
                onClick={() => onNavigateGoTo("/assistances/assistance")}
                type="primary"
                size="middle"
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                Marcar mi asistencia
              </Button>
              <Button
                onClick={() => onNavigateGoTo("/assistances/register")}
                type="default"
                size="middle"
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                Registrar mi rostro
              </Button>
            </Actions>
          </Col>

          <Col span={24}>
            <Header>
              <Title level={2}>Lista de Asistencias</Title>
            </Header>
          </Col>

          <Col span={24}>
            <TableWrapper>
              <AssistancesTable
                assistances={assistances}
                user={authUser}
                loading={assistancesLoading}
              />
            </TableWrapper>
          </Col>
        </Row>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 32px 16px;
  font-family: "Segoe UI", Roboto, sans-serif;
  color: #1f2937;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;

  button {
    flex: 1 1 200px;
    font-size: 0.95rem;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    transition: background 0.2s, transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }
  }

  button[type="primary"] {
    background: #2563eb;
    color: #fff;
  }
  button[type="default"] {
    background: #e5e7eb;
    color: #374151;
  }
`;

const Header = styled.div`
  margin-bottom: 16px;
  > h2 {
    font-size: 1.75rem !important;
    color: #111827 !important;
  }
`;

const TableWrapper = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  overflow-x: auto;
`;
