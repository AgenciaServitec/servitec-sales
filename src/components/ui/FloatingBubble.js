import React from "react";
import styled, { css } from "styled-components";
import { Tag } from "antd";
import { capitalize } from "lodash";
import { darken } from "polished";

export const FloatingBubble = ({
  onSetIsVisibleDrawerRight,
  bgColor,
  color,
  contact,
}) => {
  return (
    <Container
      bgColor={bgColor}
      color={color}
      onClick={() => onSetIsVisibleDrawerRight(true)}
    >
      <span className="item-full-name">{`${capitalize(
        contact.firstName
      )} ${capitalize(contact.lastName)}`}</span>
      {contact?.hostname && (
        <span className="item-tag">{contact.hostname}</span>
      )}
    </Container>
  );
};

const Container = styled.div`
  ${({ bgColor, color, theme }) => css`
    width: 90%;
    height: 90%;
    border-radius: 50%;
    border: 2px solid ${darken(0.08, bgColor)};
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

    span {
      margin-bottom: 0.5em;
    }

    .item-full-name {
      color: ${color};
      font-size: 0.9em;
      padding: 0.2em 0.4em;
      border-radius: 1em;
      width: 80%;
      text-align: center;
    }

    .item-tag {
      font-size: 0.7em;
      padding: 0.2em 0.4em;
      border-radius: 1em;
      text-align: center;
      background: ${darken(0.09, bgColor)};
      border: 2px solid ${darken(0.08, bgColor)};
      color: ${color};
    }
  `}
`;
