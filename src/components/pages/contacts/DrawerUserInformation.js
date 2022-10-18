import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Col, Divider, Drawer, Row, Switch } from "antd";
import styled from "styled-components";
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
import { capitalize } from "lodash";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faCalendarAlt,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

export const DrawerUserInformation = ({
  contact,
  onCloseDrawerContact,
  isVisibleDrawerRight,
  onNavigateWithBlankTo,
  onNavigateTo,
}) => {
  if (!contact) return null;

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

  return (
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
      <Row>
        <Col xs={24} sm={12}>
          <DescriptionItem
            title="Nombres"
            content={capitalize(contact?.firstName) || ""}
          />
        </Col>
        <Col xs={24} sm={12}>
          <DescriptionItem
            title="Apellidos"
            content={capitalize(contact?.lastName) || ""}
          />
        </Col>
        <Col xs={24} sm={12}>
          <DescriptionItem title="Email" content={contact?.email || ""} />
        </Col>
        <Col xs={24} sm={12}>
          <DescriptionItem
            title="Teléfono"
            content={
              `${contact?.phone.countryCode} ${contact?.phone.number}` || ""
            }
          />
        </Col>
        <Col span={24}>
          <DescriptionItem title="Asunto" content={contact?.issue || ""} />
        </Col>
        <Col span={24}>
          <DescriptionItem title="Mensaje" content={contact?.message || ""} />
        </Col>
        <Col xs={24} sm={12}>
          <DescriptionItem
            title="Hostname"
            content={contact?.hostname ? <TagHostname contact={contact} /> : ""}
          />
        </Col>
        <Col xs={24} sm={12}>
          <DescriptionItem
            title="Fecha creación"
            content={
              moment(contact?.createAt.toDate()).format("DD/MM/YYYY HH:mm A") ||
              ""
            }
          />
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
          <IconAction
            onClick={() =>
              onNavigateWithBlankTo(
                `https://wa.me/${contact?.phone?.countryCode}${contact?.phone?.number}`
              )
            }
            size={65}
            style={{ color: "#65d844" }}
            tooltipTitle="Whatsapp"
            icon={faWhatsapp}
          />
        </Col>
        <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
          <IconAction
            onClick={() => onNavigateWithBlankTo(`mailto:${contact.email}`)}
            size={65}
            tooltipTitle="Email"
            styled={{ color: (theme) => theme.colors.error }}
            icon={faEnvelope}
          />
        </Col>
        <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
          <IconAction
            onClick={() =>
              onNavigateWithBlankTo(
                `tel:${contact?.phone?.countryCode}${contact?.phone?.number}`
              )
            }
            size={55}
            style={{ color: "#0583ea" }}
            tooltipTitle="Teléfono"
            icon={faPhone}
          />
        </Col>
        <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
          <IconAction
            key={contact.id}
            onClick={() => onNavigateTo(`/contacts/${contact.id}`)}
            size={55}
            style={{ color: "#e7c600" }}
            tooltipTitle="Time line"
            icon={faCalendarAlt}
          />
        </Col>
      </Row>
      <Divider />
      <Form
        layout="vertical"
        hideRequiredMark
        onSubmit={handleSubmit(onSubmitSaveContact)}
      >
        <Row gutter={[0, 10]}>
          <Col span={24}>
            <Group label="¿El cliente fue atendido?">
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
    </ContainerDrawer>
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
    color: rgba(0, 0, 0, 0.65);
    font-size: 0.9em;
  }
`;

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);
