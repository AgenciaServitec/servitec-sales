import React, { useEffect, useState } from "react";
import { firestore, querySnapshotToArray } from "../../firebase";
import Title from "antd/es/typography/Title";
import { Divider, Tabs } from "antd";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { Form, Input, notification } from "../../components/ui";
import Button from "antd/lib/button";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Text from "antd/lib/typography/Text";
import { defaultTo, orderBy, toLower } from "lodash";
import { useDevice, useFormUtils } from "../../hooks";
import { useNavigate } from "react-router";
import {
  ContactInBubbles,
  ContactInList,
  DrawerUserInformation,
} from "../../components/pages";
import useSound from "use-sound";
import { ContactSound } from "../../multimedia";

export const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState(null);

  const [loadingContacts, setLoadingContacts] = useState(true);
  const [isVisibleDrawerContact, setIsVisibleDrawerContact] = useState(false);

  const [play] = useSound(ContactSound);

  const navigate = useNavigate();
  const { isMobile } = useDevice();

  const schema = yup.object({
    searchDataForm: yup.string().required(),
  });

  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { required, error } = useFormUtils({ errors, schema });

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
        playToSound();
      });
  };

  const onSubmitFetchContacts = async (formData) => {
    try {
      setLoadingContacts(true);

      const searchData = formData.searchDataForm
        .split(",")
        .map((string) => toLower(string.trim()));

      await firestore
        .collection("contacts")
        .where("searchData", "array-contains-any", searchData)
        .onSnapshot((snapshot) => {
          const contactsData = querySnapshotToArray(snapshot);
          setContacts(contactsData);
          setLoadingContacts(false);
        });
    } catch (e) {
      console.log("search:", e);
      notification({ type: "error" });
    } finally {
      setLoadingContacts(false);
    }
  };

  const onResetContact = () => {
    reset({
      searchDataForm: "",
    });

    return fetchContacts();
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
          <Title level={3}>Contactos recibidos</Title>
        </Col>
        <Col span={24}>
          <Form onSubmit={handleSubmit(onSubmitFetchContacts)}>
            <Row gutter={[16, 15]}>
              <Col span={24}>
                <Controller
                  name="searchDataForm"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value, name } }) => (
                    <Input
                      label="Ingrese datos de busqueda"
                      size="large"
                      name={name}
                      value={value}
                      onChange={onChange}
                      error={error(name)}
                      required={required(name)}
                    />
                  )}
                />
                <br />
                <div>
                  <Text>
                    Puedes realizar la busqueda con los siguientes datos,
                    separados por comas (,): nombres, apellidos, teléfono,
                    email, f.creación, hostname, status
                  </Text>
                </div>
                <div>
                  <Text keyboard>
                    Ejemplo: noel, moriano, 931136482, noel@gmail.com,
                    01/12/2022, alvillantas.com, pending
                  </Text>
                </div>
              </Col>
              <Col span={24}>
                <Wrapper>
                  <Button
                    type="default"
                    size="large"
                    onClick={() => onResetContact()}
                    loading={loadingContacts}
                    disabled={loadingContacts}
                  >
                    Resetear
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={loadingContacts}
                    disabled={loadingContacts}
                  >
                    Buscar
                  </Button>
                </Wrapper>
              </Col>
            </Row>
          </Form>
        </Col>
        <Divider />
        <Col span={24}>
          <Title level={5}>
            Total contactos: {defaultTo(contacts, []).length}
          </Title>
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

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  grid-gap: 1rem;
`;
