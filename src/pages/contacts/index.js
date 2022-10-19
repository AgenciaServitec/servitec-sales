import React, { useEffect, useState } from "react";
import { firestore, querySnapshotToArray } from "../../firebase";
import Title from "antd/es/typography/Title";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Select from "antd/lib/select";
import Text from "antd/lib/typography/Text";
import Button from "antd/lib/button";
import Tabs from "antd/lib/tabs";
import { includes, orderBy } from "lodash";
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
import { useQueryString } from "../../hooks/useQueryString";
import { useGlobalData } from "../../providers";

export const Contacts = () => {
  const { contacts } = useGlobalData();

  console.log("contacts->", contacts);

  const [status, setStatus] = useQueryString("status", "pending");
  const [clientCode, setClientCode] = useQueryString("clientCode", "all");

  const [contact, setContact] = useState(null);
  const [searchDataForm, setSearchDataForm] = useState([]);

  const [loadingContacts, setLoadingContacts] = useState(true);
  const [isVisibleDrawerContact, setIsVisibleDrawerContact] = useState(false);

  const navigate = useNavigate();
  const { isMobile } = useDevice();

  const lastContact = orderBy(contacts, "createAt", "desc")[0];

  const navigateWithBlankTo = (url) => window.open(url, "_blank");

  const navigateTo = (url) => navigate(url);

  const onOpenDrawerContact = () => setIsVisibleDrawerContact(true);
  const onCloseDrawerContact = () => setIsVisibleDrawerContact(false);

  const viewContacts = () => {
    const result = contacts
      .filter((contact) => contact.status === status)
      .filter((contact) =>
        clientCode === "all" ? true : contact.clientCode === clientCode
      )
      .filter((contact) =>
        searchDataForm.length >= 1
          ? contact.searchData.some((word) => includes(searchDataForm, word))
          : true
      );

    return orderBy(result, ["createAt"], ["desc"]);
  };

  const onResetContact = () => setSearchDataForm([]);

  const handleSearchDataFormChange = (value) => setSearchDataForm(value);

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Title level={5}>
            Total contactos: {viewContacts()?.length || 0}
          </Title>
        </Col>
        <Col span={24}>
          <FiltersContact
            onSetStatus={setStatus}
            onSetClientCode={setClientCode}
            status={status}
            clientCode={clientCode}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Row gutter={[16, 15]}>
            <Col xs={24} sm={17} md={20}>
              <Select
                placeholder="Ingrese datos de busqueda"
                mode="tags"
                size="large"
                value={searchDataForm}
                onChange={handleSearchDataFormChange}
                style={{ width: "100%" }}
              />
              <br />
              <div>
                <Text>
                  Puedes realizar la busqueda con los siguientes datos: nombres,
                  apellidos, teléfono, email, f.creación, hostname, código
                  cliente, status
                </Text>
              </div>
              <div>
                <Text keyboard>
                  Ejemplo: noel, moriano, 931136482, noel@gmail.com, 01/12/2022,
                  publicidad-google, pending
                </Text>
              </div>
            </Col>
            <Col xs={24} sm={7} md={4}>
              <Button
                type="default"
                size="large"
                block
                onClick={() => onResetContact()}
              >
                Resetear
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={[16, 0]}>
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
                    contacts={viewContacts()}
                    loadingContacts={loadingContacts}
                    isMobile={isMobile}
                    onSetContact={setContact}
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
