import { createGlobalStyle, css } from "styled-components";

const global = css`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    color: ${({ theme }) => theme.colors.body};
  }

  hr {
    border: none;
    height: 1px;
    background: ${({ theme }) => theme.colors.gray2};
  }

  fieldset {
    border: 1px solid ${({ theme }) => theme.colors.gray};
    border-radius: 0.5rem;
    padding: 0.7rem;

    legend {
      width: auto;
      margin: 0.6rem;
    }
  }

  .link-color {
    color: #00a1f6;
    cursor: pointer;
    display: inline-block;

    &:hover {
      color: #4994fd;
    }
  }
`;

const antd = {};

export const GlobalStyle = createGlobalStyle`
  ${global}
  ${Object.values(antd).map((antdComponent) => antdComponent)}
`;
