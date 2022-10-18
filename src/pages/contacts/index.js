import React, { useEffect, useState } from "react";
import { firestore, querySnapshotToArray } from "../../firebase";
import Title from "antd/es/typography/Title";
import { Tabs } from "antd";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { orderBy } from "lodash";
import { useDevice } from "../../hooks";
import { useNavigate } from "react-router";
import {
  ContactInBubbles,
  ContactInList,
  DrawerUserInformation,
  FiltersContact,
} from "../../components/pages";
import useSound from "use-sound";
import { ContactSound } from "../../multimedia";

export const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [contact, setContact] = useState(null);

  const [loadingContacts, setLoadingContacts] = useState(true);
  const [isVisibleDrawerContact, setIsVisibleDrawerContact] = useState(false);

  const [play] = useSound(ContactSound);

  const navigate = useNavigate();
  const { isMobile } = useDevice();

  useEffect(() => {
    (() => fetchContacts())();
  }, []);

  const fetchContacts = async () => {
    await firestore
      .collection("contacts")
      .orderBy("createAt", "desc")
      .where("status", "==", "pending")
      .onSnapshot((snapshot) => {
        const contactsData = querySnapshotToArray(snapshot);
        setContacts(contactsData);
        setTotalContacts(contactsData.length);
        setLoadingContacts(false);
        playToSound();
      });
  };

  const playToSound = () => play();

  const lastContact = orderBy(contacts, "createAt", "desc")[0];

  const navigateWithBlankTo = (url) => window.open(url, "_blank");

  const navigateTo = (url) => navigate(url);

  const onOpenDrawerContact = () => setIsVisibleDrawerContact(true);
  const onCloseDrawerContact = () => setIsVisibleDrawerContact(false);

  const viewContacts = () => orderBy(contacts, ["createAt"], ["desc"]);

  return (
    <>
      <Row gutter={[16, 0]}>
        <Col span={24}>
          <Title level={5}>Total contactos: {totalContacts}</Title>
        </Col>
        <Col span={24}>
          <FiltersContact />
        </Col>
        <Col span={24}>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: 1,
                label: "BUBBLES",
                children: (
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={19}>
                      <ContactInBubbles
                        contacts={viewContacts()}
                        lastContact={lastContact}
                        onOpenDrawerContact={onOpenDrawerContact}
                        onSetContact={setContact}
                      />
                    </Col>
                    <Col xs={24} sm={25} md={5}>
                      <Title level={2}>
                        Recepción de contactos en tiempo real de clientes y webs
                        de servitec
                      </Title>
                    </Col>
                  </Row>
                ),
              },
              {
                key: 2,
                label: "LISTA",
                children: (
                  <ContactInList
                    loadingContacts={loadingContacts}
                    isMobile={isMobile}
                    contacts={viewContacts()}
                    onSetContact={setContact}
                    onSetTotalContacts={setTotalContacts}
                    onOpenDrawerContact={onOpenDrawerContact}
                    onNavigateWithBlankTo={navigateWithBlankTo}
                    onNavigateTo={navigateTo}
                  />
                ),
              },
            ]}
          />
        </Col>
      </Row>
      <DrawerUserInformation
        contact={contact}
        onCloseDrawerContact={onCloseDrawerContact}
        isVisibleDrawerRight={isVisibleDrawerContact}
        onNavigateWithBlankTo={navigateWithBlankTo}
        onNavigateTo={navigateTo}
      />
    </>
  );
};
