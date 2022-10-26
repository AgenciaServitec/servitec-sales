import React, { useEffect, useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { useNavigate, useParams } from "react-router";
import Title from "antd/lib/typography/Title";
import { Button, Form, Input, notification } from "../../../components/ui";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import { Upload } from "../../../components";
import { firestore } from "../../../firebase";
import { useGlobalData } from "../../../providers";
import { assign } from "lodash";

export const ClientIntegration = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const { assignCreateProps, assignUpdateProps } = useDefaultFirestoreProps();

  const { clients } = useGlobalData();

  const [client, setClient] = useState({});
  const [savingClient, setSavingClient] = useState(false);

  useEffect(() => {
    const _client =
      clientId === "new"
        ? { id: firestore.collection("clients").doc().id }
        : clients.find((client) => client.id === clientId);

    if (!_client) return navigate(-1);

    setClient(_client);
  }, []);

  const onSubmitSaveClient = async (formData) => {
    try {
      setSavingClient(true);

      await firestore
        .collection("clients")
        .doc(client.id)
        .set(
          clientId === "new"
            ? assignCreateProps(mapClient(client, formData))
            : assignUpdateProps(mapClient(client, formData)),
          { merge: true }
        );

      notification({ type: "success" });

      onGoBack();
    } catch (e) {
      console.log("ErrorSaveClient: ", e);
      notification({ type: "error" });
    } finally {
      setSavingClient(false);
    }
  };

  const mapClient = (client, formData) =>
    assign({}, formData, {
      id: client.id,
      name: formData.name.toLowerCase(),
      receptorEmail: formData.receptorEmail.toLowerCase(),
      receptorEmailsCopy: formData.receptorEmailsCopy.toLowerCase(),
    });

  const onGoBack = () => navigate(-1);

  return (
    <Client
      client={client}
      onSubmitSaveClient={onSubmitSaveClient}
      onGoBack={onGoBack}
      savingClient={savingClient}
    />
  );
};

const Client = ({ client, onSubmitSaveClient, savingClient, onGoBack }) => {
  const [uploadingImage, setUploadingImage] = useState(false);

  const schema = yup.object({
    name: yup.string().required(),
    logo: yup.object().required(),
    receptorEmail: yup.string().required(),
    receptorEmailsCopy: yup.string(),
    color: yup.string().required(),
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
  }, [client]);

  const resetForm = () => {
    reset({
      name: client?.name || "",
      logo: client?.logo || null,
      receptorEmail: client?.receptorEmail || "",
      receptorEmailsCopy: client?.receptorEmailsCopy || "",
      color: client?.color || "",
    });
  };

  const submitSaveClient = (formData) => onSubmitSaveClient(formData);

  return (
    <Row>
      <Col span={24}>
        <Title level={3}>Client (API)</Title>
      </Col>
      <Col span={24}>
        <Form onSubmit={handleSubmit(submitSaveClient)}>
          <Col span={24}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Nombre"
                  size="large"
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
              name="logo"
              control={control}
              defaultValue={null}
              render={({ field: { onChange, value, name } }) => (
                <Upload
                  label="Logo cliente (300x90)"
                  accept="image/*"
                  name={name}
                  value={value}
                  filePath={`clients/${client.id}`}
                  buttonText="Subir imagen"
                  error={error(name)}
                  required={required(name)}
                  onChange={(file) => onChange(file)}
                  onUploading={setUploadingImage}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="receptorEmail"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Email del receptor"
                  size="large"
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
              name="receptorEmailsCopy"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Copia email receptores, separardos por comas (,)"
                  size="large"
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
              name="color"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  type="color"
                  label="Color de cliente"
                  size="large"
                  animation={false}
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
          <Row justify="end" gutter={[16, 16]}>
            <Col xs={24} sm={6} md={4}>
              <Button
                type="default"
                size="large"
                block
                onClick={() => onGoBack()}
                disabled={uploadingImage | savingClient}
              >
                Cancelar
              </Button>
            </Col>
            <Col xs={24} sm={6} md={4}>
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                disabled={uploadingImage | savingClient}
                loading={savingClient}
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
