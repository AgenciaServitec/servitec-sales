import React, { useEffect, useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { DrawerUserInformation } from "../../components/pages";
import { FloatingBubble } from "../../components/ui/FloatingBubble";
import { firestore, querySnapshotToArray } from "../../firebase";
import { Spinner } from "../../components/ui";
import styled from "styled-components";
import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";
import { orderBy } from "lodash";
import Title from "antd/lib/typography/Title";
import { ContactSound } from "../../multimedia";
import useSound from "use-sound";
import { findClientColor } from "../../utils";

export const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState(null);

  const [loadingContacts, setLoadingContacts] = useState(true);
  const [isVisibleDrawerRight, setIsVisibleDrawerRight] = useState(false);

  const [play] = useSound(ContactSound);

  useEffect(() => {
    (() => fetchContacts())();
  }, []);

  const lastContact = orderBy(contacts, "createAt", "desc")[0];

  const playToSound = () => play();

  const fetchContacts = async () => {
    await firestore
      .collection("contacts")
      .orderBy("createAt", "desc")
      .where("status", "==", "pending")
      .onSnapshot((snapshot) => {
        const contactsData = querySnapshotToArray(snapshot);
        setContacts(contactsData);
        setLoadingContacts(false);
      });

    playToSound();
  };

  const options = {
    size: 190,
    minSize: 100,
    gutter: 8,
    provideProps: true,
    numCols: 5,
    fringeWidth: 160,
    yRadius: 400,
    xRadius: 400,
    cornerRadius: 0,
    showGuides: false,
    compact: true,
    gravitation: 10,
  };

  if (loadingContacts) return <Spinner fullscreen />;

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <DrawerUserInformation
          onSetIsVisibleDrawerRight={setIsVisibleDrawerRight}
          isVisibleDrawerRight={isVisibleDrawerRight}
          contact={contact}
        />
      </Col>
      <Col xs={24} sm={18}>
        <WrapperButtons>
          <BubbleUI options={options} className="my-bubble-ui">
            {contacts.map((contact, index) => (
              <FloatingBubble
                key={index}
                contact={contact}
                isLastContact={lastContact.id === contact.id}
                clientColors={findClientColor(contact.clientCode)}
                onSetIsVisibleDrawerRight={() =>
                  setIsVisibleDrawerRight(!isVisibleDrawerRight)
                }
                onSetContact={setContact}
              />
            ))}
          </BubbleUI>
        </WrapperButtons>
      </Col>
      <Col xs={24} sm={6}>
        <Title>
          Recepcion de contactos en tiempo real de clientes y webs de servitec
        </Title>
      </Col>
    </Row>
  );
};

const WrapperButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 4rem;

  .my-bubble-ui {
    width: 100%;
    max-width: 1000px;
    height: 60vh;
    margin: auto;
    border-radius: 50px;
    background: #d8d8d8;
    overflow: hidden;
  }
`;
