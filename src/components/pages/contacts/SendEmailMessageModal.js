import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  modalConfirm,
  notification,
  TextArea,
} from "../../ui";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../hooks";
import Typography from "antd/lib/typography";
import { apiUrl } from "../../../firebase";

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

  const onSendEmail = async (formData) => {
    try {
      setSendingEmailMessage(true);

      const emailMessageData = mapSendEmailMessage(formData);

      const response = await fetchSendEmailMessage(emailMessageData);

      if (!response.ok) throw new Error(response.statusText);

      notification({ type: "success", title: "Enviado exitosamente" });

      setSendingEmailMessage(false);
      onCLickIsVisibleSendEmailModal(false);
    } catch (e) {
      console.error("ErrorSendingEmailMessage:", e);
      notification({ type: "error" });
      setSendingEmailMessage(false);
    }
  };

  const mapSendEmailMessage = (formData) => ({
    ...formData,
    clientId: contact.clientId,
  });

  const fetchSendEmailMessage = async (formData) =>
    await fetch(`${apiUrl}/email/send-message`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": null,
        "content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

  const onSubmitSendEmail = (formData) =>
    modalConfirm({
      content: "¿Seguro que quieres enviar?",
      onOk: () => onSendEmail(formData),
    });

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
              loading={sendingEmailMessage}
            >
              Enviar
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
