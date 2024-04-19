import React from "react";
import styled, { css } from "styled-components";
import { darken } from "polished";
import { keyframes } from "../../../styles";
import { NoFound } from "../../../images";
import { emailsType } from "../../../data-list";

export const FloatingBubble = ({
  contact,
  isLastContact,
  clients,
  onOpenDrawerContact,
  onSetContact,
}) => {
  const client = clients.find((client) => client.id === contact.clientId);

  const clientColors = {
    color: client?.textColor || "#fff",
    bg: client?.bgColor || "#c4c4c4",
  };

  return (
    <Container
      isLastContact={isLastContact}
      emailsColors={emailsType[contact.type]}
      clientColors={clientColors}
      onClick={() => {
        onSetContact(contact);
        onOpenDrawerContact();
      }}
    >
      <ItemLogo bgColor={clientColors?.bg}>
        <img
          src={client?.logotipo?.thumbUrl || NoFound}
          alt="logo agencia servitec"
        />
      </ItemLogo>
      <span className="item-full-name capitalize">
        {contact?.fullName
          ? contact.fullName
          : `${contact.firstName} ${contact.lastName}`}
      </span>
      {contact?.hostname && (
        <span className="item-tag">{contact.hostname}</span>
      )}
    </Container>
  );
};

const Container = styled.div`
  ${({ emailsColors, clientColors, isLastContact }) => css`
    width: 90%;
    height: 90%;
    border-radius: 50%;
    border: 2px solid ${darken(0.07, emailsColors?.primary_color || "#c4c4c4")};
    background: ${emailsColors?.primary_color || "#c4c4c4"};
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
      color: ${emailsColors?.text_color};
      font-size: 1em;
      padding: 0.2em 0.4em;
      border-radius: 1em;
      width: 90%;
      text-align: center;
      font-weight: 500;
    }

    .item-tag {
      font-size: 0.7em;
      padding: 0.2em 0.7em;
      border-radius: 1em;
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
      color: ${clientColors?.color || "#fff"};
    }
  `}
`;

const ItemLogo = styled.div`
  max-width: 8em;
  width: auto;
  max-height: 3em;
  height: auto;
  margin-bottom: 0.3em;
  background: ${({ bgColor }) => darken(0.07, bgColor)};
  padding: 0.2em 0.4em;
  border-radius: 7em;
  overflow: hidden;
  img {
    width: 90%;
    height: 100%;
    object-fit: contain;
  }
`;
