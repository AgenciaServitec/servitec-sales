import React, { useEffect, useState } from "react";
import { useDefaultFirestoreProps, useUserLocation } from "../../../hooks";
import styled, { keyframes } from "styled-components";
import {
  Spinner,
  UserLocationMap,
  notification,
  Col,
  Button,
} from "../../../components";
import {
  addAssistance,
  fetchTodayAssistancesByUserId,
  getAssistancesId,
  updateAssistance,
} from "../../../firebase/collections";
import { ModalProvider, useAuthentication } from "../../../providers";
import dayjs from "dayjs";
import { firestoreTimestamp } from "../../../firebase/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faSignOutAlt,
  faMapMarkerAlt,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

export const AssistanceIntegration = () => {
  const { assignCreateProps } = useDefaultFirestoreProps();
  const { authUser } = useAuthentication();

  const [showCardMessage, setShowCardMessage] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [entryButtonActive, setEntryButtonActive] = useState(false);
  const [outletButtonActive, setOutletButtonActive] = useState(false);
  const [isGeofenceValidate, setIsGeofenceValidate] = useState(false);
  const [assistanceSaved, setAssistanceSaved] = useState(false);

  const navigate = useNavigate();

  const isTodayAssistance = (dateStr) => {
    const date = dayjs(dateStr, "DD-MM-YYYY HH:mm");
    return date.isSame(dayjs(), "day");
  };

  const hasMarkedAssistance = async (type) => {
    if (!authUser) return false;
    const assistances = await fetchTodayAssistancesByUserId(authUser.id);
    return assistances?.some(
      (a) => a?.[type] && isTodayAssistance(a[type]?.date)
    );
  };

  const updateButtonStates = async () => {
    const [entryMarked, outletMarked] = await Promise.all([
      hasMarkedAssistance("entry"),
      hasMarkedAssistance("outlet"),
    ]);

    setEntryButtonActive(!entryMarked && isGeofenceValidate);
    setOutletButtonActive(!outletMarked && entryMarked && isGeofenceValidate);
  };

  useEffect(() => {
    if (assistanceSaved || isGeofenceValidate) {
      updateButtonStates();
    }
  }, [assistanceSaved, isGeofenceValidate, authUser]);

  const buildAssistanceData = (existing, type, date, user) => ({
    ...existing,
    id: existing?.id || getAssistancesId(),
    userId: user?.id,
    createAtString: existing?.createAtString || date,
    entry:
      existing?.entry ||
      (type === "entry"
        ? {
            date,
            dateTimestamp: firestoreTimestamp.now(),
          }
        : null),
    outlet: type === "outlet" && existing?.entry ? { date } : null,
    user: user,
  });

  const onSaveAssistance = async (type) => {
    try {
      const date = dayjs().format("DD-MM-YYYY HH:mm");

      const [alreadyMarked, assistances = []] = await Promise.all([
        hasMarkedAssistance(type),
        fetchTodayAssistancesByUserId(authUser.id),
      ]);

      const existing = assistances.find((a) =>
        isTodayAssistance(a?.createAtString)
      );

      if (alreadyMarked) {
        notification({
          type: "warning",
          message: `Ya ha marcado su ${
            type === "entry" ? "ingreso" : "salida"
          } hoy`,
        });
        return;
      }

      if (!isGeofenceValidate) {
        notification({
          type: "warning",
          description: "No estás dentro de tu lugar de trabajo",
        });
        return;
      }

      const data = buildAssistanceData(existing, type, date, authUser);

      if (type === "entry") {
        await addAssistance(assignCreateProps(data));
      } else {
        await updateAssistance(existing.id, assignCreateProps(data));
      }

      notification({
        type: "success",
        title: `Ha marcado su ${
          type === "entry" ? "entrada" : "salida"
        } correctamente`,
      });

      setMessageType(type);
      setShowCardMessage(true);
      setTimeout(() => setShowCardMessage(false), 4000);
      updateButtonStates();
    } catch (error) {
      console.error("AddAssistanceError:", error);
      notification({ type: "error" });
    } finally {
      setAssistanceSaved(true);
    }
  };

  const onNavigateGoTo = (pathname = "/") => navigate(pathname);

  return (
    <ModalProvider>
      <Assistance
        onSaveAssistance={onSaveAssistance}
        entryButtonActive={entryButtonActive}
        outletButtonActive={outletButtonActive}
        onSetIsGeofenceValidate={setIsGeofenceValidate}
        isGeofenceValidate={isGeofenceValidate}
        showCardMessage={showCardMessage}
        messageType={messageType}
        user={authUser}
        onNavigateGoTo={onNavigateGoTo}
      />
    </ModalProvider>
  );
};

const Assistance = ({
  onSaveAssistance,
  entryButtonActive,
  outletButtonActive,
  onSetIsGeofenceValidate,
  showCardMessage,
  messageType,
  onNavigateGoTo,
}) => {
  const { location, method, loading, error, refreshLocation } = useUserLocation(
    onSetIsGeofenceValidate
  );

  return (
    <Container>
      {loading && <Spinner height="40svh" size="4x" />}
      {error && (
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          <p>{error}</p>
          <button onClick={refreshLocation}>🔄 Reintentar ubicación</button>
        </div>
      )}
      {!location && !loading && !error && (
        <p>No se pudo determinar tu ubicación.</p>
      )}
      <Col span={24}>
        <Button
          onClick={() => onNavigateGoTo("/assistances")}
          type="primary"
          className="btn-assistance"
          size="large"
        >
          <FontAwesomeIcon icon={faSignInAlt} />
          Ver mis Asistencias
        </Button>
      </Col>
      <div className="title-wrapper">
        <FontAwesomeIcon icon={faMapMarkerAlt} /> Registro de Asistencia
      </div>

      <div className="content">
        <div className="left-panel">
          <div className="btn-group">
            <button
              onClick={() => onSaveAssistance("entry")}
              disabled={!entryButtonActive}
              className="entry-btn"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="btn-icon" />
              Marcar Entrada
            </button>

            <button
              onClick={() => onSaveAssistance("outlet")}
              disabled={!outletButtonActive}
              className="outlet-btn"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="btn-icon" />
              Marcar Salida
            </button>
          </div>

          {showCardMessage && (
            <div className={`alert ${messageType}`}>
              ✅ Asistencia marcada:
              {messageType === "entry" ? " Entrada" : " Salida"}
            </div>
          )}

          <div className="icon-animation">
            <FontAwesomeIcon icon={faFaceSmile} />
          </div>
        </div>

        <div className="right-panel">
          <UserLocationMap
            location={location}
            onValidateGeofence={onSetIsGeofenceValidate}
          />
        </div>
      </div>
    </Container>
  );
};

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px 24px;
  min-height: 100vh;
  color: #e0f2fe;
  font-family: "Segoe UI", Roboto, sans-serif;

  .title-wrapper {
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    color: #0f172a;
    margin-bottom: 12px;
  }

  .content {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .left-panel {
    flex: 1;
    min-width: 280px;
    max-width: 400px;
    border: 2px solid rgba(148, 163, 184, 0.2);
    border-radius: 20px;
    padding: 24px;
    backdrop-filter: blur(12px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.4s ease;
  }

  .left-panel:hover {
    transform: translateY(-5px);
  }

  .btn-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  .btn-group button {
    padding: 18px 20px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;
    border: none;
    color: #ffffff;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-transform: uppercase;
  }

  .entry-btn {
    background: linear-gradient(to right, #22c55e, #16a34a);
  }

  .outlet-btn {
    background: linear-gradient(to right, #3b82f6, #2563eb);
  }

  .btn-group button:hover:not(:disabled) {
    transform: scale(1.03);
    filter: brightness(1.1);
  }

  .btn-group button:disabled {
    background: #475569;
    cursor: not-allowed;
    color: #cbd5e1;
  }

  .alert {
    margin-top: 24px;
    padding: 16px;
    font-size: 16px;
    text-align: center;
    font-weight: bold;
    border-radius: 14px;
    animation: fadeIn 0.5s ease-in-out;
    background: rgba(56, 189, 248, 0.1);
    color: black;
  }

  .alert.entry {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }

  .alert.outlet {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }

  .icon-animation {
    display: none;
    margin-top: 32px;
    font-size: 10em;
    color: #3b82f6;
    text-align: center;
    animation: ${pulse} 1.8s infinite;
  }

  .right-panel {
    flex: 2;
    min-width: 400px;
    border-radius: 20px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.15);
    border: 2px solid rgba(148, 163, 184, 0.2);
    color: black;
  }

  @media (min-width: 768px) {
    .icon-animation {
      display: block;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .content {
      flex-direction: column;
      align-items: center;
    }

    .right-panel {
      width: 100%;
      min-width: 0;
    }

    .left-panel {
      min-width: 260px;
      max-width: 100%;
    }
  }

  @media (max-width: 480px) {
    padding: 16px;

    .title-wrapper {
      font-size: 24px;
    }

    .btn-group button {
      font-size: 16px;
      padding: 16px;
    }

    .alert {
      font-size: 14px;
    }
    .left-panel {
      min-width: 200px;
      max-width: 100%;
    }
  }
`;
