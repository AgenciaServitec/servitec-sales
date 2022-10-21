import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, TextArea } from "../../ui";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../hooks";
import Typography from "antd/lib/typography";

const { Text } = Typography;

export const SendEmailMessageModal = ({
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
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  useEffect(() => {
    reset({
      email: contact.email,
    });
  }, [isVisibleSendEmailModal]);

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
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Text>Enviar mensaje por email a:</Text>
          </Col>
          <Col span={24}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Email"
                  onChange={onChange}
                  value={value}
                  name={name}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="message"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <TextArea
                  label="Mensaje"
                  placeholder="Ingrese mensaje"
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
