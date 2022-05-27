import React from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout } from "antd";

const { Header } = Layout;

export const HeaderLayout = ({ isVisibleDrawer, setIsVisibleDrawer }) => {
  return (
    <Header className="site-layout-background header-layout">
      <span className="trigger">
        {isVisibleDrawer ? (
          <MenuUnfoldOutlined
            onClick={() => setIsVisibleDrawer(!isVisibleDrawer)}
          />
        ) : (
          <MenuFoldOutlined
            onClick={() => setIsVisibleDrawer(!isVisibleDrawer)}
          />
        )}
      </span>
    </Header>
  );
};
