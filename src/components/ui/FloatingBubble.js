import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGithub,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
export const FloatingBubble = () => {
  return (
    <Container>
      <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
        <div className="social">
          <span>
            {" "}
            <FontAwesomeIcon icon={faFacebook} />
          </span>
        </div>
      </a>
    </Container>
  );
};

const Container = styled.div`
  //background: #3498db;
  a {
    //color: currentColor;
    animation-name: social;
    animation-duration: 1000ms;
    animation-timing-function: ease-in-out;
    animation-delay: 0s;
    animation-iteration-count: infinite;
    animation-direction: alternate;

    a:visited {
      color: currentColor;
    }
    .social {
      position: absolute;

      color: white;
      width: 6rem;
      height: 6rem;
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

      color: currentColor;
      animation-name: social;
      animation-duration: 1000ms;
      animation-timing-function: ease-in-out;
      animation-delay: 0s;
      animation-iteration-count: infinite;
      animation-direction: alternate;
    }

    @keyframes social {
      0% {
        transform: translate(148px, 78px);
      }
      100% {
        transform: translate(148px, 84px);
      }
    }
    .social:hover {
      background-color: white;
      color: #3498db;
      twidth: 80px;
      theight: 80px;
      ttransform-origin: 50% 50%;
    }

    span {
      position: relative;
      transform: translateY(-50%);
      width: 100%;
      height: 100%;
    }
  }
`;
