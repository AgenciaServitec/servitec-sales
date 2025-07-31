import React from "react";
import { useAuthentication } from "../../providers";
import { useQueryString } from "../../hooks/useQueryString";
import { Title, Row, Col, Tabs } from "../../components";
import { ProfileDataForm } from "./profileDataForm";
import { ProfileInformation } from "./ProfileInformation";
import { FaceRegistration } from "./ProfileFacialBiometrics";

const items = [
  {
    key: "1",
    label: "Editar perfil",
    children: <ProfileDataForm />,
  },
  {
    key: "2",
    label: "Datos Biométricos",
    children: <FaceRegistration />,
  },
];

export const Profile = () => {
  const { authUser } = useAuthentication();

  const [dataEdit, setDataEdit] = useQueryString("dataEdit", "1");

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={3}>Perfil</Title>
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]}>
          <Col span={24} md={12}>
            <Title level={4}>Datos del usuario</Title>
            <br />
            <ProfileInformation user={authUser} />
          </Col>
          <Col span={24} md={12}>
            <Title level={4}>Editar Datos</Title>
            <Tabs items={items} defaultActiveKey={dataEdit} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
