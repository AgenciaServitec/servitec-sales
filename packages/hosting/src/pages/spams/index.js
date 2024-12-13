import React from "react";
import {
  Button,
  Col,
  IconAction,
  List,
  modalConfirm,
  notification,
  Row,
  Tag,
  Typography,
} from "../../components/ui";
import { ModalProvider, useGlobalData, useModal } from "../../providers";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { AddSpamsIntegration } from "./AddSpams";
import { deleteSpam } from "../../firebase/collections";
import { useDevice } from "../../hooks";
import { Alert } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export const SpamsIntegration = () => {
  const { spams } = useGlobalData();

  const onDeleteSpam = async (spamId) => {
    try {
      await deleteSpam(spamId);
      notification({ type: "success" });
    } catch (error) {
      console.error("errorDeleteSpam: ", error);
      notification({ type: "error" });
    }
  };

  const onConfirmRemoveSpam = (spamId) =>
    modalConfirm({
      onOk: async () => await onDeleteSpam(spamId),
    });

  return (
    <ModalProvider>
      <Spams spams={spams} onConfirmRemoveSpam={onConfirmRemoveSpam} />
    </ModalProvider>
  );
};

const Spams = ({ spams, onConfirmRemoveSpam }) => {
  const { isMobile } = useDevice();
  const { onShowModal, onCloseModal } = useModal();

  const onShowModalAddSpam = () => {
    return onShowModal({
      title: "Add spam",
      width: `${isMobile ? "100%" : "50%"}`,
      onRenderBody: () => <AddSpamsIntegration onCloseModal={onCloseModal} />,
    });
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={3}>Correos y teléfonos spam</Title>
        <Button
          type="primary"
          size="large"
          onClick={() => onShowModalAddSpam()}
          icon={<FontAwesomeIcon icon={faPlus} />}
        >
          Agregar spam
        </Button>
      </Col>
      <Col span={24}>
        <Alert
          type="info"
          showIcon
          message="Agregar los correos o teléfonos que quieres bloquear para que no puedan enviar correos."
        />
      </Col>
      <Col span={24}>
        <List
          itemLayout="horizontal"
          dataSource={spams}
          renderItem={(spam) => (
            <List.Item
              actions={[
                <IconAction
                  key="delete"
                  tooltipTitle="Eliminar"
                  icon={faTrash}
                  styled={{ color: (theme) => theme.colors.error }}
                  onClick={() => onConfirmRemoveSpam(spam.id)}
                />,
              ]}
            >
              <List.Item.Meta
                title={
                  <Tag color={spam?.type === "phone" ? "blue" : "red"}>
                    {spam?.type === "phone" ? "Teléfono" : "Email"}
                  </Tag>
                }
                description={
                  <div>
                    <div>
                      <Text>{spam?.value}</Text>
                    </div>
                    <Text ellipsis suffix="...">
                      <span style={{ fontSize: 11 }}>
                        F. creación:{" "}
                        {dayjs(spam.createAt.toDate()).format(
                          "dddd DD MMMM YYYY HH:mm A"
                        )}
                      </span>
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};
