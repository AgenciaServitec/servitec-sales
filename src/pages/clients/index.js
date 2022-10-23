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
import styled from "styled-components";

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
                    src="https://firebasestorage.googleapis.com/v0/b/sendingemails-348505.appspot.com/o/resources%2Fservitec-logo.png?alt=media&token=340821f3-43eb-4002-8780-4cb8c6b4e99c"
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
                  "ASDSADADSAD"
                  /*<DescriptionWrapper>
                    <div className="item">
                      <Text className="item-text">Name: </Text>
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
                      >{`${contact?.phone?.countryCode} ${contact?.phone?.number}`}</Text>
                    </div>
                    {contact?.issue && (
                      <div className="item">
                        <Text className="item-text">Asunto: </Text>
                        <Text strong>{contact.issue}</Text>
                      </div>
                    )}
                    {contact?.message && (
                      <div className="item">
                        <Text className="item-text">Mensaje: </Text>
                        <Text strong>{contact.message}</Text>
                      </div>
                    )}
                    {contact?.createAt && (
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
                        <TagHostname contact={contact} />
                      </Text>
                    </div>
                  </DescriptionWrapper>*/
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
  display: grid;
  grid-row-gap: 0.3rem;
  justify-content: flex-start;
  .item {
    .item-text {
      color: ${({ theme }) => theme.colors.heading};
    }
  }
`;
