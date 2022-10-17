import React from "react";
import { List, Skeleton, Tag } from "antd";
import { IconAction } from "../../ui";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faCalendarTimes,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { findClientColor } from "../../../utils";
import { capitalize, startCase, toUpper } from "lodash";
import Text from "antd/lib/typography/Text";
import moment from "moment/moment";
import { lighten, darken } from "polished";
import styled, { css } from "styled-components";

export const ContactInList = ({
  loadingContacts,
  isMobile,
  contacts,
  onSetContact,
  onOpenDrawerContact,
  onNavigateWithBlankTo,
  onNavigateTo,
}) => {
  return (
    <Skeleton avatar loading={loadingContacts} active>
      <List
        className="demo-loadmore-list"
        itemLayout={isMobile ? "vertical" : "horizontal"}
        loadMore={loadingContacts}
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
                tooltipTitle="Time line"
                icon={faCalendarTimes}
              />,
            ]}
          >
            <List.Item.Meta
              avatar={
                <ContactPicture
                  onClick={() => {
                    onSetContact(contact);
                    onOpenDrawerContact();
                  }}
                  clientColors={findClientColor(contact.clientCode)}
                >
                  {toUpper(contact.firstName.split("")[0])}
                </ContactPicture>
              }
              title={
                <h2
                  className="link-color"
                  onClick={() => {
                    onSetContact(contact);
                    onOpenDrawerContact();
                  }}
                >
                  {startCase(
                    capitalize(`${contact.firstName} ${contact.lastName}`)
                  )}
                </h2>
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
                    >{`${contact.phone.countryCode} ${contact.phone.number}`}</Text>
                  </div>
                  {contact.issue && (
                    <div className="item">
                      <Text className="item-text">Asunto: </Text>
                      <Text strong>{contact.issue}</Text>
                    </div>
                  )}
                  {contact.message && (
                    <div className="item">
                      <Text className="item-text">Mensaje: </Text>
                      <Text strong>{contact.message}</Text>
                    </div>
                  )}
                  <div className="item">
                    <Text className="item-text">F. creación: </Text>
                    <Text strong>
                      {moment(contact.createAt.toDate()).format(
                        "DD/MM/YYYY HH:mm:ss a"
                      )}
                    </Text>
                  </div>
                  <div className="item">
                    <Text className="item-text">Host name: </Text>
                    <Text strong>
                      <a
                        href={
                          contact?.hostname
                            ? `https://${contact.hostname}`
                            : "#"
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Tag
                          color={lighten(
                            0.09,
                            findClientColor(contact.clientCode)?.bg || "#c4c4c4"
                          )}
                          style={{
                            color:
                              findClientColor(contact.clientCode)?.color ||
                              "#fff",
                            border: "1px solid rgba(0,0,0,.2)",
                          }}
                        >
                          {contact.hostname || ""}
                        </Tag>
                      </a>
                    </Text>
                  </div>
                </DescriptionWrapper>
              }
            />
          </List.Item>
        )}
      />
    </Skeleton>
  );
};

const ContactPicture = styled.div`
  ${({ clientColors }) => css`
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    border: 2px solid ${darken(0.08, clientColors?.bg || "#c4c4c4")};
    color: ${({ clientColors }) => clientColors?.color || "#fff"};
    background: ${({ clientColors }) => clientColors?.bg || "#c4c4c4"};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.5rem;
    cursor: pointer;
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
