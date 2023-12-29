import React, { useState } from "react";
import Title from "antd/es/typography/Title";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Select from "antd/lib/select";
import Button from "antd/lib/button";
import Tabs from "antd/lib/tabs";
import Spin from "antd/lib/spin";
import Space from "antd/lib/space";
import { includes, orderBy } from "lodash";
import { useDevice } from "../../hooks";
import { useNavigate } from "react-router";
import {
  ContactInBubbles,
  ContactInList,
  DrawerUserInformation,
  FiltersContact,
} from "../../components/pages";
import { useQueryString } from "../../hooks/useQueryString";
import { useAuthentication, useContacts, useGlobalData } from "../../providers";
import { formatWord, formatWords } from "../../utils";
import { firestore } from "../../firebase";
import { modalConfirm } from "../../components/ui";

export const Contacts = () => {
  const navigate = useNavigate();
  const { isMobile } = useDevice();

  const { authUser } = useAuthentication();
  const { contacts, loadingContacts } = useContacts();
  const { clients } = useGlobalData();

  const [status, setStatus] = useQueryString("status", "pending");
  const [clientId, setClientId] = useQueryString("clientId", "all");

  const [contact, setContact] = useState(null);
  const [searchDataForm, setSearchDataForm] = useState([]);
  const [isVisibleDrawerContact, setIsVisibleDrawerContact] = useState(false);

  const lastContact = orderBy(contacts, "createAt", "desc")[0];

  const navigateWithBlankTo = (url) => window.open(url, "_blank");

  const navigateTo = (url) => navigate(url);

  const onOpenDrawerContact = () => setIsVisibleDrawerContact(true);
  const onCloseDrawerContact = () => setIsVisibleDrawerContact(false);

  const existsAllOption = authUser?.clientsIds.find(
    (clientId) => clientId === "all"
  );

  const clientsIds = clients.map((client) => client.id);

  const viewClients = orderBy(
    clients.filter((client) =>
      includes(existsAllOption ? clientsIds : authUser?.clientsIds, client.id)
    ),
    ["name"],
    ["asc"]
  );

  const viewContacts = orderBy(
    contacts
      .filter((contact) => contact.status === status)
      .filter((contact) =>
        clientId === "all"
          ? includes(
              viewClients.map((client) => client.id),
              contact.clientId
            )
          : contact.clientId === clientId
      )
      .filter((contact) =>
        searchDataForm.length >= 1
          ? contact.searchData.some((word) =>
              includes(formatWords(searchDataForm), formatWord(word))
            )
          : true
      ),
    ["createAt"],
    ["desc"]
  );

  const onResetContact = () => {
    setStatus("pending");
    setClientId("all");
    setSearchDataForm([]);
  };

  const handleSearchDataFormChange = (value) => setSearchDataForm(value);

  const confirmDeleteContact = (contactId) =>
    modalConfirm({
      title: "¿Seguro que quieres eliminar?",
      content: "se eliminara el contacto",
      onOk: () => deleteContact(contactId),
    });

  const deleteContact = async (contactId) =>
    await firestore
      .collection("contacts")
      .doc(contactId)
      .update({ isDeleted: true });

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={5}>Total contactos: {viewContacts?.length || 0}</Title>
        </Col>
        <Col span={24}>
          <FiltersContact
            onSetStatus={setStatus}
            onSetClientId={setClientId}
            status={status}
            clientId={clientId}
            clients={viewClients}
          />
        </Col>
        <Col span={24}>
          <Row gutter={[16, 15]}>
            <Col xs={24} sm={17} md={20}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Select
                  placeholder="Ingrese datos de busqueda (Ejemplo: noel, moriano, 931136482, noel@gmail.com, 2022-12-30)"
                  mode="tags"
                  size="large"
                  value={searchDataForm || null}
                  onChange={handleSearchDataFormChange}
                  style={{ width: "100%" }}
                />
              </Space>
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
      <Spin tip="Cargando..." spinning={!!loadingContacts}>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Tabs
              defaultActiveKey="2"
              items={[
                {
                  key: 1,
                  label: "BUBBLES",
                  children: (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={24} md={19}>
                        <ContactInBubbles
                          key={viewContacts?.length || 0}
                          contacts={viewContacts}
                          lastContact={lastContact}
                          clients={clients}
                          onOpenDrawerContact={onOpenDrawerContact}
                          onSetContact={setContact}
                        />
                      </Col>
                      <Col xs={24} sm={25} md={5}>
                        <Title level={2}>
                          Recepción de contactos en tiempo real de clientes y
                          webs de servitec
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
                      key={viewContacts?.length || 0}
                      contacts={viewContacts}
                      isMobile={isMobile}
                      clients={clients}
                      onSetContact={setContact}
                      onOpenDrawerContact={onOpenDrawerContact}
                      onNavigateWithBlankTo={navigateWithBlankTo}
                      onNavigateTo={navigateTo}
                      onConfirmDeleteContact={confirmDeleteContact}
                    />
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </Spin>
      <DrawerUserInformation
        contact={contact}
        clients={clients}
        onCloseDrawerContact={onCloseDrawerContact}
        isVisibleDrawerRight={isVisibleDrawerContact}
        onNavigateWithBlankTo={navigateWithBlankTo}
        onNavigateTo={navigateTo}
      />
    </>
  );
};
