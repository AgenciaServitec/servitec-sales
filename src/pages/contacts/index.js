import React, { useEffect, useState } from "react";
import { firestore, querySnapshotToArray } from "../../firebase";
import Title from "antd/es/typography/Title";
import { Divider, List, Skeleton, Tag } from "antd";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { Form, IconAction, Input, notification } from "../../components/ui";
import Button from "antd/lib/button";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Text from "antd/lib/typography/Text";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  capitalize,
  defaultTo,
  orderBy,
  startCase,
  toLower,
  toUpper,
} from "lodash";
import { useDevice, useFormUtils, useGenerateRandomColor } from "../../hooks";
import moment from "moment";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router";

export const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  const history = useHistory();
  const { isMobile } = useDevice();
  const { color } = useGenerateRandomColor();

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
    await firestore.collection("contacts").onSnapshot((snapshot) => {
      const contactsData = querySnapshotToArray(snapshot);
      setContacts(contactsData);
      setLoadingContacts(false);
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

  const navigateWithBlankTo = (url) => window.open(url, "_blank");

  const navigateTo = (url) => history.push(url);

  const viewContacts = () => orderBy(contacts, ["createAt"], ["desc"]);

  return (
    <Row gutter={[16, 16]}>
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
              <Text>
                Puedes realizar la busqueda con los siguientes datos, separados
                por comas (,): nombres, apellidos, teléfono, email, f.creación,
                hostname, status
              </Text>
              <br />
              <Text keyboard>
                Ejemplo: noel, moriano, 931136482, noel@gmail.com, 01/12/2022,
                alvillantas.com, pending
              </Text>
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
        <Skeleton avatar loading={loadingContacts} active>
          <List
            className="demo-loadmore-list"
            itemLayout={isMobile ? "vertical" : "horizontal"}
            loadMore={loadingContacts}
            dataSource={viewContacts()}
            renderItem={(contact) => (
              <List.Item
                actions={[
                  <IconAction
                    key={contact.id}
                    onClick={() =>
                      navigateWithBlankTo(
                        `https://wa.me/+51${contact.phoneNumber}`
                      )
                    }
                    size={65}
                    style={{ color: "#65d844" }}
                    tooltipTitle="Whatsapp"
                    icon={faWhatsapp}
                  />,
                  <IconAction
                    key={contact.id}
                    onClick={() =>
                      navigateWithBlankTo(`mailto:${contact.email}`)
                    }
                    size={65}
                    tooltipTitle="Email"
                    styled={{ color: (theme) => theme.colors.error }}
                    icon={faEnvelope}
                  />,
                  <IconAction
                    key={contact.id}
                    onClick={() =>
                      navigateWithBlankTo(`tel:${contact.phoneNumber}`)
                    }
                    size={55}
                    style={{ color: "#0583ea" }}
                    tooltipTitle="Teléfono"
                    icon={faPhone}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <ContactPicture
                      onClick={() => navigateTo(`/contacts/${contact.id}`)}
                      background={toUpper(
                        `#${Math.round(
                          Math.random() + contact.firstName.length
                        )}${color.slice(-5)}`
                      )}
                    >
                      {toUpper(contact.firstName.split("")[0])}
                    </ContactPicture>
                  }
                  title={
                    <h2
                      className="link-color"
                      onClick={() => navigateTo(`/contacts/${contact.id}`)}
                    >
                      {startCase(
                        capitalize(`${contact.firstName} ${contact.lastName}`)
                      )}
                    </h2>
                  }
                  description={
                    <DescriptionWrapper>
                      <div className="item">
                        <Text className="item-text">Nombres: </Text>
                        <Text strong>{capitalize(contact.firstName)}</Text>
                      </div>
                      <div className="item">
                        <Text className="item-text">Apellidos: </Text>
                        <Text strong>{capitalize(contact.lastName)}</Text>
                      </div>
                      <div className="item">
                        <Text className="item-text">Email: </Text>
                        <Text strong>{contact.email}</Text>
                      </div>
                      <div className="item">
                        <Text className="item-text">Teléfono: </Text>
                        <Text strong>{contact.phoneNumber}</Text>
                      </div>
                      {contact.issue && (
                        <div className="item">
                          <Text className="item-text">Asunto: </Text>
                          <Text strong>{contact.issue}</Text>
                        </div>
                      )}
                      {contact.message && (
                        <div className="item">
                          <Text className="item-text">Mensaje: </Text>
                          <Text strong>{contact.message}</Text>
                        </div>
                      )}
                      {contact.createAt && (
                        <div className="item">
                          <Text className="item-text">F. creación: </Text>
                          <Text strong>
                            {moment(contact.createAt.toDate()).format(
                              "DD/MM/YYYY HH:mm:ss a"
                            )}
                          </Text>
                        </div>
                      )}
                      <div className="item">
                        <Text className="item-text">Host name: </Text>
                        <Text strong>
                          <a
                            href={
                              contact?.hostname
                                ? `https://${contact.hostname}`
                                : "#"
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Tag
                              color={
                                contact.hostname === "hankookalvillantas.com"
                                  ? "magenta"
                                  : "volcano"
                              }
                            >
                              {contact.hostname || ""}
                            </Tag>
                          </a>
                        </Text>
                      </div>
                    </DescriptionWrapper>
                  }
                />
              </List.Item>
            )}
          />
        </Skeleton>
      </Col>
    </Row>
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

const ContactPicture = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: ${({ background }) => background || "red"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  color: #fff;
  cursor: pointer;
`;

const DescriptionWrapper = styled.div`
  display: grid;
  grid-row-gap: 0.3rem;
  justify-content: flex-start;
  .item {
    .item-text {
      color: ${({ theme }) => theme.colors.heading};
    }
  }
`;
