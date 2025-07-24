import React from "react";
import styled, { keyframes } from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faSignOutAlt,
  faMapMarkerAlt,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Col,
  Form,
  InputNumber,
  Row,
  Spinner,
  UserLocationMap,
} from "../ui";

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

export const AssistanceView = ({
  dni,
  setDni,
  user,
  buttons,
  feedback,
  location,
  loadingLocation,
  locationError,
  refreshLocation,
  searchUser,
  resetUser,
  saveAssistance,
  goTo,
  setIsGeofenceValid,
}) => {
  const exists = !!user;

  return (
    <Container>
      <Col span={24}>
        <Button
          type="primary"
          size="large"
          onClick={() => goTo("/assistances")}
        >
          <FontAwesomeIcon icon={faSignInAlt} /> Ver mis Asistencias
        </Button>
      </Col>
      <div className="title-wrapper">
        <FontAwesomeIcon icon={faMapMarkerAlt} /> Registro de Asistencia
      </div>

      {!exists ? (
        <div className="form-wrapper">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              searchUser();
            }}
            style={{ width: "100%" }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <h3 className="form-text">DNI</h3>
                <InputNumber
                  placeholder="Ingrese DNI"
                  value={dni}
                  onChange={setDni}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={12}>
                <Button type="primary" onClick={searchUser} block size="large">
                  Buscar
                </Button>
              </Col>
              <Col span={12}>
                <Button type="default" onClick={resetUser} block size="large">
                  Limpiar
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      ) : (
        <>
          <Col span={24}>
            <div className="user-name">
              <h2 className="form-text">
                👋 Bienvenido/a, <span>{user.firstName}</span>!
              </h2>
              <p>¡Esperamos que tengas un buen día! 😊</p>
            </div>
            <Button danger onClick={resetUser} block>
              Cancelar
            </Button>
          </Col>
          <div className="content">
            <div className="left-panel">
              <div className="btn-group">
                <button
                  className="entry-btn"
                  onClick={() => saveAssistance("entry")}
                  disabled={!buttons.entry}
                >
                  <FontAwesomeIcon icon={faSignInAlt} /> Marcar Entrada
                </button>
                <button
                  className="outlet-btn"
                  onClick={() => saveAssistance("outlet")}
                  disabled={!buttons.outlet}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Marcar Salida
                </button>
              </div>
              {feedback.show && (
                <div className={`alert ${feedback.type}`}>
                  ✅ Asistencia marcada:{" "}
                  {feedback.type === "entry" ? "Entrada" : "Salida"}
                </div>
              )}
              <div className="icon-animation">
                <FontAwesomeIcon icon={faFaceSmile} />
              </div>
            </div>
            <div className="right-panel">
              <UserLocationMap
                location={location}
                onValidateGeofence={setIsGeofenceValid}
              />
            </div>
          </div>
        </>
      )}

      {loadingLocation && <Spinner height="40svh" size="4x" />}
      {locationError && (
        <div style={{ textAlign: "center", padding: 20, color: "red" }}>
          <p>{locationError}</p>
          <button onClick={refreshLocation}>🔄 Reintentar ubicación</button>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  --color-primary: #2563eb;
  --color-muted: #64748b;

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
  .form-wrapper {
    max-width: 30em;
    margin: 2em auto auto auto;
  }
  .form-text {
    color: var(--color-primary);
  }

  .content {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .user-name {
    text-align: center;
    h2 {
      font-size: 1.5rem;
      margin: 0;
      span {
        color: var(--color-primary);
      }
    }
    p {
      font-size: 1rem;
      margin: 0.25rem 0 0.75rem;
      color: var(--color-muted);
    }
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
