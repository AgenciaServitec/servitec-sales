import React from "react";
import { Col, List, Row, Tag } from "antd";
import { IconAction, TagHostname } from "../../ui";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faCalendarAlt,
  faEnvelope,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment/moment";
import { darken } from "polished";
import styled, { css } from "styled-components";
import { findColor } from "../../../utils";
import { NoFound } from "../../../images";
import { useAuthentication } from "../../../providers";
import { ContactInformation } from "../../../pages/emails/ContactInformation";
import { RequestInformation } from "../../../pages/emails/RequestInformation";
import { ClaimInformation } from "../../../pages/emails/ClaimInformation";
import { InformationWrapper } from "./InformationWrapper";

export const ContactInList = ({
  contacts,
  isMobile,
  clients,
  onSetContact,
  onOpenDrawerContact,
  onNavigateWithBlankTo,
  onNavigateTo,
  onConfirmDeleteContact,
}) => {
  const { authUser } = useAuthentication();

  const findClient = (clientId) =>
    clients.find((client) => client.id === clientId);

  const contactType = {
    contact: {
      text: "Contacto",
      color: "orange",
    },
    request: {
      text: "Solicitud",
      color: "green",
    },
    claim: {
      text: "Reclamo",
      color: "red",
    },
  };

  const showContact = (contact) => {
    switch (contact.type) {
      case "contact":
        return (
          <ContactInformation
            contact={contact}
            onSetContact={onSetContact}
            onOpenDrawerContact={onOpenDrawerContact}
          />
        );
      case "request":
        return (
          <RequestInformation
            request={contact}
            onSetContact={onSetContact}
            onOpenDrawerContact={onOpenDrawerContact}
          />
        );
      case "claim":
        return (
          <ClaimInformation
            claim={contact}
            onSetContact={onSetContact}
            onOpenDrawerContact={onOpenDrawerContact}
          />
        );
      default:
        return (
          <ContactInformation
            contact={contact}
            onSetContact={onSetContact}
            onOpenDrawerContact={onOpenDrawerContact}
          />
        );
    }
  };

  return (
    <Container>
      <List
        className="demo-loadmore-list"
        itemLayout={isMobile ? "vertical" : "horizontal"}
        dataSource={contacts}
        renderItem={(contact) => (
          <List.Item
            actions={[
              <IconAction
                key={contact.id}
                onClick={() =>
                  onNavigateWithBlankTo(
                    `https://wa.me/${contact.phone.countryCode}${contact.phone.number}`
                  )
                }
                size={45}
                style={{ color: "#65d844" }}
                tooltipTitle="Whatsapp"
                icon={faWhatsapp}
              />,
              <IconAction
                key={contact.id}
                onClick={() => onNavigateWithBlankTo(`mailto:${contact.email}`)}
                size={45}
                tooltipTitle="Email"
                styled={{ color: (theme) => theme.colors.error }}
                icon={faEnvelope}
              />,
              <IconAction
                key={contact.id}
                onClick={() =>
                  onNavigateWithBlankTo(
                    `tel:${contact?.phone?.countryCode}${contact?.phone?.number}`
                  )
                }
                size={45}
                style={{ color: "#0583ea" }}
                tooltipTitle="Teléfono"
                icon={faPhone}
              />,
              <IconAction
                key={contact.id}
                onClick={() => onNavigateTo(`/contacts/history/${contact.id}`)}
                size={45}
                style={{ color: "#e7c600" }}
                tooltipTitle="Historial"
                icon={faCalendarAlt}
              />,
              authUser.roleCode === "super_admin" && (
                <IconAction
                  key={contact.id}
                  onClick={() => onConfirmDeleteContact(contact.id)}
                  size={45}
                  style={{ color: "#ff0b02" }}
                  tooltipTitle="Eliminar"
                  icon={faTrash}
                />
              ),
            ]}
          >
            <List.Item.Meta
              avatar={
                <ContactPicture
                  onClick={() => {
                    onSetContact(contact);
                    onOpenDrawerContact();
                  }}
                  clientColors={findColor(contact?.clientId, clients)}
                >
                  <div className="item-client-logo">
                    <img
                      src={
                        findClient(contact.clientId)?.isotipo
                          ? findClient(contact.clientId).isotipo.thumbUrl
                          : findClient(contact.clientId)?.logotipo?.thumbUrl ||
                            NoFound
                      }
                      alt="client logo"
                    />
                  </div>
                </ContactPicture>
              }
              description={
                <InformationWrapper contactType={contact.type}>
                  <Row gutter={[0, 3]}>
                    {showContact(contact)}
                    <Col xs={24} sm={12}>
                      <DescriptionItem
                        title="Tipo"
                        content={
                          <TagItem color={contactType[contact.type]?.color}>
                            {contactType[contact.type]?.text}
                          </TagItem>
                        }
                      />
                    </Col>
                    <Col xs={24} sm={12}>
                      <DescriptionItem
                        title="Hostname"
                        content={
                          <TagHostname
                            hostname={contact.hostname}
                            clientColors={findColor(contact.clientId, clients)}
                          />
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
                  </Row>
                </InformationWrapper>
              }
            />
          </List.Item>
        )}
      />
    </Container>
  );
};

const Container = styled.div`
  .site-description-item-profile-p-label {
    display: inline-block;
    margin-right: 8px;
    margin-bottom: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 0.9em;
  }
`;

const TagItem = styled(Tag)`
  border-radius: 0.5em;
  padding: 0 3px;
  margin: 0;
`;

const ContactPicture = styled.div`
  ${({ clientColors }) => css`
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    border: 2px solid ${darken(0.08, clientColors?.bg || "#c4c4c4")};
    color: ${clientColors?.color || "#fff"};
    background: ${clientColors?.bg || "#c4c4c4"};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .item-client-logo {
      overflow: hidden;
      background: ${darken(0.08, clientColors?.bg || "#c4c4c4")};
      width: 80%;
      height: auto;
      margin-bottom: 0.3em;
      padding: 0.2em 0.4em;
      border-radius: 7em;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 90%;
        height: 100%;
        object-fit: contain;
        margin: auto;
      }
    }
  `}
`;

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);
