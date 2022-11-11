import React, { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Select from "antd/lib/select";
import Text from "antd/lib/typography/Text";
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
import useSound from "use-sound";
import { ContactSound } from "../../multimedia";
import { DatePicker } from "../../components/ui";
import moment from "moment";

export const Contacts = () => {
  const navigate = useNavigate();
  const { isMobile } = useDevice();

  const { authUser } = useAuthentication();
  const {
    contacts,
    loadingContacts,
    startDate,
    endDate,
    onSetStartDate,
    onSetEndDate,
  } = useContacts();
  const { clients } = useGlobalData();

  const [play] = useSound(ContactSound);

  const [status, setStatus] = useQueryString("status", "pending");
  const [clientId, setClientId] = useQueryString("clientId", "all");

  const [contact, setContact] = useState(null);
  const [searchDataForm, setSearchDataForm] = useState([]);
  const [isVisibleDrawerContact, setIsVisibleDrawerContact] = useState(false);

  const playToSound = () => play();

  useEffect(() => {
    authUser && contacts && playToSound();
  }, [contacts]);

  const lastContact = orderBy(contacts, "createAt", "desc")[0];

  const navigateWithBlankTo = (url) => window.open(url, "_blank");

  const navigateTo = (url) => navigate(url);

  const onOpenDrawerContact = () => setIsVisibleDrawerContact(true);
  const onCloseDrawerContact = () => setIsVisibleDrawerContact(false);

  const viewContacts = () => {
    const result = contacts
      .filter((contact) => contact.status === status)
      .filter((contact) =>
        clientId === "all" ? true : contact.clientId === clientId
      )
      .filter((contact) =>
        searchDataForm.length >= 1
          ? contact.searchData.some((word) =>
              includes(formatWords(searchDataForm), formatWord(word))
            )
          : true
      );

    return orderBy(result, ["createAt"], ["desc"]);
  };

  const onResetContact = () => setSearchDataForm([]);

  const handleSearchDataFormChange = (value) => setSearchDataForm(value);
  const handleStartDateChange = (value) =>
    onSetStartDate(moment(value).format("YYYY-MM-DD"));
  const handleEndDateChange = (value) =>
    onSetEndDate(moment(value).format("YYYY-MM-DD"));

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={5}>
            Total contactos: {viewContacts()?.length || 0}
          </Title>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <DatePicker
            label="Fecha inicio"
            animation
            placeholder="Ingrese fecha"
            defaultValue={startDate}
            onChange={handleStartDateChange}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <DatePicker
            label="Fecha final"
            animation
            placeholder="Ingrese fecha"
            defaultValue={endDate}
            onChange={handleEndDateChange}
          />
        </Col>
        <Col span={24}>
          <FiltersContact
            onSetStatus={setStatus}
            onSetClientId={setClientId}
            status={status}
            clientId={clientId}
            clients={clients}
            authUser={authUser}
          />
        </Col>
        <Col span={24}>
          <Row gutter={[16, 15]}>
            <Col xs={24} sm={17} md={20}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Select
                  placeholder="Ingrese datos de busqueda"
                  mode="tags"
                  size="large"
                  value={searchDataForm || null}
                  onChange={handleSearchDataFormChange}
                  style={{ width: "100%" }}
                />
                <div>
                  <div>
                    <Text>
                      Puedes realizar la busqueda con los siguientes datos:
                      nombres, apellidos, teléfono, email, f.creación, hostname
                    </Text>
                  </div>
                  <div>
                    <Text keyboard>
                      Ejemplo: noel, moriano, 931136482, noel@gmail.com,
                      2022-12-30
                    </Text>
                  </div>
                </div>
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
                      contacts={viewContacts()}
                      isMobile={isMobile}
                      clients={clients}
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
