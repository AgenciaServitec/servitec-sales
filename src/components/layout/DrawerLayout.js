import React from "react";
import { Drawer, Menu } from "antd";
import {
  WindowsOutlined,
  HomeOutlined,
  UserSwitchOutlined,
  RedEnvelopeTwoTone,
} from "@ant-design/icons";
import styled from "styled-components";
import { version } from "../../firebase";
import Title from "antd/lib/typography/Title";

export const DrawerLayout = ({
  isVisibleDrawer,
  setIsVisibleDrawer,
  navigateTo,
}) => {
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
      label: "Contáctos",
      key: "3",
      icon: <RedEnvelopeTwoTone />,
      onClick: () => {
        navigateTo("/contacts");
        setIsVisibleDrawer(false);
      },
    },
  ];

  return (
    <DrawerContainer
      title={
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Sending emails
          </Title>
          <h5>version: {version}</h5>
        </div>
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
