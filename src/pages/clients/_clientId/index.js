import React, { useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { useNavigate, useParams } from "react-router";
import Title from "antd/lib/typography/Title";
import { Button, Form, Input } from "../../../components/ui";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDefaultFirestoreProps, useFormUtils } from "../../../hooks";
import { Upload } from "../../../components";

export const ClientIntegration = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();

  const onGoBack = () => navigate(-1);

  return <Client clientId={clientId} onGoBack={onGoBack} />;
};

const Client = ({ clientId, onGoBack }) => {
  const [uploadingImage, setUploadingImage] = useState(false);

  const schema = yup.object({
    name: yup.string().required(),
    clientId: yup.string().required(),
    companyLogo: yup.object().required(),
    receptorEmail: yup.string().required(),
    receptorEmailsCopy: yup.string(),
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

  const onSubmitSaveFlipBookPage = async (formData) => {
    console.log("formData->", formData);
  };

  /* useEffect(() => {
    resetForm();
  }, [flipBookPage]);

  const resetForm = () => {
    reset({
      pageNumber: flipBookPage?.pageNumber || "",
      flipBookPageImage: flipBookPage?.flipBookPageImage || null,
    });
  };*/

  return (
    <Row>
      <Col span={24}>
        <Title level={3}>Client (API)</Title>
      </Col>
      <Col span={24}>
        <Form onSubmit={handleSubmit(onSubmitSaveFlipBookPage)}>
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
              name="clientId"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Id client (API)"
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
              name="companyLogo"
              control={control}
              defaultValue={null}
              render={({ field: { onChange, value, name } }) => (
                <Upload
                  label="Logo compania (250x100)"
                  accept="image/*"
                  name={name}
                  value={value}
                  filePath={`flip-book-pages/${"id"}`}
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
          <Row justify="end" gutter={[16, 16]}>
            <Col xs={24} sm={6} md={4}>
              <Button
                type="default"
                size="large"
                block
                onClick={() => onGoBack()}
                disabled={uploadingImage}
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
                disabled={uploadingImage}
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
