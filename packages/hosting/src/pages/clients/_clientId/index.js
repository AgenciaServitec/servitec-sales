import React, { useEffect, useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Checkbox from "antd/lib/checkbox";
import { useNavigate, useParams } from "react-router";
import Title from "antd/lib/typography/Title";
import {
  Button,
  ComponentContainer,
  Form,
  Input,
  InputNumber,
  notification,
  Select,
} from "../../../components/ui";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import { Upload } from "../../../components";
import { firestore } from "../../../firebase";
import { useGlobalData } from "../../../providers";
import { phoneCodes } from "../../../data-list";

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

  const mapClient = (client, formData) => ({
    id: client.id,
    name: formData.name.toLowerCase(),
    isotipo: formData?.isotipo || null,
    logotipo: formData.logotipo,
    receptorEmail: formData.receptorEmail.toLowerCase(),
    receptorEmailsCopy: formData.receptorEmailsCopy.toLowerCase(),
    hostname: formData.hostname.toLowerCase(),
    theme:
      formData.hostname.split(".").length > 2
        ? formData.hostname.split(".")[1]
        : formData.hostname.split(".")[0],
    phone: {
      number: formData.phoneNumber,
      countryCode: formData.countryCode,
    },
    smtpConfig: formData.customSMTP
      ? {
          service: formData.smtpConfig?.service || "",
          auth: {
            user: formData.smtpConfig?.user || "",
            pass: formData.smtpConfig?.pass || "",
          },
        }
      : null,
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
    isotipo: yup.object().nullable(),
    logotipo: yup.object().required(),
    receptorEmail: yup.string().required(),
    receptorEmailsCopy: yup.string(),
    hostname: yup.string().required(),
    countryCode: yup.string(),
    phoneNumber: yup.number(),
    bgColor: yup.string().required(),
    textColor: yup.string().required(),
    customSMTP: yup.boolean(),
    smtpConfig: yup
      .object({
        service: yup.string().notRequired(),
        user: yup.string().notRequired(),
        pass: yup.string().notRequired(),
      })
      .notRequired(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch,
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
      isotipo: client?.isotipo || null,
      logotipo: client?.logotipo || null,
      receptorEmail: client?.receptorEmail || "",
      receptorEmailsCopy: client?.receptorEmailsCopy || "",
      hostname: client?.hostname || "",
      countryCode: client?.phone?.countryCode || "+51",
      phoneNumber: client?.phone?.number || "",
      bgColor: client?.bgColor || "",
      textColor: client?.textColor || "",
      customSMTP: !!client?.smtpConfig,
      smtpConfig: {
        service: client?.smtpConfig?.service || "",
        user: client?.smtpConfig?.auth.user || "",
        pass: client?.smtpConfig?.auth.pass || "",
      },
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
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Nombre"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col span={24} md={12}>
              <Controller
                name="isotipo"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value, name } }) => (
                  <Upload
                    label="Isotipo (150 x 150)"
                    accept="image/*"
                    name={name}
                    value={value}
                    filePath={`clients/${client.id}/isotipo`}
                    resize="150x150"
                    fileName="isotipo"
                    thumbExtension="png"
                    buttonText="Subir imagen"
                    error={error(name)}
                    required={required(name)}
                    onChange={(file) => onChange(file)}
                    onUploading={setUploadingImage}
                  />
                )}
              />
            </Col>
            <Col span={24} md={12}>
              <Controller
                name="logotipo"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value, name } }) => (
                  <Upload
                    label="Logotipo (350 x 167)"
                    accept="image/*"
                    name={name}
                    value={value}
                    filePath={`clients/${client.id}/logotipo`}
                    resize="350x167"
                    fileName="logotipo"
                    thumbExtension="png"
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
                    label="Emails BCC separados por comas (,)"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col xs={24} sm={6} md={6}>
              <Controller
                name="countryCode"
                defaultValue="+51"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Select
                    label="Prefijo"
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                    options={phoneCodes.map((phoneCode) => ({
                      code: phoneCode.code,
                      label: `${phoneCode.name} (${phoneCode.dial_code})`,
                      value: phoneCode.dial_code,
                    }))}
                  />
                )}
              />
            </Col>
            <Col xs={24} sm={18} md={18}>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <InputNumber
                    label="Ingrese teléfono"
                    name={name}
                    value={value}
                    onChange={onChange}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Controller
                name="bgColor"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    type="color"
                    label="Color primario"
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
            <Col xs={24} sm={12}>
              <Controller
                name="textColor"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    type="color"
                    label="Color de textos"
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
            <Col span={24}>
              <Controller
                name="hostname"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    label="Hostname"
                    prefix="https://"
                    animation={false}
                    onChange={onChange}
                    value={value}
                    name={name}
                    error={error(name)}
                    required={required(name)}
                  />
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Controller
                name="customSMTP"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <Checkbox
                    name={name}
                    checked={value}
                    onChange={(checked) => onChange(checked)}
                    error={error(name)}
                  >
                    Custom SMTP
                  </Checkbox>
                )}
              />
            </Col>
            {watch("customSMTP") && (
              <Col span={24}>
                <ComponentContainer.group label="Config SMTP">
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Controller
                        name="smtpConfig.service"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Input
                            label="Service"
                            value={value}
                            onChange={onChange}
                            error={error(name)}
                            required={required(name)}
                            autoFocus
                          />
                        )}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                      <Controller
                        name="smtpConfig.user"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Input
                            label="User"
                            value={value}
                            onChange={onChange}
                            error={error(name)}
                            required={required(name)}
                            autoFocus
                          />
                        )}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                      <Controller
                        name="smtpConfig.pass"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Input
                            label="Pass"
                            value={value}
                            onChange={onChange}
                            error={error(name)}
                            required={required(name)}
                            autoFocus
                          />
                        )}
                      />
                    </Col>
                  </Row>
                </ComponentContainer.group>
              </Col>
            )}
          </Row>
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
