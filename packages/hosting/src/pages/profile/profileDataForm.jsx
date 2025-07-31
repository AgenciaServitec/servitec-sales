import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useFormUtils } from "../../hooks";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Upload,
} from "../../components";
import { useAuthentication } from "../../providers";
import { useApiUserPut } from "../../api";
import { assign } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { apiErrorNotification, getApiErrorResponse } from "../../api/apiErrors";

export const ProfileDataForm = () => {
  const { authUser } = useAuthentication();
  const { putUser, putUserLoading, putUserResponse } = useApiUserPut();

  const schema = yup.object({
    profileImage: yup.mixed().notRequired(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    phoneNumber: yup.string().min(9).max(9).required(),
    dni: yup.string().min(8).max(8).required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { error, errorMessage, required } = useFormUtils({ errors, schema });

  const updateProfile = async (formData) => {
    try {
      const response = await putUser(
        assign({}, formData, {
          id: authUser.id,
          profileImage: formData?.profileImage || null,
          phone: { countryCode: "+51", number: formData.phoneNumber },
        })
      );

      if (!putUserResponse.ok) {
        throw new Error(response);
      }

      notification({ type: "success" });
    } catch (e) {
      const errorResponse = await getApiErrorResponse(e);
      apiErrorNotification(errorResponse);
    }
  };

  const resetForm = () => {
    reset({
      profileImage: authUser?.profileImage || null,
      firstName: authUser?.firstName || "",
      lastName: authUser?.lastName || "",
      email: authUser?.email || "",
      phoneNumber: authUser?.phone?.number?.toString() || "",
      dni: authUser?.dni || "",
    });
  };

  useEffect(() => {
    resetForm();
  }, [authUser]);

  const onSubmit = async (formData) => {
    await updateProfile(formData);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Controller
            control={control}
            name="profileImage"
            render={({ field: { onChange, value, onBlur, name } }) => (
              <Upload
                isImage
                label="Foto personal"
                accept="image/*"
                resize="313x370"
                buttonText="Subir foto"
                value={value}
                name={name}
                fileName={`perfil-foto-${uuidv4()}`}
                filePath={`users/${authUser.id}/profile`}
                onChange={(file) => onChange(file)}
                required={required(name)}
                error={error(name)}
              />
            )}
          />
        </Col>
        <Col span={24} md={12}>
          <Controller
            name="firstName"
            control={control}
            render={({ field: { onChange, name, value } }) => (
              <Input
                label="Nombres"
                name={name}
                onChange={onChange}
                value={value}
                error={error(name)}
                helperText={errorMessage(name)}
              />
            )}
          />
        </Col>
        <Col span={24} md={12}>
          <Controller
            name="lastName"
            control={control}
            render={({ field: { onChange, name, value } }) => (
              <Input
                label="Apellidos"
                name={name}
                onChange={onChange}
                value={value}
                error={error(name)}
                helperText={errorMessage(name)}
              />
            )}
          />
        </Col>
        <Col span={24} md={12}>
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, name, value } }) => (
              <Input
                label="Email"
                name={name}
                onChange={onChange}
                value={value}
                error={error(name)}
                helperText={errorMessage(name)}
              />
            )}
          />
        </Col>
        <Col span={24} md={12}>
          <Controller
            name="dni"
            control={control}
            render={({ field: { onChange, name, value } }) => (
              <Input
                label="DNI"
                name={name}
                onChange={onChange}
                value={value}
                error={error(name)}
                helperText={errorMessage(name)}
              />
            )}
          />
        </Col>
        <Col span={24} md={12}>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field: { onChange, name, value } }) => (
              <Input
                label="N° Celular"
                type="number"
                name={name}
                onChange={onChange}
                value={value}
                error={error(name)}
                helperText={errorMessage(name)}
              />
            )}
          />
        </Col>
      </Row>
      <Row justify="end" gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            loading={putUserLoading}
          >
            Guardar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
