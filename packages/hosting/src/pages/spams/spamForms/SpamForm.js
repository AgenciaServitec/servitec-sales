import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  Col,
  Form,
  notification,
  Row,
  Select,
  TextArea,
  Typography,
} from "../../../components/ui";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFormUtils } from "../../../hooks";
import { getSpamId } from "../../../firebase/collections";

export const SpamIntegration = ({ onAddSpam, onIsModalVisible }) => {
  const navigate = useNavigate();
  const [spam, setSpam] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const _spam = { id: getSpamId() };

    if (!_spam) return navigate(-1);

    setSpam(_spam);
  }, []);

  const onGoBack = () => navigate(-1);

  const onSaveSpam = async (formData) => {
    try {
      setLoading(true);

      const values = formData.value.split(",");

      if (values.length > 1) {
        const spamsToFirestore = values.map((value) => ({
          id: getSpamId(),
          type: formData.type,
          value,
        }));

        spamsToFirestore.map((spam) => onAddSpam(spam));

        notification({ type: "success" });
        onIsModalVisible(false);
        return;
      }

      await onAddSpam(mapSpam(formData));

      notification({ type: "success" });
      onIsModalVisible(false);
    } catch (e) {
      console.log("ErrorSaveSpam: ", e);
      notification({ type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const mapSpam = (formData) => ({
    ...spam,
    type: formData.type,
    value: formData.value,
  });

  return (
    <Spam
      onSaveSpam={onSaveSpam}
      loading={loading}
      onIsModalVisible={onIsModalVisible}
    />
  );
};

const Spam = ({ onSaveSpam, loading, onIsModalVisible }) => {
  const schema = yup.object({
    type: yup.string().required(),
    value: yup.string().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "email",
    },
  });

  const { required, error } = useFormUtils({ errors, schema });

  const onSubmit = (formData) => {
    onSaveSpam(formData);
    resetData();
  };

  const resetData = () =>
    reset({
      type: "",
      value: "",
    });

  return (
    <Row>
      <Col span={24}>
        <Typography.Title level={3}> Spam </Typography.Title>
      </Col>
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
                        label: "Telefono",
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
                onClick={() => onIsModalVisible(false)}
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
