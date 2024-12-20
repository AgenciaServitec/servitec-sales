import React, { useEffect, useState } from "react";
import { useDevice } from "../../hooks";
import { ModalProvider, useAuthentication, useModal } from "../../providers";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  Button,
  Col,
  Flex,
  IconAction,
  List,
  modalConfirm,
  notification,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
  Tooltip,
} from "../../components/ui";
import VirtualList from "rc-virtual-list";
import { orderBy } from "lodash";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsSpin,
  faEnvelope,
  faPaperPlane,
  faPlus,
  faTerminal,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { AddWebsitesIntegration } from "./AddWebsites";
import dayjs from "dayjs";
import {
  deleteWeb,
  settingsRef,
  updateSetting,
  websRef,
} from "../../firebase/collections";
import {
  useApiResendMailReviewAllWebsitesPost,
  useApiReviewAllWebsitesPost,
  useApiReviewWebsitePost,
} from "../../api";
import { webStatus } from "../../data-list";
import { AddEmailsIntegration } from "./AddEmails";

const { Text } = Typography;

export const ReviewWebsitesIntegration = () => {
  const { isMobile } = useDevice();
  const { authUser } = useAuthentication();
  const {
    postReviewAllWebsites,
    postReviewAllWebsitesLoading,
    postReviewAllWebsitesResponse,
  } = useApiReviewAllWebsitesPost();
  const {
    postReviewWebsite,
    postReviewWebsiteLoading,
    postReviewWebsiteResponse,
  } = useApiReviewWebsitePost();
  const {
    postResendMailReviewAllWebsites,
    postResendMailReviewAllWebsitesLoading,
    postResendMailReviewAllWebsitesResponse,
  } = useApiResendMailReviewAllWebsitesPost();

  const [settings, settingsLoading, settingsError] = useDocumentData(
    authUser ? settingsRef.doc("default") : null
  );
  const [webs = [], websLoading, websError] = useCollectionData(
    authUser ? websRef : null
  );

  useEffect(() => {
    (websError || settingsError) && notification({ type: "error" });
  }, [websError, settingsError]);

  const onConfirmRemoveWeb = (web) =>
    modalConfirm({
      content: "La web se eliminara",
      onOk: async () => {
        await deleteWeb(web.id);

        notification({
          type: "success",
        });
      },
    });

  const onRunReviewAllWebsites = async () => {
    try {
      await postReviewAllWebsites();

      if (!postReviewAllWebsitesResponse.ok) throw new Error("error_in_server");

      const isCounterOlderOrEqual = settings.reviewAllWebsites.count >= 2;

      await updateSetting("default", {
        reviewAllWebsites: {
          ...settings.reviewAllWebsites,
          count: isCounterOlderOrEqual
            ? 2
            : settings.reviewAllWebsites.count + 1,
        },
      });

      notification({ type: "success" });
    } catch (e) {
      console.error("errorRunReviewAllWebsites: ", e);
      notification({ type: "error" });
    }
  };

  const onRunReviewWebsite = async (webId) => {
    try {
      await postReviewWebsite(webId);

      if (!postReviewWebsiteResponse.ok) throw new Error("error_in_server");

      notification({ type: "success" });
    } catch (e) {
      console.error("errorRunReviewWebsite: ", e);
      notification({ type: "error" });
    }
  };

  const onConfirmRunReviewWebsite = (webId) =>
    modalConfirm({
      title: "¿Seguro que quieres ejecutar la revisión de todas las webs?",
      onOk: async () => await onRunReviewAllWebsites(webId),
    });

  const onConfirmResendMailReviewAllWebsites = async () =>
    modalConfirm({
      title: "¿Estás seguro de que quieres reenviar el correo?",
      onOk: async () => {
        try {
          await postResendMailReviewAllWebsites();

          if (!postResendMailReviewAllWebsitesResponse.ok)
            throw new Error("error_in_server");

          notification({ type: "success" });
        } catch (e) {
          console.error("errorResendReviewAllWebsites: ", e);
          notification({ type: "error" });
        }
      },
    });

  const loading = settingsLoading || websLoading;

  return (
    <ModalProvider>
      <Spin spinning={loading}>
        <ReviewWebsites
          isMobile={isMobile}
          webs={webs}
          websLoading={websLoading}
          settings={settings}
          onConfirmRemoveWeb={onConfirmRemoveWeb}
          onRunReviewAllWebsites={onConfirmRunReviewWebsite}
          webVerifiedLoading={postReviewAllWebsitesLoading}
          onRunReviewWebsite={onRunReviewWebsite}
          postReviewWebsiteLoading={postReviewWebsiteLoading}
          onConfirmResendMailReviewAllWebsites={
            onConfirmResendMailReviewAllWebsites
          }
          postResendMailReviewAllWebsitesLoading={
            postResendMailReviewAllWebsitesLoading
          }
        />
      </Spin>
    </ModalProvider>
  );
};

const ReviewWebsites = ({
  isMobile,
  webs,
  websLoading,
  settings,
  onConfirmRemoveWeb,
  onRunReviewAllWebsites,
  webVerifiedLoading,
  onRunReviewWebsite,
  postReviewWebsiteLoading,
  onConfirmResendMailReviewAllWebsites,
  postResendMailReviewAllWebsitesLoading,
}) => {
  const [websiteSelected, setWebsiteSelected] = useState(null);
  const { onShowModal, onCloseModal } = useModal();

  const websView = webs;

  const onShowAddWebComponent = (web = null) => {
    onShowModal({
      title: "Web",
      width: `${isMobile ? "100%" : "50%"}`,
      onRenderBody: () => (
        <AddWebsitesIntegration key={web?.id} onCloseModal={onCloseModal} />
      ),
    });
  };

  const onShowAddEmailsComponent = () => {
    onShowModal({
      title: "Emails",
      width: `${isMobile ? "100%" : "50%"}`,
      onRenderBody: () => <AddEmailsIntegration onCloseModal={onCloseModal} />,
    });
  };

  const websByStatus = (status) => webs.filter((web) => web.status === status);

  const statusPriority = { down: 0, with_problems: 1, rate_limited: 2, up: 3 };

  const listPagesByStatus = Object.entries(webStatus).map(([key, value]) => ({
    ...value,
    status: key,
    quantity: websByStatus(key).length,
  }));

  return (
    <Container>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Flex justify="space-between" wrap="wrap" gap={16}>
            <Space>
              <Button
                type="primary"
                size="large"
                icon={<FontAwesomeIcon icon={faPlus} />}
                onClick={() => onShowAddWebComponent()}
              >
                Agregar web
              </Button>
            </Space>
            <Flex vertical gap={3}>
              <Button
                type="primary"
                danger
                icon={<FontAwesomeIcon icon={faTerminal} />}
                onClick={onRunReviewAllWebsites}
                loading={webVerifiedLoading}
                disabled={settings?.reviewAllWebsites.count >= 2}
              >
                Ejecutar revision de webs
              </Button>
              <span style={{ fontSize: ".8em" }}>
                <strong>{settings?.reviewAllWebsites.count}/2</strong>: Hasta 2
                ejecuciones por día
              </span>
            </Flex>
          </Flex>
        </Col>
        <Col span={24}>
          <Flex justify="space-between" wrap="wrap" gap={10}>
            <Flex gap={7} wrap="wrap">
              <Button
                type="primary"
                icon={<FontAwesomeIcon icon={faEnvelope} />}
                onClick={() => onShowAddEmailsComponent()}
              >
                Emails
              </Button>
              <Button
                type="primary"
                icon={<FontAwesomeIcon icon={faPaperPlane} />}
                onClick={() => onConfirmResendMailReviewAllWebsites()}
                loading={postResendMailReviewAllWebsitesLoading}
              >
                Renviar reporte por correo
              </Button>
            </Flex>
            <Flex
              justify="space-between"
              wrap="wrap"
              className="websites-status"
            >
              {orderBy(
                listPagesByStatus,
                [(web) => statusPriority[web.status]],
                ["asc"]
              ).map((web) => (
                <Tooltip
                  title={web.description}
                  color={web.color}
                  key={web.status}
                >
                  <div className="item" key={web.status}>
                    <div className="item-count">
                      <strong>{web?.quantity || 0}</strong>{" "}
                      <ItemCheck status={web.status} size="1.3em">
                        <FontAwesomeIcon icon={web.icon} size="sm" />
                      </ItemCheck>
                    </div>
                    <span className="item-label">{web?.label}</span>
                  </div>
                </Tooltip>
              ))}
            </Flex>
          </Flex>
        </Col>
        <Col span={24}>
          <Text>
            <strong>{websView.length}</strong> Resultados
          </Text>
        </Col>
        <Col span={24}>
          <List itemLayout={isMobile ? "vertical" : "horizontal"}>
            <VirtualList
              data={orderBy(
                websView,
                [(web) => statusPriority[web.status]],
                ["asc"]
              )}
              height={600}
              itemHeight={47}
              loading={websLoading}
              itemKey="list-webs"
            >
              {(web) => (
                <List.Item key={web.id}>
                  <List.Item.Meta
                    avatar={
                      <ItemCheck status={web?.status}>
                        <FontAwesomeIcon
                          icon={webStatus?.[web?.status]?.icon}
                          className="icon"
                        />
                      </ItemCheck>
                    }
                    title={
                      <a
                        className="link-color"
                        href={web?.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {web?.url}
                      </a>
                    }
                    description={
                      <div className="item-list">
                        <div>
                          <div>
                            <Tag color={webStatus?.[web?.status]?.color}>
                              {webStatus?.[web?.status]?.label}
                            </Tag>
                          </div>
                          <Text ellipsis suffix="...">
                            <span style={{ fontSize: 11 }}>
                              Ult. actualización:{" "}
                              {dayjs(web.updateAt.toDate()).format(
                                "dddd DD MMMM YYYY HH:mm A"
                              )}
                            </span>
                          </Text>
                        </div>
                        <div className="actions">
                          {postReviewWebsiteLoading &&
                          web.id === websiteSelected?.id ? (
                            <Spin size="middle" />
                          ) : (
                            <IconAction
                              key="review-website"
                              data-testid="review-website"
                              onClick={() => {
                                setWebsiteSelected(web);
                                return onRunReviewWebsite(web.id);
                              }}
                              icon={faArrowsSpin}
                              tooltipTitle="Revisar sitio web"
                              styled={{
                                color: () => "purple",
                              }}
                            />
                          )}
                          <IconAction
                            key="delete"
                            data-testid="delete"
                            onClick={() => onConfirmRemoveWeb(web)}
                            icon={faTrash}
                            styled={{
                              color: (theme) => theme.colors.error,
                            }}
                          />
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            </VirtualList>
          </List>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.section`
  .websites-status {
    display: flex;
    align-items: center;
    gap: 2em;
    border: 1px solid ${({ theme }) => theme.colors.gray};
    border-radius: 0.7em;
    padding: 0.6em 1em;
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3em;
      .item-count {
        display: flex;
        align-items: center;
        gap: 0.5em;
        font-size: 0.85em;
      }
      .item-label {
        font-size: 0.7em;
      }
    }
  }

  .item-list {
    display: grid;
    grid-template-columns: 1fr auto;

    .actions {
      display: flex;
    }
  }
`;

const ItemCheck = styled.div`
  width: ${({ size = "1.7em" }) => size};
  height: ${({ size = "1.7em" }) => size};
  background: ${({ status }) => webStatus?.[status]?.color};
  color: #fff;
  border-radius: 50%;
  display: grid;
  place-items: center;
  .icon {
    font-size: 0.9em;
  }
`;
