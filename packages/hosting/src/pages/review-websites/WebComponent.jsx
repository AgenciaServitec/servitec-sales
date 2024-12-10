import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { addWeb, getWebId, updateWeb } from "../../firebase/collections";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
} from "../../components/ui";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../hooks";

export const WebComponentIntegration = ({ web = null, webs, onCloseModal }) => {
  const [webFirestore, setWebFirestore] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const isNew = !web?.id;

  useEffect(() => {
    const _web = isNew
      ? {
          id: getWebId(),
        }
      : webs.find((_w) => _w.id === web.id);

    if (!_web) return onCloseModal();

    setWebFirestore(_web);
  }, [web?.id]);

  const onSaveWeb = async (formData) => {
    try {
      setSaveLoading(true);

      isNew
        ? await addWeb(
            assignCreateProps({
              id: webFirestore.id,
              status: "not_reviewed",
              ...formData,
            })
          )
        : await updateWeb(webFirestore.id, assignUpdateProps({ ...formData }));

      notification({ type: "success" });

      onCloseModal();
    } catch (e) {
      console.error("errorSaveWeb:", e);
      notification({ type: "error" });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <WebComponent
      web={webFirestore}
      onSaveWeb={onSaveWeb}
      isSavingWeb={saveLoading}
      onCloseModal={onCloseModal}
    />
  );
};

const WebComponent = ({ web, onSaveWeb, isSavingWeb, onCloseModal }) => {
  const schema = yup.object({
    url: yup.string().url().required(),
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
  }, [web?.id]);

  const resetForm = () => {
    reset({
      url: web?.url || "",
    });
  };

  const onSubmit = (formData) => onSaveWeb(formData);

  return (
    <Container>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                name="url"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Url de pagina web"
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
            <Col xs={24} sm={12} md={6}>
              <Button
                type="default"
                size="large"
                block
                onClick={() => onCloseModal()}
                disabled={isSavingWeb}
              >
                Cancelar
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                loading={isSavingWeb}
              >
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
