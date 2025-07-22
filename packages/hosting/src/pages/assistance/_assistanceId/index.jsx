import React, { useEffect, useState } from "react";
import { useDefaultFirestoreProps, useUserLocation } from "../../../hooks";
import {
  Spinner,
  UserLocationMap,
  notification,
  Row,
  Col,
  Title,
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

export const AssistanceIntegration = () => {
  const { assignCreateProps } = useDefaultFirestoreProps();
  const { authUser } = useAuthentication();

  const [showCardMessage, setShowCardMessage] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [entryButtonActive, setEntryButtonActive] = useState(false);
  const [outletButtonActive, setOutletButtonActive] = useState(false);
  const [isGeofenceValidate, setIsGeofenceValidate] = useState(false);
  const [assistanceSaved, setAssistanceSaved] = useState(false);

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
    authUser: user,
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
          message: "No estás dentro de tu lugar de trabajo",
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
      />
    </ModalProvider>
  );
};
//caca
const Assistance = ({
  onSaveAssistance,
  entryButtonActive,
  outletButtonActive,
  onSetIsGeofenceValidate,
  showCardMessage,
  messageType,
  user,
}) => {
  const { location, method, loading, error } = useUserLocation(
    onSetIsGeofenceValidate
  );

  if (loading) return <Spinner height="40svh" size="4x" />;
  if (error) return <p>Error: {error}</p>;
  if (!location) return <p>No se pudo determinar la ubicación.</p>;

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Title>Registro de Asistencia</Title>
        <p>Ubicación detectada vía {method}</p>
        <UserLocationMap
          location={location}
          onValidateGeofence={onSetIsGeofenceValidate}
        />

        <button
          onClick={() => onSaveAssistance("entry")}
          disabled={!entryButtonActive}
        >
          Marcar Entrada
        </button>

        <button
          onClick={() => onSaveAssistance("outlet")}
          disabled={!outletButtonActive}
        >
          Marcar Salida
        </button>

        {showCardMessage && (
          <div className={`alert ${messageType}`}>
            Asistencia marcada: {messageType === "entry" ? "Entrada" : "Salida"}
          </div>
        )}
      </Col>
    </Row>
  );
};
