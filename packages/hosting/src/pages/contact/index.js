import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../firebase";
import { Avatar, List } from "antd";
import VirtualList from "rc-virtual-list";
import { orderBy } from "lodash";
import moment from "moment";
import { useGlobalData } from "../../providers";
import styled from "styled-components";
import { TagHostname } from "../../components/ui";
import { FilterContact } from "./FilterContact";
import { useQueryString } from "../../hooks/useQueryString";

export const Contact = () => {
  const { clients } = useGlobalData();
  const [contactId, setContactId] = useQueryString("contactId", "all");

  const [contacts = [], contactsLoading, contactsError] = useCollectionData(
    firestore.collection("contacts").where("isDeleted", "==", false)
  );

  const contactsMergeClients = contacts.map((contact) => ({
    ...contact,
    client: clients.find((client) => client.id === contact.clientId),
  }));

  return (
    <Container>
      <FilterContact clients={clients} />
      <List>
        <VirtualList
          data={orderBy(contactsMergeClients, ["createAt"], ["desc"])}
          height={500}
          itemHeight={47}
        >
          {(contact) => (
            <List.Item key={contact.id}>
              <List.Item.Meta
                avatar={<Avatar src={contact.client.logo.thumbUrl} />}
                title={
                  <span>
                    {contact?.fullName
                      ? contact.fullName
                      : `${contact.firstName + contact.lastName}`}
                  </span>
                }
                description={
                  <div>
                    <div>
                      <span>{contact.email}</span>
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
                }
              />
              <div>content</div>
            </List.Item>
          )}
        </VirtualList>
      </List>
    </Container>
  );
};

const Container = styled.section`
  text-transform: capitalize;

  .filter-contact {
    background-color: red;
    font-weight: bold;
  }
`;
