import React from "react";
import styled, { css } from "styled-components";
import { Tag } from "antd";
import { capitalize } from "lodash";

export const FloatingBubble = ({
  onSetIsVisibleDrawerRight,
  bgColor,
  contact,
}) => (
  <Container bgColor={bgColor} onClick={() => onSetIsVisibleDrawerRight(true)}>
    <div>{capitalize(contact.firstName)}</div>
    <div>{capitalize(contact.lastName)}</div>
    {contact?.hostname && (
      <div>
        <Tag color="blue">{contact.hostname}</Tag>
      </div>
    )}
  </Container>
);

const Container = styled.div`
  ${({ bgColor, theme }) => css`
    width: 7.6em;
    height: 7.6em;
    border-radius: 50%;
    background: ${bgColor};
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    animation-name: social;
    animation-duration: 1000ms;
    animation-timing-function: ease-in-out;
    animation-delay: 0s;
    animation-iteration-count: infinite;
    animation-direction: alternate;

    div {
      color: ${theme.colors.black};
    }

    @keyframes social {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(0, 10px);
      }
    }
  `}
`;
