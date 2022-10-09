import React from "react";
import styled, { css } from "styled-components";
import { Tag } from "antd";
import { capitalize } from "lodash";

export const FloatingBubble = ({
  onSetIsVisibleDrawerRight,
  bgColor,
  contact,
}) => (
  <Container bgColor={bgColor}>
    <div onClick={() => onSetIsVisibleDrawerRight(true)}>
      <div className="social">
        <div>{capitalize(contact.firstName)}</div>
        <div>{capitalize(contact.lastName)}</div>
        {contact?.hostname && (
          <div>
            <Tag color="blue">{contact.hostname}</Tag>
          </div>
        )}
      </div>
    </div>
  </Container>
);

const Container = styled.div`
  ${({ bgColor }) => css`
    cursor: pointer;
    div {
      .social {
        background: ${bgColor};
        position: relative;
        width: 7.5rem;
        height: 7.5rem;
        border: 4px solid white;
        border-radius: 50%;
        text-align: center;
        padding: 3px;
        transition: all 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        transform-origin: 50% 50%;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        color: black;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;

        animation-name: social;
        animation-duration: 1000ms;
        animation-timing-function: ease-in-out;
        animation-delay: 0s;
        animation-iteration-count: infinite;
        animation-direction: alternate;

        gap: 0.5rem;
      }

      @keyframes social {
        0% {
          transform: translate(150px, 78px);
        }
        100% {
          transform: translate(150px, 84px);
        }
      }
      .social:hover {
        background: ${bgColor};
        width: 8.5rem;
        height: 8.5rem;
        transform-origin: 50% 50%;
      }

      span {
        position: relative;
        transform: translateY(-50%);
        width: 100%;
        height: 100%;
      }
    }
  `}
`;
