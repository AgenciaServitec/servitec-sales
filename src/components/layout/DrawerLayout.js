import React from "react";
import { Drawer, Menu } from "antd";
import styled from "styled-components";
import { version } from "../../firebase";
import Title from "antd/lib/typography/Title";
import { useAuthentication } from "../../providers";
import { Logo } from "../../images";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import {
  faHome,
  faLayerGroup,
  faSignOutAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const DrawerLayout = ({
  isVisibleDrawer,
  setIsVisibleDrawer,
  navigateTo,
}) => {
  const { logout } = useAuthentication();

  const items = [
    {
      label: "Home",
      key: "home",
      icon: <FontAwesomeIcon icon={faHome} size="lg" />,
      onClick: () => {
        navigateTo("/");
        setIsVisibleDrawer(false);
      },
    },
    {
      label: "Clientes",
      key: "clients",
      icon: <FontAwesomeIcon icon={faLayerGroup} size="lg" />,
      onClick: () => {
        navigateTo("/clients");
        setIsVisibleDrawer(false);
      },
    },
    {
      label: "Usuarios",
      key: "users",
      icon: <FontAwesomeIcon icon={faUsers} size="lg" />,
      onClick: () => {
        navigateTo("/users");
        setIsVisibleDrawer(false);
      },
    },
    {
      label: "Cerrar sesion",
      key: "logout",
      icon: <FontAwesomeIcon icon={faSignOutAlt} size="lg" />,
      onClick: async () => {
        await logout();
        setIsVisibleDrawer(false);
      },
    },
  ];

  return (
    <DrawerContainer
      title={
        <Row>
          <Col span={6}>
            <img src={Logo} width={50} alt="Sending emails logo" />
          </Col>
          <Col span={18}>
            <Title level={3} style={{ margin: 0 }}>
              Sending emails
            </Title>
            <h5>version: {version}</h5>
          </Col>
        </Row>
      }
      placement="left"
      closable={true}
      onClose={() => setIsVisibleDrawer(!isVisibleDrawer)}
      open={isVisibleDrawer}
      key="left"
      className="drawer-content"
      bodyStyle={{ padding: "0" }}
    >
      <div className="logo" />
      <Menu defaultSelectedKeys={["1"]} mode="inline" items={items} />
    </DrawerContainer>
  );
};

const DrawerContainer = styled(Drawer)`
  .drawer-content {
  }
`;
