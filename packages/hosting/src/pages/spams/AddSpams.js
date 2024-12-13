import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  notification,
  Row,
  Select,
  TextArea,
} from "../../components/ui";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFormUtils } from "../../hooks";
import { addNonExistingSpamsOnly } from "../../firebase/collections";
import { validateEmail } from "../../utils";
import { useAuthentication } from "../../providers";

export const AddSpamsIntegration = ({ onCloseModal }) => {
  const { authUser } = useAuthentication();
  const [saveLoading, setSaveLoading] = useState(false);

  const onSaveSpam = async (formData) => {
    try {
      setSaveLoading(true);
      const isEmail = formData.type === "email";
      const arrayValues = formData.value
        .split(",")
        .map((url) => url.trim().toLowerCase());

      const isValidatedValue = arrayValues.every((value) =>
        isEmail ? validateEmail(value) : value
      );

      if (!isValidatedValue)
        return notification({
          type: "warning",
          title: `Hay un ${
            isEmail ? "email" : "telefono"
          } o más con el formato incorrecto.`,
        });

      await addNonExistingSpamsOnly(arrayValues, formData.type, authUser);

      notification({ type: "success" });
      onCloseModal();
    } catch (e) {
      console.error("errorSaveSpam:", e);
      notification({ type: "error" });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <Spam
      onSaveSpam={onSaveSpam}
      loading={saveLoading}
      onCloseModal={onCloseModal}
    />
  );
};

const Spam = ({ onSaveSpam, loading, onCloseModal }) => {
  const schema = yup.object({
    type: yup.string().required(),
    value: yup.string().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "email",
      value: null,
    },
  });

  const { required, error } = useFormUtils({ errors, schema });

  const onSubmit = (formData) => onSaveSpam(formData);

  return (
    <Row>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                name="type"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Tipo"
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    options={[
                      {
                        label: "Email",
                        value: "email",
                      },
                      {
                        label: "Teléfono",
                        value: "phone",
                      },
                    ]}
                  />
                )}
              />
            </Col>
            <Col span={24}>
              <Controller
                name="value"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <TextArea
                    label="Puedes ingresar un solo valor o varios separandolos con comas (,)"
                    rows={5}
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
          </Row>
          <Row justify="end" gutter={[16, 16]}>
            <Col span={24} md={8}>
              <Button
                type="default"
                size="large"
                block
                onClick={() => onCloseModal(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
            </Col>
            <Col span={24} md={8}>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                disabled={loading}
                loading={loading}
              >
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};
