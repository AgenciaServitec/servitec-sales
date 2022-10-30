import React from "react";
import { darken, lighten } from "polished";
import { Tag } from "antd";
import styled, { css } from "styled-components";

export const TagHostname = ({ color, hostname }) => {
  if (!color || !hostname) return null;

  return (
    <a
      href={hostname ? `https://${hostname}` : "#"}
      target="_blank"
      rel="noreferrer"
    >
      <ItemTag color={lighten(0.09, color || "#c4c4c4")} bg={color}>
        {hostname || ""}
      </ItemTag>
    </a>
  );
};

const ItemTag = styled(Tag)`
  ${({ bg }) => css`
    color: ${darken(0.4, bg) || "#444"};
    border: ${`1px solid ${darken(0.07, bg || "#c4c4c4")}`};
  `}
`;
