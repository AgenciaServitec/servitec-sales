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

export const AssistancesIntegration = () => {
  const navigate = useNavigate();

  const { authUser } = useAuthentication();

  const [assistances = [], assistancesLoading, assistancesError] =
    useCollectionData(assistancesRef.where("isDeleted", "==", false));

  useEffect(() => {
    assistancesError && notification({ type: "error" });
  }, [assistancesError]);

  if (assistancesLoading) return <Spinner height="40svh" size="4x" />;

  const onNavigateGoTo = (pathname = "/") => navigate(pathname);

  return (
    <Assistances
      user={authUser}
      onNavigateGoTo={onNavigateGoTo}
      assistances={assistances}
      assistancesLoading={assistancesLoading}
    />
  );
};

const Assistances = ({
  user,
  assistances,
  assistancesLoading,
  onNavigateGoTo,
}) => {
  return (
    <Spinner spinning={assistancesLoading}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Button
            onClick={() => onNavigateGoTo("/assistances/assistance")}
            type="primary"
            className="btn-assistance"
            size="large"
          >
            <FontAwesomeIcon icon={faSignInAlt} />
            Marcar mi asistencia
          </Button>
        </Col>
        <Col span={24}>
          <Title level={2}>Lista de asistencias</Title>
        </Col>
        {/*<Col span={24}>*/}
        {/*  <AssistancesTable*/}
        {/*    user={user}*/}
        {/*    loading={assistancesLoading}*/}
        {/*  />*/}
        {/*</Col>*/}
      </Row>
    </Spinner>
  );
};
