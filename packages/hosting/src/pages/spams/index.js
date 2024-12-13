import React, { useState } from "react";
import {
  Button,
  Col,
  IconAction,
  List,
  Modal,
  modalConfirm,
  notification,
  Row,
  Tag,
  Typography,
} from "../../components/ui";
import { useGlobalData } from "../../providers";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { SpamIntegration } from "./spamForms/SpamForm";
import { addSpam, updateSpam } from "../../firebase/collections";
import { useDefaultFirestoreProps } from "../../hooks";
import { Alert } from "antd";

const { Title, Text } = Typography;

export const Spams = () => {
  const { spams } = useGlobalData();
  const { assignCreateProps, assignDeleteProps } = useDefaultFirestoreProps();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const onIsModalVisible = (isModalVisible = false) =>
    setIsModalVisible(isModalVisible);

  const onDeleteSpam = async (spamId) => {
    try {
      await updateSpam(spamId, assignDeleteProps({ isDeleted: true }));
      notification({ type: "success" });
    } catch (error) {
      notification({ type: "error" });
    }
  };

  const onConfirmRemoveSpam = (spamId) =>
    modalConfirm({
      onOk: () => onDeleteSpam(spamId),
    });

  const onAddSpam = async (spamData) => {
    await addSpam(assignCreateProps(spamData));
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title level={3}>Correos Spam</Title>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Agregar Spam
        </Button>
      </Col>
      <Col span={24}>
        <Alert
          type="info"
          showIcon
          message="Agregar los correos o numeros que quieres bloquear para que no puedan enviar correos."
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
                description={<Text>{spam?.value}</Text>}
              />
            </List.Item>
          )}
        />
      </Col>

      <Modal
        title="Agregar Spam"
        open={isModalVisible}
        onCancel={() => onIsModalVisible(false)}
        footer={null}
      >
        <SpamIntegration
          onAddSpam={onAddSpam}
          onIsModalVisible={onIsModalVisible}
        />
      </Modal>
    </Row>
  );
};
