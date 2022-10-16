import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Col, Drawer, Row, Switch } from "antd";
import styled from "styled-components";
import { Input, TextArea, Form } from "../../ui";
import { mediaQuery } from "../../../styles";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFormUtils } from "../../../hooks";

export const DrawerUserInformation = ({
  isVisibleDrawerRight,
  setIsVisibleDrawerRight,
  contact,
}) => {
  // console.log("contact", contact);

  const schema = yup.object({
    clientCode: yup.string().required(),
    hostname: yup.string().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    countryCode: yup.string().required(),
    number: yup.string().required(),
    email: yup.string().required(),
    issue: yup.string().required(),
    message: yup.string().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    resetForm();
  }, [contact]);

  const resetForm = () => {
    reset({
      clientCode: contact?.clientCode || "",
      hostname: contact?.hostname || "",
      firstName: contact?.firstName || "",
      lastName: contact?.lastName || "",
      countryCode: contact?.phone?.countryCode || "",
      number: contact?.phone?.number || "",
      email: contact?.email || "",
      issue: contact?.issue || "",
      message: contact?.message || "",
    });
  };

  const onSubmitSaveContact = (formData) => {
    console.log(formData);
  };

  return (
    <ContainerDrawer
      title="Informacion de contacto"
      width={720}
      onClose={() => setIsVisibleDrawerRight(!isVisibleDrawerRight)}
      visible={isVisibleDrawerRight}
      bodyStyle={{
        paddingBottom: 80,
      }}
    >
      <Form
        layout="vertical"
        hideRequiredMark
        onSubmit={handleSubmit(onSubmitSaveContact)}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Controller
              name="clientCode"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Cliente"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="hostname"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Dominio"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>

          <Col span={12}>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Nombres"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Apellidos"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>

          <Col span={12}>
            <Controller
              name="countryCode"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Codigo de pais"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="number"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Numero"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>

          <Col span={12}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Email"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="createAt"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Fecha de Creación"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>

          <Col span={24}>
            <Controller
              name="issue"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Asunto"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>

          <Col span={24}>
            <Controller
              name="message"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <TextArea
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          {/*<Col>*/}
          {/*  <Switch defaultChecked />*/}
          {/*</Col>*/}
        </Row>
      </Form>
    </ContainerDrawer>
  );
};

const ContainerDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    width: 100% !important;
    ${mediaQuery.minTablet} {
      width: 40% !important;
    }
  }
  .site-form-in-drawer-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
    border-top: 1px solid #e9e9e9;
  }
`;
