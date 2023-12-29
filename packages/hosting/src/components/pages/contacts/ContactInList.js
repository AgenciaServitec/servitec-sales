import React from "react";
import { List } from "antd";
import { IconAction, TagHostname } from "../../ui";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faCalendarAlt,
  faEnvelope,
  faPhone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { capitalize, startCase } from "lodash";
import Text from "antd/lib/typography/Text";
import moment from "moment/moment";
import { darken } from "polished";
import styled, { css } from "styled-components";
import { findColor } from "../../../utils";
import { NoFound } from "../../../images";
import { useAuthentication } from "../../../providers";

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

  return (
    <>
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
                size={65}
                style={{ color: "#65d844" }}
                tooltipTitle="Whatsapp"
                icon={faWhatsapp}
              />,
              <IconAction
                key={contact.id}
                onClick={() => onNavigateWithBlankTo(`mailto:${contact.email}`)}
                size={65}
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
                size={55}
                style={{ color: "#0583ea" }}
                tooltipTitle="Teléfono"
                icon={faPhone}
              />,
              <IconAction
                key={contact.id}
                onClick={() => onNavigateTo(`/contacts/${contact.id}`)}
                size={55}
                style={{ color: "#e7c600" }}
                tooltipTitle="Historial"
                icon={faCalendarAlt}
              />,
              authUser.roleCode === "super_admin" && (
                <IconAction
                  key={contact.id}
                  onClick={() => onConfirmDeleteContact(contact.id)}
                  size={55}
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
                        findClient(contact.clientId)?.logo?.thumbUrl || NoFound
                      }
                      alt="client logo"
                    />
                  </div>
                </ContactPicture>
              }
              title={
                <h3
                  className="link-color"
                  onClick={() => {
                    onSetContact(contact);
                    onOpenDrawerContact();
                  }}
                >
                  {startCase(
                    capitalize(`${contact.firstName} ${contact.lastName}`)
                  )}
                </h3>
              }
              description={
                <DescriptionWrapper>
                  <div className="item">
                    <Text className="item-text">Nombres: </Text>
                    <Text strong>{capitalize(contact.firstName)}</Text>
                  </div>
                  <div className="item">
                    <Text className="item-text">Apellidos: </Text>
                    <Text strong>{capitalize(contact.lastName)}</Text>
                  </div>
                  <div className="item">
                    <Text className="item-text">Email: </Text>
                    <Text strong>{contact.email}</Text>
                  </div>
                  <div className="item">
                    <Text className="item-text">Teléfono: </Text>
                    <Text
                      strong
                    >{`${contact?.phone?.countryCode} ${contact?.phone?.number}`}</Text>
                  </div>
                  {contact?.issue && (
                    <div className="item">
                      <Text className="item-text">Asunto: </Text>
                      <Text strong>{contact.issue}</Text>
                    </div>
                  )}
                  {contact?.message && (
                    <div className="item">
                      <Text className="item-text">Mensaje: </Text>
                      <Text strong>{contact.message}</Text>
                    </div>
                  )}
                  {contact?.createAt && (
                    <div className="item">
                      <Text className="item-text">F. creación: </Text>
                      <Text strong>
                        {moment(contact.createAt.toDate()).format(
                          "DD/MM/YYYY HH:mm:ss a"
                        )}
                      </Text>
                    </div>
                  )}
                  <div className="item">
                    <Text className="item-text">Host name: </Text>
                    <Text strong>
                      <TagHostname
                        hostname={contact.hostname}
                        clientColors={findColor(contact?.clientId, clients)}
                      />
                    </Text>
                  </div>
                </DescriptionWrapper>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};

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

const DescriptionWrapper = styled.div`
  display: grid;
  grid-row-gap: 0.3rem;
  justify-content: flex-start;
  .item {
    .item-text {
      color: ${({ theme }) => theme.colors.heading};
    }
  }
`;
