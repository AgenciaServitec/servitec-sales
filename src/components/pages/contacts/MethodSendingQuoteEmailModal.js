import React, { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, TextArea } from "../../ui";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../../hooks";
import Typography from "antd/lib/typography";
import styled from "styled-components";

const { Text } = Typography;

export const MethodSendingQuoteEmailModal = ({
  contact,
  isVisibleQuotationEmailModal,
  onCLickIsVisibleQuotationEmailModal,
}) => {
  const [sendingEmailQuotation, setSendingEmailQuotation] = useState(false);

  const schema = yup.object({
    amount: yup.string().required(),
    product: yup.string().required(),
    description: yup.string().required(),
    unitPrice: yup.string().required(),
    // total: yup.string().required(),
    // subTotal: yup.string().required(),
    // totalNeto: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error } = useFormUtils({ errors, schema });

  const onSubmitSendEmailQuotation = (formData) => {
    console.log("formData->", formData);
  };

  useEffect(() => {
    reset({
      email: contact.email,
    });
  }, [isVisibleQuotationEmailModal]);

  return (
    <ModalContainer
      open={isVisibleQuotationEmailModal}
      closable={onCLickIsVisibleQuotationEmailModal}
      onCancel={onCLickIsVisibleQuotationEmailModal}
      width={970}
    >
      <Form
        layout="vertical"
        onSubmit={handleSubmit(onSubmitSendEmailQuotation)}
      >
        <Row gutter={[10, 16]}>
          <Col span={24}>
            <Text>Enviar cotización por email a:</Text>
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
          <Col span={2}>
            <Controller
              name="amount"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <InputNumber
                  label="Cant."
                  onChange={onChange}
                  value={value}
                  name={name}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={9}>
            <Controller
              name="product"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Producto"
                  onChange={onChange}
                  value={value}
                  name={name}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={10}>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <TextArea
                  label="Descripción"
                  onChange={onChange}
                  value={value}
                  name={name}
                  rows={3}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={3}>
            <Controller
              name="unitPrice"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <InputNumber
                  label="Precio uni."
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
            <Button
              block
              htmlType="submit"
              type="primary"
              size="large"
              disabled={sendingEmailQuotation}
            >
              Enviar
            </Button>
          </Col>
        </Row>
      </Form>
    </ModalContainer>
  );
};

const ModalContainer = styled(Modal)`
  width: auto;
  min-width: 30em;
`;
