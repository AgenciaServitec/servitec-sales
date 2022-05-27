import React, { useState } from "react";
import styled from "styled-components";
import Modal from "antd/lib/modal";
import DatePickerAntd from "antd/lib/date-picker";
import { Calendar } from "./calendar";
import { ComponentContainer } from "./component-container";
import { Responsive } from "../../styles";
//
// interface Props {
//   value?: Moment;
//   required?: boolean;
//   disabled?: boolean;
//   error?: FormError;
//   label?: string;
//   variant?: "outlined" | "filled";
// }
//
// interface DatePickerDesktopProps {
//   id?: string;
//   value?: Moment;
//   disabled?: boolean;
// }
//
// interface DatePickerMobileProps extends Pick<DatePickerProps, "onChange"> {
//   id?: string;
//   value?: Moment;
//   label?: string;
//   disabled?: boolean;
//   calendar?: Record<string, unknown>;
// }

export const DatePicker = ({
  value,
  required,
  disabled,
  error,
  label,
  variant = "outlined",
  ...props
}) => {
  const Container = ComponentContainer[variant];

  return (
    <Container
      value={value}
      required={required}
      disabled={disabled}
      error={error}
      label={label}
    >
      <Responsive.DesktopAndTable>
        <DatePickerDesktop value={value} disabled={disabled} {...props} />
      </Responsive.DesktopAndTable>
      <Responsive.Mobile>
        <DatePickerMobile
          value={value}
          label={label}
          disabled={disabled}
          {...props}
        />
      </Responsive.Mobile>
    </Container>
  );
};

const DatePickerDesktop = ({ id, value, ...props }) => (
  <DatePickerAntd
    bordered={false}
    id={id}
    size="large"
    value={value}
    placeholder=""
    format="DD/MM/YYYY"
    {...props}
  />
);

const DatePickerMobile = ({
  id,
  value,
  label,
  onChange,
  calendar,
  ...props
}) => {
  const [visiblePanel, setVisiblePanel] = useState(false);

  const onChangeDate = (value, dateString) => {
    setVisiblePanel(false);
    onChange && onChange(value, dateString);
  };

  return (
    <DatePickerAntd
      bordered={false}
      id={id}
      size="large"
      value={value}
      format="DD/MM/YYYY"
      placeholder=""
      open={visiblePanel}
      inputReadOnly={true}
      onClick={() => setVisiblePanel(true)}
      onChange={onChangeDate}
      panelRender={() => (
        <ModalMobileStyled
          title={label}
          visible={visiblePanel}
          footer={false}
          centered
          onCancel={() => setVisiblePanel(false)}
        >
          <Calendar defaultValue={value} {...calendar} />
        </ModalMobileStyled>
      )}
      {...props}
    />
  );
};

const ModalMobileStyled = styled(Modal)`
  max-width: 100vw;
  margin: 0;
  padding: 0;

  .ant-modal-content {
    .ant-modal-close {
    }
    .ant-modal-header {
    }
    .ant-modal-body {
      padding: 0;
    }
  }
`;
