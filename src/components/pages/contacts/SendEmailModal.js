import React, { useState } from "react";
import { Button, Form, Input, Modal, TextArea } from "../../ui";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../hooks";
import Typography from "antd/lib/typography";

const { Title, Text } = Typography;

export const SendEmailModal = ({
  contact,
  isVisibleSendEmailModal,
  onCLickIsVisibleSendEmailModal,
}) => {
  const [sendingEmailMessage, setSendingEmailMessage] = useState(false);

  const schema = yup.object({
    message: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const onSubmitSendEmail = (formData) => {
    console.log("formData->", formData);
  };

  return (
    <Modal
      open={isVisibleSendEmailModal}
      closable={onCLickIsVisibleSendEmailModal}
      onCancel={onCLickIsVisibleSendEmailModal}
    >
      <Form layout="vertical" onSubmit={handleSubmit(onSubmitSendEmail)}>
        <Row gutter={[0, 10]}>
          <Col span={24}>
            <Text>Enviar mensaje por email a:</Text>
            <Title level={5} style={{ marginTop: "0", marginBottom: "1em" }}>
              {contact.email}
            </Title>
          </Col>
          <Col span={24}>
            <Controller
              name="message"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <TextArea
                  label="Mensaje"
                  onChange={onChange}
                  value={value}
                  name={name}
                  rows={6}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Button
              block
              htmlType="submit"
              type="primary"
              size="large"
              disabled={sendingEmailMessage}
            >
              Enviar
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
