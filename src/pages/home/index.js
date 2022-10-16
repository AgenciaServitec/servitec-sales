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
import { clientColors } from "../../data-list";

export const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  const [isVisibleDrawerRight, setIsVisibleDrawerRight] = useState(false);

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
        setLoadingContacts(false);
      });
  };

  const options = {
    size: 200,
    minSize: 100,
    gutter: 8,
    provideProps: true,
    numCols: 6,
    fringeWidth: 160,
    yRadius: 400,
    xRadius: 400,
    cornerRadius: 0,
    showGuides: false,
    compact: true,
    gravitation: 40,
  };

  if (loadingContacts) return <Spinner fullscreen />;

  const findClientColor = (hostname) =>
    clientColors.find((clientColor) => clientColor.code === hostname);

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <DrawerUserInformation
          setIsVisibleDrawerRight={setIsVisibleDrawerRight}
          isVisibleDrawerRight={isVisibleDrawerRight}
        />
      </Col>
      <Col span={24}>
        <WrapperButtons>
          <BubbleUI options={options} className="my-bubble-ui">
            {contacts.map((contact, index) => (
              <FloatingBubble
                key={index}
                contact={contact}
                bgColor={findClientColor(contact.clientCode)?.bg || "#e6e5e5"}
                color={findClientColor(contact.clientCode)?.color || "#fff"}
                onSetIsVisibleDrawerRight={() =>
                  setIsVisibleDrawerRight(!isVisibleDrawerRight)
                }
              />
            ))}
          </BubbleUI>
        </WrapperButtons>
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
    max-width: 90vw;
    height: 70vh;
    border-radius: 50px;
  }
`;
