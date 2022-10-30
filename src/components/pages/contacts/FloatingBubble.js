import React from "react";
import styled, { css } from "styled-components";
import { capitalize } from "lodash";
import { darken, lighten } from "polished";
import { keyframes } from "../../../styles";

export const FloatingBubble = ({
  contact,
  isLastContact,
  clientColor = "#c4c4c4",
  onOpenDrawerContact,
  onSetContact,
}) => (
  <Container
    isLastContact={isLastContact}
    clientColor={clientColor}
    onClick={() => {
      onSetContact(contact);
      onOpenDrawerContact();
    }}
  >
    <span className="item-full-name">{`${capitalize(
      contact.firstName
    )} ${capitalize(contact.lastName)}`}</span>
    {contact?.hostname && <span className="item-tag">{contact.hostname}</span>}
  </Container>
);

const Container = styled.div`
  ${({ clientColor, isLastContact }) => css`
    width: 90%;
    height: 90%;
    border-radius: 50%;
    border: 2px solid ${darken(0.08, clientColor)};
    background: ${({ clientColor }) => clientColor};
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all ease-in-out 700ms;
    ${isLastContact &&
    css`
      animation: ${keyframes.pulseBoxShadow} 2s infinite;
    `}

    &:hover {
      width: 100%;
      height: 100%;
      transition: all ease-in-out 400ms;
    }

    span {
      margin-bottom: 0.5em;
    }

    .item-full-name {
      text-shadow: -1px -1px 1px #fff, 1px -1px 1px #fff, -1px 1px 1px #fff,
        1px 1px 1px #fff;
      color: #000;
      font-weight: bold;
      font-size: 1em;
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
      background: ${darken(0.09, clientColor)};
      border: 2px solid ${darken(0.08, clientColor)};
      color: ${lighten(0.2, clientColor) || "#fff"};
    }
  `}
`;
