import React, { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Button from "antd/lib/button";
import Tabs from "antd/lib/tabs";
import Spin from "antd/lib/spin";
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
import { firestore } from "../../firebase";
import { modalConfirm, RadioGroup } from "../../components/ui";
import useSound from "use-sound";
import { ContactSound } from "../../multimedia";

export const Emails = () => {
  const navigate = useNavigate();
  const { isMobile } = useDevice();

  const { authUser } = useAuthentication();
  const { contacts, loadingContacts } = useContacts();
  const { clients } = useGlobalData();

  const [status, setStatus] = useQueryString("status", "pending");
  const [clientId, setClientId] = useQueryString("clientId", "all");
  const [type, setType] = useQueryString("type", "all");

  const [contact, setContact] = useState(null);
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
      .filter((contact) => (status ? contact.status === status : true))
      .filter((contact) =>
        clientId === "all"
          ? includes(
              viewClients.map((client) => client.id),
              contact.clientId
            )
          : contact.clientId === clientId
      )
      .filter((contact) => (type !== "all" ? contact.type === type : true)),
    ["createAt"],
    ["desc"]
  );

  const onResetContact = () => {
    setStatus("pending");
    setClientId("all");
    setType("all");
  };

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
              <div>
                <label>Tipo:</label>
              </div>
              <RadioGroup
                variant="filled"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={[
                  { label: "Todos", value: "all" },
                  { label: "Contacto", value: "contact" },
                  { label: "Solicitudes", value: "request" },
                  { label: "Reclamos", value: "claim" },
                ]}
              />
            </Col>
            <Col xs={24} sm={7} md={4}>
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "end",
                  paddingBottom: ".4em",
                }}
              >
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={() => onResetContact()}
                >
                  Resetear
                </Button>
              </div>
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
                          Recepción de emails en tiempo real
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
