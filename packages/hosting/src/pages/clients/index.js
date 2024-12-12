import React, { useEffect } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import List from "antd/lib/list";
import Image from "antd/lib/image";
import Divider from "antd/lib/divider";
import Typography from "antd/lib/typography";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  IconAction,
  modalConfirm,
  TagHostname,
} from "../../components/ui";
import { useDevice } from "../../hooks";
import { useAuthentication, useGlobalData } from "../../providers";
import { useNavigate } from "react-router";
import styled, { css } from "styled-components";
import { capitalize, isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { fetchCollectionOnce, firestore } from "../../firebase";
import { findColor, newUrl } from "../../utils";
import { deleteWeb, websRef } from "../../firebase/collections";

const { Title, Text } = Typography;

export const ClientsIntegration = () => {
  const { authUser } = useAuthentication();
  const { isMobile } = useDevice();
  const navigate = useNavigate();

  const { clients } = useGlobalData();

  useEffect(() => {
    authUser?.roleCode !== "super_admin" && navigate(-1);
  }, []);

  const navigateTo = (clientId) => {
    const url = `/clients/${clientId}`;

    navigate(url);
  };

  const onAddClient = () => navigateTo("new");

  const onEditClient = (client) => navigateTo(client.id);
  const onDeletedWeb = async (client) => {
    const webs = await fetchCollectionOnce(
      websRef
        .where("url", "==", newUrl(`https://${client.hostname}`).origin)
        .limit(1)
    );

    if (!isEmpty(webs)) {
      await deleteWeb(webs[0].id);
    }
  };

  const onRemoveClient = async (client) => {
    await firestore
      .collection("clients")
      .doc(client.id)
      .set({ isDeleted: true }, { merge: true });

    await onDeletedWeb(client);
  };

  const onConfirmRemoveClient = (client) =>
    modalConfirm({
      content: "El cliente se eliminara",
      onOk: () => onRemoveClient(client),
    });

  return (
    <Clients
      isMobile={isMobile}
      clients={clients}
      onAddClient={onAddClient}
      onEditClient={onEditClient}
      onConfirmRemoveClient={onConfirmRemoveClient}
    />
  );
};

const Clients = ({
  isMobile,
  clients,
  onAddClient,
  onEditClient,
  onConfirmRemoveClient,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Button type="primary" onClick={() => onAddClient()}>
          Agregar cliente (api)
        </Button>
      </Col>
      <Divider />
      <Col span={24}>
        <Title level={3}>Clientes (API)</Title>
      </Col>
      <Col span={24}>
        <List
          className="demo-loadmore-list"
          itemLayout={isMobile ? "vertical" : "horizontal"}
          dataSource={clients}
          renderItem={(client) => (
            <List.Item
              actions={[
                <IconAction
                  key={client.id}
                  tooltipTitle="Editar"
                  icon={faEdit}
                  onClick={() => onEditClient(client)}
                />,
                <IconAction
                  key={client.id}
                  tooltipTitle="Eliminar"
                  styled={{ color: (theme) => theme.colors.error }}
                  icon={faTrash}
                  onClick={() => onConfirmRemoveClient(client)}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Image
                    src={
                      client?.isotipo?.thumbUrl
                        ? client?.isotipo?.thumbUrl
                        : client?.logotipo?.thumbUrl ||
                          "https://firebasestorage.googleapis.com/v0/b/sendingemails-348505.appspot.com/o/resources%2Fimage-not-found.jpg?alt=media&token=35125bc7-a978-4ee0-8d01-d820b79b24b6"
                    }
                    width={150}
                    height={90}
                    style={{ objectFit: "contain" }}
                    alt="company logo"
                  />
                }
                title={
                  <Link to={`/clients/${client.id}`}>
                    <h3 className="link-color">{capitalize(client.name)}</h3>
                  </Link>
                }
                description={
                  <DescriptionWrapper color={client.color}>
                    <div className="item">
                      <Text className="item-text">Email receptor: </Text>
                      <Text strong>{client.receptorEmail}</Text>
                    </div>
                    <div className="item">
                      <Text className="item-text">Hostname: </Text>
                      <TagHostname
                        hostname={client.hostname}
                        clientColors={findColor(client?.id, clients)}
                      />
                    </div>
                    <div className="item">
                      <Text className="item-text">Teléfono: </Text>
                      <Text
                        strong
                      >{`${client.phone.countryCode}${client.phone.number}`}</Text>
                    </div>
                    <div className="item">
                      <div className="item-color" color={client.color} />
                    </div>
                  </DescriptionWrapper>
                }
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};

const DescriptionWrapper = styled.div`
  ${({ color }) => css`
    display: grid;
    grid-row-gap: 0.3rem;
    justify-content: flex-start;
    .item {
      .item-text {
        color: ${({ theme }) => theme.colors.heading};
      }
    }
    .item-color {
      background: ${color};
    }
  `}
`;
