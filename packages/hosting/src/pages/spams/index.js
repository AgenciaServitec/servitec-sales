import React, { useState } from "react";
import { Row, Col, List, Typography, Button, Modal, notification } from "antd";
import { IconAction, modalConfirm} from "../../components/ui";
import { useGlobalData } from "../../providers";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {SpamForm} from "./spamForms/SpamForm";

const { Title, Text } = Typography;

export const Spams = () => {
    const { spams, addSpam, removeSpam } = useGlobalData();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const onDeleteSpam = async(spamId) => {
        try {
            await removeSpam(spamId);
            notification.success({ message: "Spam eliminado correctamente!" });
        } catch (error) {
            notification.error({ message: "Error al eliminar spam." });
        }
    };

    const onConfirmRemoveSpam = (spamId) =>
        modalConfirm({
            content: "¿Estás seguro de que deseas eliminar este spam?",
            onOk: () => onDeleteSpam(spamId),
        });

    const handleAddSpam = (spamData) => {
        addSpam(spamData);
        setIsModalVisible(false);
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
                                    onClick={() => onConfirmRemoveSpam(spam.id)}
                                />,
                            ]}
                        >
                            <List.Item.Meta
                                title={<Text>{spam.email.join(', ')}</Text>} // Muestra todos los correos
                                description={<Text>{spam.phone.join(', ')}</Text>} // Muestra todos los teléfonos
                            />
                        </List.Item>
                    )}
                />
            </Col>

            {/* Modal para agregar spam */}
            <Modal
                title="Agregar Spam"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <SpamForm onSubmit={handleAddSpam} />
            </Modal>
        </Row>
    );
};
