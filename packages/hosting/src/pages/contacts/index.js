import React, { useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../firebase";
import { List, Row, Col, Typography } from "antd";
import Avatar from "react-avatar";
import VirtualList from "rc-virtual-list";
import { orderBy } from "lodash";
import moment from "moment";
import { useGlobalData } from "../../providers";
import styled from "styled-components";
import { IconAction, notification, TagHostname } from "../../components/ui";
import { FilterContacts } from "./FilterContacts";
import { useQueryString } from "../../hooks/useQueryString";
import { InformationWrapper } from "../../components/pages";
import { useDevice } from "../../hooks";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

const { Text } = Typography;

export const ContactsIntegration = () => {
  const { isMobile } = useDevice();
  const navigate = useNavigate();

  const { clients } = useGlobalData();
  const [hostname, setHostname] = useQueryString("hostname", "all");
  const [typeContact, setTypeContact] = useQueryString("typeContact", "all");

  const [contacts = [], contactsLoading, contactsError] = useCollectionData(
    firestore.collection("contacts").where("isDeleted", "==", false)
  );

  useEffect(() => {
    contactsError && notification({ type: "error", message: contactsError });
  }, []);

  const onNavigateTo = (url) => navigate(url);

  const contactsMergeClients = contacts.map((contact) => ({
    ...contact,
    client: clients.find((client) => client.id === contact.clientId),
  }));

  const contacsView = contactsMergeClients
    .filter((contact) =>
      hostname === "all" ? true : hostname === contact.hostname
    )
    .filter((contact) =>
      typeContact === "all" ? true : typeContact === contact.type
    );

  const colorByContactType = {
    contact: { color: "#d46b08", bg: "#fff7e6" },
    request: { color: "#389e0d", bg: "#f6ffed" },
    claim: { color: "#cf1322", bg: "#fff1f0" },
  };

  return (
    <Container>
      <FilterContacts
        hostname={hostname}
        onSetHostname={setHostname}
        typeContact={typeContact}
        onSetTypeContact={setTypeContact}
        clients={clients}
      />
      <Row>
        <Col>
          <Text>{contacsView.length} Resultados</Text>
        </Col>
      </Row>
      <List itemLayout={isMobile ? "vertical" : "horizontal"}>
        <VirtualList
          data={orderBy(contacsView, ["createAt"], ["desc"])}
          height={500}
          itemHeight={47}
          loading={contactsLoading}
        >
          {(contact) => (
            <List.Item key={contact.id}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    name={
                      contact?.fullName
                        ? contact.fullName
                        : `${contact.firstName} ${contact.lastName}`
                    }
                    size="80"
                    round={true}
                  />
                }
                title={
                  <span>
                    {contact?.fullName
                      ? contact.fullName
                      : `${contact.firstName} ${contact.lastName}`}
                  </span>
                }
                description={
                  <InformationWrapper
                    contactType={contact.type}
                    colorByContactType={colorByContactType}
                    className="contact-details"
                  >
                    <div>
                      <div>
                        <Text ellipsis suffix="...">
                          {contact.email}
                        </Text>
                      </div>
                      <div>
                        <span>{`${contact.phone.countryCode} ${contact.phone.number}`}</span>
                      </div>
                      <TagHostname
                        hostname={contact.hostname}
                        clientColors={{
                          color: contact.client.textColor,
                          bg: contact.client.bgColor,
                        }}
                      />
                      <div>
                        <small>
                          {moment(contact.createAt.toDate()).format(
                            "DD/MM/YYYY HH:mm a"
                          )}
                        </small>
                      </div>
                    </div>
                  </InformationWrapper>
                }
              />
              <div>
                <IconAction
                  key={contact.id}
                  onClick={() =>
                    onNavigateTo(`/contacts/history/${contact.id}`)
                  }
                  size={40}
                  style={{ color: "#e7c600" }}
                  tooltipTitle="Historial"
                  icon={faCalendarAlt}
                />
              </div>
            </List.Item>
          )}
        </VirtualList>
      </List>
    </Container>
  );
};

const Container = styled.section`
  text-transform: capitalize;
  .contact-details {
    margin-right: 1em;
  }
`;
