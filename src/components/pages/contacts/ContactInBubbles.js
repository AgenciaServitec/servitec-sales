import React from "react";
import BubbleUI from "react-bubble-ui";
import { FloatingBubble } from "./FloatingBubble";
import "react-bubble-ui/dist/index.css";
import { findClientColor } from "../../../utils";
import styled from "styled-components";
import { mediaQuery } from "../../../styles";

const options = {
  size: 190,
  minSize: 100,
  gutter: 8,
  provideProps: true,
  numCols: 5,
  fringeWidth: 160,
  yRadius: 400,
  xRadius: 400,
  cornerRadius: 0,
  showGuides: false,
  compact: true,
  gravitation: 10,
};

export const ContactInBubbles = ({
  contacts,
  lastContact,
  onOpenDrawerContact,
  onSetContact,
}) => (
  <WrapperButtons>
    <BubbleUI options={options} className="my-bubble-ui">
      {contacts.map((contact, index) => (
        <FloatingBubble
          key={index}
          contact={contact}
          isLastContact={lastContact.id === contact.id}
          clientColor={contact.color}
          onOpenDrawerContact={onOpenDrawerContact}
          onSetContact={onSetContact}
        />
      ))}
    </BubbleUI>
  </WrapperButtons>
);

const WrapperButtons = styled.div`
  .my-bubble-ui {
    width: 100%;
    max-width: 470px;
    height: 400px;
    margin: auto;
    border-radius: 50px;
    background: #e3e2e2;
    overflow: hidden;

    ${mediaQuery.minTablet} {
      max-width: 1000px;
    }
  }
`;
