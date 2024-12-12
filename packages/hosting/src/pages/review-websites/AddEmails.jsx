import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { settingsRef, updateSetting } from "../../firebase/collections";
import {
  Alert,
  Button,
  Col,
  Form,
  notification,
  Row,
  Spinner,
  TextArea,
} from "../../components/ui";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import { validateEmail } from "../../utils";
import { useDocumentData } from "react-firebase-hooks/firestore";

export const AddEmailsIntegration = ({ onCloseModal }) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [setting, settingLoading, settingError] = useDocumentData(
    settingsRef.doc("default")
  );

  useEffect(() => {
    settingError && notification({ type: "error" });
  }, [settingError]);

  const clearEmails = (txt) =>
    txt.split(",").map((url) => url.trim().toLowerCase());

  const onSaveEmails = async (formData) => {
    try {
      setSaveLoading(true);

      const arrayEmails = clearEmails(
        `${formData.toEmails},${formData.bccEmails}`
      );

      const isValidatedEmails = arrayEmails.every((email) =>
        validateEmail(email)
      );
      if (!isValidatedEmails)
        return notification({
          type: "warning",
          title: "Parece que hay un email o más con el formato incorrecto.",
        });

      await updateSetting("default", {
        reviewAllWebsites: {
          ...setting?.reviewAllWebsites,
          toEmails: clearEmails(formData.toEmails).join(",").trim(),
          bccEmails: formData?.bccEmails
            ? clearEmails(formData.bccEmails).join(",").trim()
            : "",
        },
      });

      notification({ type: "success" });

      onCloseModal();
    } catch (e) {
      console.error("errorSaveEmails:", e);
      notification({ type: "error" });
    } finally {
      setSaveLoading(false);
    }
  };

  if (settingLoading) return <Spinner height="40svh" size="4x" />;

  return (
    <AddEmails
      setting={setting}
      onSaveEmails={onSaveEmails}
      isSavingWeb={saveLoading}
      onCloseModal={onCloseModal}
    />
  );
};

const AddEmails = ({ setting, onSaveEmails, isSavingWeb, onCloseModal }) => {
  const schema = yup.object({
    toEmails: yup.string().required(),
    bccEmails: yup.string(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      toEmails: "",
      bccEmails: "",
    },
  });

  useEffect(() => {
    reset({
      toEmails: setting.reviewAllWebsites?.toEmails || "",
      bccEmails: setting.reviewAllWebsites?.bccEmails || "",
    });
  }, [setting]);

  const { required, error } = useFormUtils({ errors, schema });

  const onSubmit = (formData) => onSaveEmails(formData);

  return (
    <Container>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Alert
                type="info"
                showIcon
                message="Puedes agregar varios emails separandolos con comas (,)"
              />
            </Col>
            <Col span={24}>
              <Controller
                name="toEmails"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <TextArea
                    label="Emails receptores (To)"
                    placeholder="nmoriano26@gmail.com,contacto@servitec.com"
                    rows={3}
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
                name="bccEmails"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <TextArea
                    label="Copia de emails (Bcc)"
                    placeholder="nmoriano26@gmail.com,contacto@servitec.com"
                    rows={2}
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
