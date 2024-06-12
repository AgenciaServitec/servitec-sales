import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Col, Divider, Drawer, Row, Tag } from "antd";
import styled from "styled-components";
import {
  Button,
  EnvelopeByEmailColor,
  Form,
  IconAction,
  modalConfirm,
  notification,
  RadioGroup,
  TagHostname,
} from "../../ui";
import { mediaQuery } from "../../../styles";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import { firestore } from "../../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faCalendarAlt,
  faEnvelope,
  faFileInvoice,
  faPaperPlane,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { SendEmailMessageModal } from "./SendEmailMessageModal";
import { SendEmailQuoteModal } from "./SendEmailQuoteModal";
import { findColor } from "../../../utils";
import Tabs from "antd/lib/tabs";
import { ClaimInformation } from "../../../pages/emails/ClaimInformation";
import { RequestInformation } from "../../../pages/emails/RequestInformation";
import { ContactInformation } from "../../../pages/emails/ContactInformation";
import { InformationWrapper } from "./InformationWrapper";
import { emailsType } from "../../../data-list";
import { useFormUtils } from "../../../hooks";
import { QuotationInformation } from "../../../pages/emails/QuotationInformation";

export const DrawerUserInformation = ({
  contact,
  clients,
  onCloseDrawerContact,
  isVisibleDrawerRight,
  onNavigateWithBlankTo,
  onNavigateTo,
}) => {
  if (!contact) return null;

  const [isVisibleSendEmailModal, setIsVisibleSendEmailModal] = useState(false);
  const [isVisibleQuotationEmailModal, setIsVisibleQuotationEmailModal] =
    useState(false);
  const [savingContact, setSavingContact] = useState(false);

  const schema = yup.object({
    status: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: false,
    },
  });

  const { required, error } = useFormUtils({ errors, schema });

  useEffect(() => {
    reset({
      status: contact?.status || "pending",
    });
  }, [isVisibleDrawerRight]);

  const onSubmitSaveContact = async (formData) => {
    try {
      setSavingContact(true);

      modalConfirm({
        title: "¿Quieres marcar este contacto como atendido?",
        content: "Al aceptar, el contacto desaparecerá de la vista",
        onOk: async () => await onSaveContact(formData),
      });
    } catch (e) {
      console.error("ErrorSaveContact:", e);
      notification({ type: "error" });
    } finally {
      setSavingContact(false);
    }
  };

  const onSaveContact = async (formData) => {
    await firestore
      .collection("contacts")
      .doc(contact.id)
      .update({ ...contact, status: formData.status });

    notification({
      type: "success",
    });

    onCloseDrawerContact();
  };

  const onCLickIsVisibleSendEmailModal = () =>
    setIsVisibleSendEmailModal(!isVisibleSendEmailModal);

  const onCLickIsVisibleQuotationEmailModal = () =>
    setIsVisibleQuotationEmailModal(!isVisibleQuotationEmailModal);

  const showContact = (contact) => {
    switch (contact.type) {
      case "contact":
        return <ContactInformation contact={contact} />;
      case "request":
        return <RequestInformation request={contact} />;
      case "claim":
        return <ClaimInformation claim={contact} />;
      case "quotation":
        return <QuotationInformation quotation={contact} />;
      default:
        return <ContactInformation contact={contact} />;
    }
  };

  return (
    <>
      <ContainerDrawer
        title="Detalle de contacto"
        width={650}
        onClose={() => {
          onCloseDrawerContact();
        }}
        visible={isVisibleDrawerRight}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <InformationWrapper emailType={emailsType[contact.type]}>
          <Row gutter={[0, 7]}>
            {showContact(contact)}
            <Col xs={24} sm={12}>
              <EnvelopeByEmailColor
                title="Hostname"
                content={
                  contact?.hostname ? (
                    <TagHostname
                      hostname={contact.hostname}
                      clientColors={findColor(contact.clientId, clients)}
                    />
                  ) : null
                }
              />
            </Col>
            {emailsType?.[contact.type] && (
              <Col xs={24} sm={12}>
                <EnvelopeByEmailColor
                  title="Tipo"
                  content={
                    <TagItem color={emailsType[contact.type]?.primary_color}>
                      {emailsType[contact.type]?.name}
                    </TagItem>
                  }
                />
              </Col>
            )}
            <Col xs={24} sm={12}>
              <EnvelopeByEmailColor
                title="Fecha creación"
                content={
                  moment(contact?.createAt.toDate()).format(
                    "DD/MM/YYYY HH:mm A"
                  ) || ""
                }
              />
            </Col>
            <Col span={24} style={{ display: "flex", justifyContent: "start" }}>
              <IconAction
                onClick={() =>
                  onNavigateWithBlankTo(
                    `https://wa.me/${contact?.phone?.countryCode}${contact?.phone?.number}`
                  )
                }
                size={40}
                style={{ color: "#65d844" }}
                tooltipTitle="Whatsapp"
                icon={faWhatsapp}
              />
              <IconAction
                onClick={() => onNavigateWithBlankTo(`mailto:${contact.email}`)}
                size={40}
                tooltipTitle="Email"
                styled={{ color: (theme) => theme.colors.error }}
                icon={faEnvelope}
              />
              <IconAction
                onClick={() =>
                  onNavigateWithBlankTo(
                    `tel:${contact?.phone?.countryCode}${contact?.phone?.number}`
                  )
                }
                size={40}
                style={{ color: "#0583ea" }}
                tooltipTitle="Teléfono"
                icon={faPhone}
              />
              <IconAction
                key={contact.id}
                onClick={() => onNavigateTo(`/contacts/history/${contact.id}`)}
                size={40}
                style={{ color: "#e7c600" }}
                tooltipTitle="Historial"
                icon={faCalendarAlt}
              />
            </Col>
          </Row>
        </InformationWrapper>
        <Divider />
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Tabs
              defaultActiveKey="1"
              type="card"
              centered
              items={[
                {
                  key: 1,
                  label: (
                    <span>
                      <FontAwesomeIcon icon={faEnvelope} size="lg" /> &nbsp;
                      EMAIL
                    </span>
                  ),
                  children: (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Button
                          type="primary"
                          block
                          icon={
                            <FontAwesomeIcon icon={faPaperPlane} size="lg" />
                          }
                          onClick={() => onCLickIsVisibleSendEmailModal()}
                        >
                          &nbsp; Enviar mensaje
                        </Button>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Button
                          type="primary"
                          block
                          disabled
                          icon={
                            <FontAwesomeIcon icon={faFileInvoice} size="lg" />
                          }
                          onClick={() => onCLickIsVisibleQuotationEmailModal()}
                        >
                          &nbsp; Enviar cotizacion
                        </Button>
                      </Col>
                    </Row>
                  ),
                },
                {
                  key: 2,
                  label: (
                    <span>
                      <FontAwesomeIcon icon={faWhatsapp} size="lg" /> &nbsp; WSP
                    </span>
                  ),
                  children: (
                    <Row>
                      <Col>
                        <h3>Esta seccion aun esta en desarrollo</h3>
                      </Col>
                    </Row>
                  ),
                },
              ]}
            />
          </Col>
        </Row>
        <Divider />
        {contact?.status === "pending" && (
          <Row>
            <Col span={24}>
              <Form
                layout="vertical"
                onSubmit={handleSubmit(onSubmitSaveContact)}
              >
                <Row gutter={[0, 10]}>
                  <Col span={24}>
                    <Controller
                      name="status"
                      control={control}
                      defaultValue=""
                      render={({ field: { onChange, value, name } }) => (
                        <RadioGroup
                          label="¿El email fue atendido?"
                          name={name}
                          value={value}
                          onChange={onChange}
                          error={error(name)}
                          required={required(name)}
                          options={[
                            {
                              label: "No",
                              value: "pending",
                            },
                            {
                              label: "Si",
                              value: "attended",
                            },
                          ]}
                        />
                      )}
                    />
                  </Col>
                  <Col span={24}>
                    <Button
                      block
                      htmlType="submit"
                      type="primary"
                      size="large"
                      disabled={watch("status") === "pending" || savingContact}
                    >
                      Guardar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        )}
      </ContainerDrawer>
      <SendEmailMessageModal
        contact={contact}
        onCLickIsVisibleSendEmailModal={onCLickIsVisibleSendEmailModal}
        isVisibleSendEmailModal={isVisibleSendEmailModal}
      />
      <SendEmailQuoteModal
        contact={contact}
        onCLickIsVisibleQuotationEmailModal={
          onCLickIsVisibleQuotationEmailModal
        }
        isVisibleQuotationEmailModal={isVisibleQuotationEmailModal}
      />
    </>
  );
};

const ContainerDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    ${mediaQuery.maxTablet} {
      width: 100% !important;
    }
  }
`;

const TagItem = styled(Tag)`
  border-radius: 0.5em;
  padding: 0 3px;
  margin: 0;
`;
