import React, { useEffect } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Timeline from "antd/lib/timeline";
import { useNavigate, useParams } from "react-router";
import { firestore } from "../../../firebase";
import {
  useCollectionData,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
import {
  IconAction,
  notification,
  Spinner,
  TagHostname,
} from "../../../components/ui";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import styled, { css } from "styled-components";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowCircleLeft,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { orderBy } from "lodash";
import { findColor } from "../../../utils";
import { useGlobalData } from "../../../providers";
import { darken } from "polished";
import { theme } from "../../../styles";

export const Email = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { clients } = useGlobalData();

  const [contact, loadingContact, errorContact] = useDocumentDataOnce(
    firestore.collection("contacts").doc(contactId)
  );

  const [contacts = [], loadingContacts, errorContacts] = useCollectionData(
    contact
      ? firestore.collection("contacts").where("email", "==", contact?.email)
      : null
  );

  useEffect(() => {
    if (errorContact || errorContacts) return notification({ type: "error" });
  }, [errorContact, errorContacts]);

  const onGoBack = () => navigate(-1);

  const navigateWithBlankTo = (url) => window.open(url, "_blank");

  const findClient = (clientId) =>
    clients.find((client) => client.id === clientId);

  const viewContacts = () => orderBy(contacts, ["createAt"], ["desc"]);

  if (loadingContact || loadingContacts) return <Spinner fullscreen />;

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={1}>
          <IconAction
            key={contact.id}
            onClick={() => onGoBack()}
            size={50}
            style={{ color: theme.colors.primary }}
            icon={faArrowCircleLeft}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Title level={3} style={{ margin: ".3em" }}>
            {`${contact.firstName} ${contact.lastName}`.toUpperCase()}
          </Title>
        </Col>
        <Col xs={24} sm={15} align="end">
          <Title level={5}>{contact.email.toLowerCase()}</Title>
          <Text>
            {`${contact?.phone.countryCode} ${contact?.phone.number}` || ""}
          </Text>
          <WrapperSocials>
            <ul>
              <li>
                <IconAction
                  key={contact.id}
                  onClick={() =>
                    navigateWithBlankTo(
                      `https://wa.me/${
                        `${contact?.phone.countryCode}${contact?.phone.number}` ||
                        ""
                      }`
                    )
                  }
                  size={50}
                  style={{ color: "#65d844" }}
                  tooltipTitle="Whatsapp"
                  icon={faWhatsapp}
                />
              </li>
              <li>
                <IconAction
                  key={contact.id}
                  onClick={() => navigateWithBlankTo(`mailto:${contact.email}`)}
                  size={50}
                  tooltipTitle="Email"
                  styled={{ color: (theme) => theme.colors.error }}
                  icon={faEnvelope}
                />
              </li>
              <li>
                <IconAction
                  key={contact.id}
                  onClick={() =>
                    navigateWithBlankTo(
                      `tel:${
                        `${contact?.phone.countryCode}${contact?.phone.number}` ||
                        ""
                      }`
                    )
                  }
                  size={45}
                  style={{ color: "#0583ea" }}
                  tooltipTitle="Teléfono"
                  icon={faPhone}
                />
              </li>
            </ul>
          </WrapperSocials>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Timeline mode="alternate">
            {viewContacts().map((contact, index) => (
              <Timeline.Item
                key={index}
                dot={
                  <ItemDot
                    clientColors={findColor(contact.clientId, clients)}
                  />
                }
              >
                <WrapperTimeLineItem>
                  <ul>
                    <li>
                      <h5>
                        <strong>
                          {moment(contact.createAt.toDate()).format(
                            "DD/MM/YYYY HH:mm:ss a"
                          )}
                        </strong>
                      </h5>
                    </li>
                    {contact?.issue && (
                      <li>
                        <h3>{contact.issue || ""}</h3>
                      </li>
                    )}
                    <li>
                      <h4>
                        {`${contact?.phone.countryCode} ${contact?.phone.number}` ||
                          ""}
                      </h4>
                    </li>
                    {contact?.message && (
                      <li>
                        <p>{contact.message}</p>
                      </li>
                    )}
                    <li>
                      <Text strong>
                        <TagHostname
                          hostname={contact.hostname}
                          clientColors={findColor(contact.clientId, clients)}
                        />
                      </Text>
                    </li>
                  </ul>
                </WrapperTimeLineItem>
              </Timeline.Item>
            ))}
          </Timeline>
        </Col>
      </Row>
    </>
  );
};

const WrapperSocials = styled.div`
  margin: 1rem 0 2rem 0;
  ul {
    padding: 0;
    list-style: none;
    display: flex;
    justify-content: flex-end;
    li {
      margin-left: 0.5rem;
    }
  }
`;

const WrapperTimeLineItem = styled.div`
  ul {
    list-style: none;
    padding: 0;
    li {
      h3 {
        color: #1890ff;
      }
    }
  }
`;

const ItemDot = styled.div`
  ${({ clientColors }) => css`
    background: ${darken(0.08, clientColors?.bg || "#c4c4c4")};
    width: 1.1em;
    height: 1.1em;
    border-radius: 50%;
  `}
`;
