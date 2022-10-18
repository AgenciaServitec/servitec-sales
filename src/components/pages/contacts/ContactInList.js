import React, { useEffect, useState } from "react";
import { Divider, List, Skeleton } from "antd";
import { Form, IconAction, Input, notification, TagHostname } from "../../ui";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faCalendarAlt,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { findClientColor } from "../../../utils";
import { capitalize, startCase, toLower, toUpper } from "lodash";
import Text from "antd/lib/typography/Text";
import moment from "moment/moment";
import { darken } from "polished";
import styled, { css } from "styled-components";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import { Controller, useForm } from "react-hook-form";
import Button from "antd/lib/button";
import { firestore, querySnapshotToArray } from "../../../firebase";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { useFormUtils } from "../../../hooks";

export const ContactInList = ({
  contacts,
  isMobile,
  onSetContact,
  onSetTotalContacts,
  onOpenDrawerContact,
  onNavigateWithBlankTo,
  onNavigateTo,
}) => {
  const [contactsContains, setContactsContains] = useState([]);
  const [loadingContactsContains, setLoadingContactsContains] = useState(false);

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

  const onSubmitFetchContacts = async (formData) => {
    try {
      setLoadingContactsContains(true);

      const searchData = formData.searchDataForm
        .split(",")
        .map((string) => toLower(string.trim()));

      await firestore
        .collection("contacts")
        .where("searchData", "array-contains-any", searchData)
        .onSnapshot((snapshot) => {
          const contactsData = querySnapshotToArray(snapshot);
          setContactsContains(contactsData);
          onSetTotalContacts(contactsData.length);
          setLoadingContactsContains(false);
        });
    } catch (e) {
      console.log("search:", e);
      notification({ type: "error" });
    } finally {
      setLoadingContactsContains(false);
    }
  };

  const onResetContact = () => {
    reset({
      searchDataForm: "",
    });
  };

  const viewContactsInList = contacts.concat(contactsContains);

  // const onDeleteContact = async (contactId) => {
  //   await firestore.collection("contacts").doc(contactId).delete();
  // };

  return (
    <>
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
                  separados por comas (,): nombres, apellidos, teléfono, email,
                  f.creación, hostname, status
                </Text>
              </div>
              <div>
                <Text keyboard>
                  Ejemplo: noel, moriano, 931136482, noel@gmail.com, 01/12/2022,
                  alvillantas.com, pending
                </Text>
              </div>
            </Col>
            <Col span={24}>
              <Wrapper>
                <Button
                  type="default"
                  size="large"
                  onClick={() => onResetContact()}
                  loading={loadingContactsContains}
                  disabled={loadingContactsContains}
                >
                  Resetear
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loadingContactsContains}
                  disabled={loadingContactsContains}
                >
                  Buscar
                </Button>
              </Wrapper>
            </Col>
          </Row>
        </Form>
      </Col>
      <Divider />
      <Skeleton avatar loading={loadingContactsContains} active>
        <List
          className="demo-loadmore-list"
          itemLayout={isMobile ? "vertical" : "horizontal"}
          loadMore={loadingContactsContains}
          dataSource={viewContactsInList}
          renderItem={(contact) => (
            <List.Item
              actions={[
                <IconAction
                  key={contact.id}
                  onClick={() =>
                    onNavigateWithBlankTo(
                      `https://wa.me/${contact.phone.countryCode}${contact.phone.number}`
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
                    onNavigateWithBlankTo(`mailto:${contact.email}`)
                  }
                  size={65}
                  tooltipTitle="Email"
                  styled={{ color: (theme) => theme.colors.error }}
                  icon={faEnvelope}
                />,
                <IconAction
                  key={contact.id}
                  onClick={() =>
                    onNavigateWithBlankTo(
                      `tel:${contact?.phone?.countryCode}${contact?.phone?.number}`
                    )
                  }
                  size={55}
                  style={{ color: "#0583ea" }}
                  tooltipTitle="Teléfono"
                  icon={faPhone}
                />,
                <IconAction
                  key={contact.id}
                  onClick={() => onNavigateTo(`/contacts/${contact.id}`)}
                  size={55}
                  style={{ color: "#e7c600" }}
                  tooltipTitle="Time line"
                  icon={faCalendarAlt}
                />,
                // <IconAction
                //   key={contact.id}
                //   onClick={() => onDeleteContact(contact.id)}
                //   size={55}
                //   style={{ color: "#ff0b02" }}
                //   tooltipTitle="Eliminar"
                //   icon={faTrash}
                // />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <ContactPicture
                    onClick={() => {
                      onSetContact(contact);
                      onOpenDrawerContact();
                    }}
                    clientColors={findClientColor(contact.clientCode)}
                  >
                    {toUpper(contact.firstName.split("")[0])}
                  </ContactPicture>
                }
                title={
                  <h2
                    className="link-color"
                    onClick={() => {
                      onSetContact(contact);
                      onOpenDrawerContact();
                    }}
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
                      <Text
                        strong
                      >{`${contact.phone.countryCode} ${contact.phone.number}`}</Text>
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
                    <div className="item">
                      <Text className="item-text">F. creación: </Text>
                      <Text strong>
                        {moment(contact.createAt.toDate()).format(
                          "DD/MM/YYYY HH:mm:ss a"
                        )}
                      </Text>
                    </div>
                    <div className="item">
                      <Text className="item-text">Host name: </Text>
                      <Text strong>
                        <TagHostname contact={contact} />
                      </Text>
                    </div>
                  </DescriptionWrapper>
                }
              />
            </List.Item>
          )}
        />
      </Skeleton>
    </>
  );
};

const ContactPicture = styled.div`
  ${({ clientColors }) => css`
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    border: 2px solid ${darken(0.08, clientColors?.bg || "#c4c4c4")};
    color: ${({ clientColors }) => clientColors?.color || "#fff"};
    background: ${({ clientColors }) => clientColors?.bg || "#c4c4c4"};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.5rem;
    cursor: pointer;
  `}
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
