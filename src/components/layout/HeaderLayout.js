import React from "react";
import { Layout } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { AvatarNoFound } from "../../images";
import { mediaQuery } from "../../styles";

const { Header } = Layout;

export const HeaderLayout = ({ isVisibleDrawer, setIsVisibleDrawer, user }) => {
  return (
    <HeaderContainer className="site-layout-background header-layout">
      <div>
        <span className="trigger">
          <FontAwesomeIcon
            icon={faBars}
            size="lg"
            onClick={() => setIsVisibleDrawer(!isVisibleDrawer)}
          />
        </span>
      </div>
      <div className="user-email">
        <h3>{user.email}</h3>
      </div>
      <div className="user-avatar">
        <img src={user?.profileImage?.thumbUrl || AvatarNoFound} alt="user" />
      </div>
    </HeaderContainer>
  );
};

const HeaderContainer = styled(Header)`
  background: #fff;
  position: sticky;
  top: 1px;
  padding: 0;
  z-index: 1000;
  display: grid;
  grid-template-columns: 1fr auto auto;
  box-shadow: 0 1px 4px rgba(105, 105, 105, 0.24);
  overflow: hidden;

  .trigger {
    padding: 0 24px;
    font-size: 18px;
    line-height: 64px;
    cursor: pointer;
    transition: color 0.3s;
  }

  .trigger:hover {
    color: #1890ff;
  }

  .user-email {
    h3 {
      margin: 0;
      font-size: 1em;

      ${mediaQuery.minTablet} {
        font-size: 1.2em;
      }
    }
  }

  .user-avatar {
    padding: 0 1em;

    img {
      width: 2.2em;
      height: 2.2em;
      border-radius: 50%;
      margin: auto;
      object-fit: cover;

      ${mediaQuery.minTablet} {
        width: 3em;
        height: 3em;
      }
    }
  }
`;
