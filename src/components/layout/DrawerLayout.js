import React from "react";
import { Drawer, Menu } from "antd";
import { WindowsOutlined, HomeOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { version } from "../../firebase";
import Title from "antd/lib/typography/Title";

export const DrawerLayout = ({
  isVisibleDrawer,
  setIsVisibleDrawer,
  navigateTo,
}) => {
  return (
    <DrawerContainer
      title={
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Customer contacts
          </Title>
          <h5>version: {version}</h5>
        </div>
      }
      placement="left"
      closable={true}
      onClose={() => setIsVisibleDrawer(!isVisibleDrawer)}
      visible={isVisibleDrawer}
      key="left"
      className="drawer-content"
      bodyStyle={{ padding: "0" }}
    >
      <div className="logo" />
      <Menu defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item
          key="1"
          icon={<HomeOutlined />}
          onClick={() => {
            navigateTo("/");
            setIsVisibleDrawer(false);
          }}
        >
          Home
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={<WindowsOutlined />}
          onClick={() => {
            navigateTo("/contacts");
            setIsVisibleDrawer(false);
          }}
        >
          Contáctos
        </Menu.Item>
      </Menu>
    </DrawerContainer>
  );
};

const DrawerContainer = styled(Drawer)`
  .drawer-content {
  }
`;
