import React from "react";
import styled, { css } from "styled-components";
import { Tag } from "antd";
import { capitalize } from "lodash";

export const FloatingBubble = ({
  onSetIsVisibleDrawerRight,
  bgColor,
  contact,
}) => {
  return (
    <Container
      bgColor={bgColor}
      onClick={() => onSetIsVisibleDrawerRight(true)}
    >
      <div>{capitalize(contact.firstName)}</div>
      <div>{capitalize(contact.lastName)}</div>
      {contact?.hostname && (
        <div>
          <Tag color="blue">{contact.hostname}</Tag>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  ${({ bgColor, theme }) => css`
    width: 90%;
    height: 90%;
    border-radius: 50%;
    background: ${bgColor};
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all ease-in-out 700ms;

    &:hover {
      width: 100%;
      height: 100%;
      transition: all ease-in-out 400ms;
    }

    div {
      color: ${theme.colors.black};
    }
  `}
`;
