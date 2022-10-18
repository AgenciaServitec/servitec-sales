import React from "react";
import { darken, lighten } from "polished";
import { findClientColor } from "../../utils";
import { Tag } from "antd";
import styled, { css } from "styled-components";

export const TagHostname = ({ contact }) => {
  const clientColors = findClientColor(contact.clientCode);

  return (
    <a
      href={contact?.hostname ? `https://${contact.hostname}` : "#"}
      target="_blank"
      rel="noreferrer"
    >
      <ItemTag
        color={lighten(0.09, clientColors?.bg || "#c4c4c4")}
        clientColors={clientColors}
      >
        {contact.hostname || ""}
      </ItemTag>
    </a>
  );
};

const ItemTag = styled(Tag)`
  ${({ clientColors }) => css`
    color: ${clientColors?.color || "#fff"};
    border: ${`1px solid ${darken(0.07, clientColors?.bg || "#c4c4c4")}`};
  `}
`;
