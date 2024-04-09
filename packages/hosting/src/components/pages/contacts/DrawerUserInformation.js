import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Col, Divider, Drawer, Row, Switch } from "antd";
import styled, { css } from "styled-components";
import {
  Button,
  Form,
  IconAction,
  modalConfirm,
  notification,
  TagHostname,
} from "../../ui";
import { mediaQuery } from "../../../styles";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Group } from "../../ui/component-container/Group";
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

  const [statusType, setStatusType] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  const schema = yup.object({
    status: yup.bool(),
  });

  const { handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const resetStatusType = () => setStatusType(false);

  const onSubmitSaveContact = async () => {
    try {
      setSavingContact(true);

      modalConfirm({
        title: "¿Quieres marcar este contacto como atendido?",
        content: "Al aceptar, el contacto desaparecerá de la vista",
        onOk: async () => await onSaveContact(),
      });
    } catch (e) {
      console.error("ErrorSaveContact:", e);
      notification({ type: "error" });
    } finally {
      setSavingContact(false);
    }
  };

  const onSaveContact = async () => {
    await firestore
      .collection("contacts")
      .doc(contact.id)
      .set(
        { ...contact, status: statusType ? "attended" : "pending" },
        { merge: true }
      );

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
      default:
        return <ContactInformation contact={contact} />;
    }
  };

  const colorByContactType = {
    contact: { color: "#d46b08", bg: "#fff7e6" },
    request: { color: "#389e0d", bg: "#f6ffed" },
    claim: { color: "#cf1322", bg: "#fff1f0" },
  };

  return (
    <>
      <ContainerDrawer
        title="Detalle de contacto"
        width={650}
        onClose={() => {
          onCloseDrawerContact();
          resetStatusType();
        }}
        visible={isVisibleDrawerRight}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <InformationWrapper
          contactType={contact.type}
          colorByContactType={colorByContactType}
        >
          <Row gutter={[0, 7]}>
            {showContact(contact)}
            <Col xs={24} sm={12}>
              <DescriptionItem
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
            <Col xs={24} sm={12}>
              <DescriptionItem
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
                onClick={() => onNavigateTo(`/contacts/${contact.id}`)}
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
        {contact.status === "pending" && (
          <Row>
            <Col span={24}>
              <Form
                layout="vertical"
                onSubmit={handleSubmit(onSubmitSaveContact)}
              >
                <Row gutter={[0, 10]}>
                  <Col span={24}>
                    <Group label="¿El contacto fue atendido?">
                      <Switch
                        onClick={(e) => setStatusType(e)}
                        checkedChildren="Si"
                        unCheckedChildren="No"
                        defaultChecked={false}
                        checked={statusType}
                      />
                    </Group>
                  </Col>
                  <Col span={24}>
                    <Button
                      block
                      htmlType="submit"
                      type="primary"
                      size="large"
                      disabled={!statusType || savingContact}
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
  .site-form-in-drawer-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
    border-top: 1px solid #e9e9e9;
  }

  .site-description-item-profile-wrapper {
    margin-bottom: 7px;

    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 1.5715;
  }

  [data-theme="compact"] .site-description-item-profile-wrapper {
    font-size: 12px;
    line-height: 1.66667;
  }

  .ant-drawer-body p.site-description-item-profile-p {
    display: block;
    margin-bottom: 16px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 1em;
    line-height: 1.5715;
  }

  [data-theme="compact"] .ant-drawer-body p.site-description-item-profile-p {
    font-size: 1em;
    line-height: 1.66667;
  }

  .site-description-item-profile-p-label {
    display: inline-block;
    margin-right: 8px;
    margin-bottom: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 0.9em;
  }
`;

const InformationWrapper = styled.div`
  ${({ contactType, colorByContactType }) => css`
    border-radius: 0.5em;
    padding: 0.7em;
    background-color: ${colorByContactType[contactType]?.bg || ""};
    border: 1px solid ${colorByContactType[contactType]?.color || ""};
  `}
`;

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);
