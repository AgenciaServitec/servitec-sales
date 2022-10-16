import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Col, Divider, Drawer, Row, Switch } from "antd";
import styled from "styled-components";
import { Button, Form, modalConfirm, notification } from "../../ui";
import { mediaQuery } from "../../../styles";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Group } from "../../ui/component-container/Group";
import moment from "moment";
import { firestore } from "../../../firebase";

export const DrawerUserInformation = ({
  isVisibleDrawerRight,
  onSetIsVisibleDrawerRight,
  contact,
}) => {
  const [statusType, setStatusType] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  const schema = yup.object({
    status: yup.bool(),
  });

  const { handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const resetStatusType = () => setStatusType(false);

  const onSubmitSaveContact = async () => {
    try {
      setSavingContact(true);

      await modalConfirm({
        title: "¿Quieres marcar este contacto como atendido?",
        content: "Al aceptar, el contacto desaparecerá de la vista",
        onOk: async () => await onSaveContact(),
      });

      onSetIsVisibleDrawerRight(false);
    } catch (e) {
      console.error("ErrorSaveContact:", e);
      notification({ type: "error" });
    } finally {
      setSavingContact(false);
    }
  };

  const onSaveContact = async () => {
    await firestore
      .collection("contacts")
      .doc(contact.id)
      .set(
        { ...contact, status: statusType ? "attended" : "pending" },
        { merge: true }
      );

    notification({
      type: "success",
    });
  };

  return (
    <ContainerDrawer
      title="Informacion de contacto"
      width={720}
      onClose={() => {
        onSetIsVisibleDrawerRight(!isVisibleDrawerRight);
        resetStatusType();
      }}
      visible={isVisibleDrawerRight}
      bodyStyle={{
        paddingBottom: 80,
      }}
    >
      <Form
        layout="vertical"
        hideRequiredMark
        onSubmit={handleSubmit(onSubmitSaveContact)}
      >
        <Row gutter={[0, 10]}>
          <Col xs={24} sm={12}>
            <ItemDetail>
              <span>Nombres:</span>
              <span>{contact?.firstName || ""}</span>
            </ItemDetail>
          </Col>
          <Col xs={24} sm={12}>
            <ItemDetail>
              <span>Apellidos:</span>
              <span>{contact?.lastName || ""}</span>
            </ItemDetail>
          </Col>
          <Col xs={24} sm={24}>
            <ItemDetail>
              <span>Email:</span>
              <span>{contact?.email || ""}</span>
            </ItemDetail>
          </Col>
          <Col xs={24} sm={12}>
            <ItemDetail>
              <span>Codigo país:</span>
              <span>{contact?.phone.countryCode || ""}</span>
            </ItemDetail>
          </Col>
          <Col xs={24} sm={12}>
            <ItemDetail>
              <span>Número:</span>
              <span>{contact?.phone.number || ""}</span>
            </ItemDetail>
          </Col>
          <Col xs={24} sm={12}>
            <ItemDetail>
              <span>Feccha creación:</span>
              <span>
                {moment(contact?.createAt.toDate()).format(
                  "DD/MM/YYYY HH:mm A"
                ) || ""}
              </span>
            </ItemDetail>
          </Col>
          <Col xs={24} sm={12}>
            <ItemDetail>
              <span>Hostname:</span>
              <span>{contact?.hostname || ""}</span>
            </ItemDetail>
          </Col>
          <Col xs={24} sm={24}>
            <ItemDetail>
              <span>Asunto:</span>
              <span>{contact?.issue || ""}</span>
            </ItemDetail>
          </Col>
          <Col xs={24} sm={24}>
            <ItemDetail>
              <span>Mensaje:</span>
              <span>{contact?.message || ""}</span>
            </ItemDetail>
          </Col>
          <Divider />
          <Col span={24}>
            <Group label="Cliente Respondido">
              <Switch
                onClick={(e) => setStatusType(e)}
                checkedChildren="Si"
                unCheckedChildren="No"
                defaultChecked={false}
                checked={statusType}
              />
            </Group>
          </Col>
          <Col span={24}>
            <Button
              htmlType="submit"
              block
              type="primary"
              disabled={!statusType || savingContact}
            >
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </ContainerDrawer>
  );
};

const ContainerDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    width: 100% !important;
    ${mediaQuery.minTablet} {
      width: 40% !important;
    }
  }
  .site-form-in-drawer-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
    border-top: 1px solid #e9e9e9;
  }
`;

const ItemDetail = styled.div`
  padding: 0.5em 0;
  display: flex;
  flex-direction: column;
  justify-content: start;
  span {
    margin-bottom: -0.2em;
    font-size: 0.7em;
  }
  span:last-child {
    font-size: 1em;
    font-weight: 500;
  }
`;
