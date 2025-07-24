import React from "react";
import { useAssistance, useDefaultFirestoreProps } from "../../../hooks";
import { AssistanceView, Spinner } from "../../../components";
import { ModalProvider } from "../../../providers";

export const AssistanceIntegration = () => (
  <ModalProvider>
    <AssistanceIntegrationInner />
  </ModalProvider>
);

const AssistanceIntegrationInner = () => {
  const { assignCreateProps } = useDefaultFirestoreProps();
  const assistance = useAssistance(assignCreateProps);

  if (assistance.loadingLocation) {
    return <Spinner height="40svh" size="4x" />;
  }
  if (assistance.locationError) {
    return (
      <div style={{ textAlign: "center", padding: 20, color: "red" }}>
        <p>{assistance.locationError}</p>
        <button onClick={assistance.refreshLocation}>
          🔄 Reintentar ubicación
        </button>
      </div>
    );
  }

  return <AssistanceView {...assistance} />;
};
