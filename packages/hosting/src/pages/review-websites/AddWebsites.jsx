import React, { useState } from "react";
import styled from "styled-components";
import { addOnlyNonExistingWebsites } from "../../firebase/collections";
import {
  Alert,
  Button,
  Col,
  Form,
  notification,
  Row,
  TextArea,
} from "../../components/ui";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import { validateURL } from "../../utils";
import { useAuthentication } from "../../providers";

export const AddWebsitesIntegration = ({ onCloseModal }) => {
  const { authUser } = useAuthentication();
  const [saveLoading, setSaveLoading] = useState(false);

  const onSaveWeb = async (formData) => {
    try {
      setSaveLoading(true);

      const arrayUrls = formData.url
        .split(",")
        .map((url) => url.trim().toLowerCase());

      const isValidatedUrls = arrayUrls.every((url) => validateURL(url));
      if (!isValidatedUrls)
        return notification({
          type: "warning",
          title: "Hay una URL o más con el formato incorrecto.",
        });

      await addOnlyNonExistingWebsites(arrayUrls, authUser);

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
    <AddWebsites
      onSaveWeb={onSaveWeb}
      isSavingWeb={saveLoading}
      onCloseModal={onCloseModal}
    />
  );
};

const AddWebsites = ({ onSaveWeb, isSavingWeb, onCloseModal }) => {
  const schema = yup.object({
    url: yup.string().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      url: "",
    },
  });

  const { required, error } = useFormUtils({ errors, schema });

  const onSubmit = (formData) => onSaveWeb(formData);

  return (
    <Container>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Alert
                type="info"
                showIcon
                message="Puedes agregar varias URLS separandolos con comas (,)"
              />
            </Col>
            <Col span={24}>
              <Controller
                name="url"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <TextArea
                    label="URL de pagina web"
                    placeholder="https://www.google.com/,https://servitec-peru.com/"
                    rows={4}
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
