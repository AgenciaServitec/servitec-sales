import React from "react";
import styled, { css } from "styled-components";

export const InformationWrapper = ({ emailType, children, className }) => (
  <Container emailType={emailType} className={className}>
    {children}
  </Container>
);

const Container = styled.div`
  ${({ emailType }) => css`
    border-radius: 0.5em;
    padding: 0.7em;
    background-color: ${emailType?.secondary_color || ""};
    border: 1px solid ${emailType?.primary_color || ""};
  `}
`;
