import React from "react";
import AntSelect from "antd/lib/select";
import { ComponentContainer } from "./component-container";
import { defaultTo } from "lodash";

// export type SelectValue = string;
//
// type SelectFilterOption = (
//   inputValue: SelectValue,
//   optionLabel: string
// ) => boolean;

// type SelectOnChange = (value?: SelectValue) => void;

// interface Props {
//   name?: string;
//   value?: SelectValue;
//   required?: boolean;
//   error?: FormError;
//   label?: string;
//   variant?: "outlined" | "filled";
//   disabled?: boolean;
//   allowClear?: boolean;
//   children?: JSX.Element[];
//   onChange?: SelectOnChange;
//   filterOption?: SelectFilterOption;
//   mode?: "multiple" | "tags";
// }

const defaultFilterOption = (inputValue, optionLabel) =>
  defaultTo(optionLabel, "").toUpperCase().indexOf(inputValue.toUpperCase()) ===
  0;

export const Select = ({
  value,
  required,
  error,
  label,
  children,
  variant = "filled",
  disabled,
  allowClear,
  filterOption = (inputValue, optionLabel) =>
    defaultFilterOption(inputValue, optionLabel),
  animation,
  ...props
}) => {
  const Container = ComponentContainer[variant];

  return (
    <Container
      required={required}
      value={value}
      error={error}
      disabled={disabled}
      label={label}
      animation={animation}
    >
      <AntSelect
        allowClear={disabled ? false : allowClear}
        bordered={false}
        disabled={disabled}
        value={value}
        filterOption={(inputValue, option) =>
          filterOption(inputValue, option?.children)
        }
        showSearch
        size="large"
        placeholder=""
        {...props}
      >
        {children}
      </AntSelect>
    </Container>
  );
};
