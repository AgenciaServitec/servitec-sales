import React from "react";
import styled, { css } from "styled-components";
import { colorsByEmailType } from "../../../data-list";

export const InformationWrapper = ({ contactType, children, className }) => (
  <Container
    contactType={contactType}
    colorByContactType={colorsByEmailType}
    className={className}
  >
    {children}
  </Container>
);

const Container = styled.div`
  ${({ contactType, colorByContactType }) => css`
    border-radius: 0.5em;
    padding: 0.7em;
    background-color: ${colorByContactType[contactType]?.bg || ""};
    border: 1px solid ${colorByContactType[contactType]?.color || ""};
  `}
`;
