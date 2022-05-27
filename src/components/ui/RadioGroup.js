import React from "react";
import styled from "styled-components";
import RadioAntd from "antd/lib/radio";
import { ComponentContainer } from "./component-container";
import Row from "antd/lib/row";

// interface Props {
//   name?: string;
//   value?: string;
//   required?: boolean;
//   error?: FormError;
//   label?: string;
//   options: { value: string; label: string }[];
//   variant?: "outlined" | "filled";
//   disabled?: boolean;
//   onChange?: () => void;
// }

export const RadioGroup = ({
  required,
  error,
  label,
  options = [],
  variant = "outlined",
  children,
  ...props
}) => {
  const Container = ComponentContainer[variant];

  return (
    <Container required={required} error={error} label={label} animation={true}>
      <Row {...props}>
        <RadioGroupStyled {...props}>
          {!children
            ? options.map((data, index) => (
                <RadioAntd key={index} value={data.value} id={data.label}>
                  {data.label}
                </RadioAntd>
              ))
            : children}
        </RadioGroupStyled>
      </Row>
    </Container>
  );
};

const RadioGroupStyled = styled(RadioAntd.Group)`
  padding: 10px;
`;
