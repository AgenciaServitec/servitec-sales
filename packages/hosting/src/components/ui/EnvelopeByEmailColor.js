import React from "react";
import styled from "styled-components";

export const EnvelopeByEmailColor = ({ title, content }) => {
  return (
    <Container>
      <label className="label">{title}:</label>
      <p className="value">{content}</p>
    </Container>
  );
};

export const Container = styled.div`
  display: flex;
  gap: 0.4em;
  .label {
    color: #444;
    font-size: 0.87em;
  }
  .value {
    gap: 0.3em;
    margin-right: 8px;
    margin-bottom: 0;
    color: #000;
    font-size: 1em;
  }
`;
