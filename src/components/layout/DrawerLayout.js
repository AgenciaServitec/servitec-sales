import React from "react";
import { Drawer, Menu } from "antd";
import {
  HomeOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { version } from "../../firebase";
import Title from "antd/lib/typography/Title";
import { useAuthentication } from "../../providers";
import { Logo } from "../../images";
import Row from "antd/lib/row";
import Col from "antd/lib/col";

export const DrawerLayout = ({
  isVisibleDrawer,
  setIsVisibleDrawer,
  navigateTo,
}) => {
  const { logout } = useAuthentication();

  const items = [
    {
      label: "Home",
      key: "1",
      icon: <HomeOutlined />,
      onClick: () => {
        navigateTo("/");
        setIsVisibleDrawer(false);
      },
    },
    {
      label: "Clientes",
      key: "2",
      icon: <UserSwitchOutlined />,
      onClick: () => {
        navigateTo("/clients");
        setIsVisibleDrawer(false);
      },
    },
    {
      label: "Cerrar sesion",
      key: "3",
      icon: <LogoutOutlined />,
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
