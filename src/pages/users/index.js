import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Typography from "antd/lib/typography";
import List from "antd/lib/list";
import Tag from "antd/lib/tag";
import { Button, IconAction, modalConfirm } from "../../components/ui";
import { Divider } from "antd";
import { useGlobalData } from "../../providers";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { firestore } from "../../firebase";
import { useNavigate } from "react-router";
import { useDevice } from "../../hooks";

const { Title, Text } = Typography;

export const Users = () => {
  const { users } = useGlobalData();
  const { isMobile } = useDevice();
  const navigate = useNavigate();

  const navigateTo = (userId) => {
    const url = `/users/${userId}`;

    navigate(url);
  };

  const onAddUser = () => navigateTo("new");

  const onEditUser = (client) => navigateTo(client.id);

  const onRemoveUser = async (user) =>
    await firestore
      .collection("users")
      .doc(user.id)
      .set({ isDeleted: true }, { merge: true });

  const onConfirmRemoveUser = (client) =>
    modalConfirm({
      content: "El usuario se eliminara",
      onOk: () => {
        onRemoveUser(client);
      },
    });

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Button type="primary" disabled={true} onClick={() => onAddUser()}>
          Agregar usuario
        </Button>
      </Col>
      <Divider />
      <Col span={24}>
        <Title level={3}>Usuarios</Title>
      </Col>
      <Col span={24}>
        <List
          className="demo-loadmore-list"
          itemLayout={isMobile}
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              actions={[
                <IconAction
                  key={user.id}
                  tooltipTitle="Editar"
                  icon={faEdit}
                  onClick={() => onEditUser(user)}
                />,
                <IconAction
                  key={user.id}
                  tooltipTitle="Eliminar"
                  styled={{ color: (theme) => theme.colors.error }}
                  icon={faTrash}
                  onClick={() => onConfirmRemoveUser(user)}
                />,
              ]}
            >
              <List.Item.Meta
                title={<h3 className="link-color">{user.email}</h3>}
                description={
                  <>
                    <div>
                      <Text>{`${user?.firstName} ${user?.lastName}`}</Text>
                    </div>
                    <div>
                      <Text>
                        Rol: <Tag color="blue">{`${user?.roleCode}`}</Tag>
                      </Text>
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};
