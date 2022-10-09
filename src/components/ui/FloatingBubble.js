import React from "react";
import styled from "styled-components";

export const FloatingBubble = () =>
  (
    <Container>
      <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
        <div className="social">
          <div>
            Noel moriano
          </div>
          <div>
            Hankook
          </div>
        </div>
      </a>
    </Container>
  );

const Container = styled.div`
  a {
    &:visited {
      color: black;
    }
    
    .social {
      background: yellow;
      position: absolute;
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
      background-color: #3498db;
      width: 8.5rem;
      height: 8.5rem;
      transform-origin: 50% 50%;
    }

    span {
      position: relative;
      transform: translateY(-50%);
      width: 100% ;
      height: 100%;
    }
  }
`;
