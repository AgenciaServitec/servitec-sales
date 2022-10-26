import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import List from "antd/lib/list";
import Image from "antd/lib/image";
import Divider from "antd/lib/divider";
import Typography from "antd/lib/typography";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, IconAction } from "../../components/ui";
import { useDevice } from "../../hooks";
import { useGlobalData } from "../../providers";
import { useNavigate } from "react-router";
import styled, { css } from "styled-components";
import { capitalize } from "lodash";

const { Title, Text } = Typography;

export const ClientsIntegration = () => {
  const { isMobile } = useDevice();
  const navigate = useNavigate();

  const { clients } = useGlobalData();

  const navigateTo = (clientId) => {
    const url = `/clients/${clientId}`;

    navigate(url);
  };

  const onAddClient = () => navigateTo("new");

  const onEditClient = (client) => navigateTo(client.id);

  return (
    <Clients
      isMobile={isMobile}
      clients={clients}
      onAddClient={onAddClient}
      onEditClient={onEditClient}
    />
  );
};

const Clients = ({ isMobile, clients, onAddClient, onEditClient }) => {
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
                  onClick={() => console.log("Remove")}
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
                  <Image
                    src={client?.logo?.thumbUrl}
                    width={170}
                    height={100}
                    style={{ objectFit: "contain" }}
                    alt="company logo"
                  />
                }
                title={
                  <h3 className="link-color" onClick={() => {}}>
                    {client.name}
                  </h3>
                }
                description={
                  <DescriptionWrapper color={client.color}>
                    <div className="item">
                      <Text className="item-text">Email receptor: </Text>
                      <Text strong>{client.receptorEmail}</Text>
                    </div>
                    <div className="item">
                      <Text className="item-text">Emails copy receptores:</Text>
                      <Text strong>{client.receptorEmailsCopy}</Text>
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
