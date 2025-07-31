import React, { useRef, useState } from "react";
import styled from "styled-components";
import classNames from "classnames";
import * as faceapi from "face-api.js";
import { fetchUser, updateUser } from "../../firebase/collections";
import { useFaceApiModels, useVideoStream } from "../../hooks";
import { useAuthentication } from "../../providers";

export const FaceRegistration = () => {
  const { authUser } = useAuthentication();

  const videoRef = useRef(null);
  const [status, setStatus] = useState({
    message: "Esperando acción...",
    type: "info",
  });

  const updateStatus = (message, type = "info") => setStatus({ message, type });

  const { loading, error } = useFaceApiModels();
  const { stream, startVideo, stopVideo } = useVideoStream(
    videoRef,
    updateStatus
  );

  const captureFace = async () => {
    updateStatus("Capturando rostro...", "info");
    try {
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        updateStatus("No se detectó rostro, intenta de nuevo.", "error");
        return;
      }

      const descriptorArray = Array.from(detection.descriptor);
      await saveDescriptorToFirestore(descriptorArray);
    } catch (err) {
      updateStatus("Error durante la captura facial", "error");
      console.error(err);
    }
  };

  const saveDescriptorToFirestore = async (descriptorArray) => {
    try {
      const userId = authUser.id;
      if (!userId) throw new Error("Usuario no autenticado");

      const userData = await fetchUser(userId);
      if (!userData) {
        updateStatus("Usuario no encontrado", "error");
        return;
      }

      await updateUser(userId, { faceDescriptor: descriptorArray });
      updateStatus("✅ Descriptor facial guardado con éxito", "success");
    } catch (err) {
      updateStatus("❌ Error al guardar el descriptor", "error");
      console.error(err);
    }
  };

  return (
    <Container>
      <h3 className="title">Registro Facial</h3>

      <p className={classNames("status", status.type)}>{status.message}</p>

      <video
        ref={videoRef}
        autoPlay
        muted
        width="480"
        height="360"
        className="video"
      />

      <div className="controls">
        <button onClick={startVideo} disabled={!!stream}>
          Encender cámara
        </button>
        <button onClick={stopVideo} disabled={!stream}>
          Apagar cámara
        </button>
        <button onClick={captureFace} disabled={loading || !stream}>
          Registrar rostro
        </button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  max-width: 640px;
  margin: auto;
  background: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0px 12px 28px rgba(0, 0, 0, 0.08);
  font-family: "Segoe UI", sans-serif;
  gap: 1rem;

  .title {
    font-size: 1.75rem;
    color: #222;
    margin-bottom: 0.5rem;
  }

  .status {
    font-weight: 500;
    color: #666;
    &.success {
      color: green;
    }
    &.error {
      color: red;
    }
  }
  .user-name {
    text-align: center;
  }

  .video {
    border-radius: 0.75rem;
    border: 2px solid #ddd;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    max-width: 100%;
  }

  .controls {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 1rem;

    button {
      background-color: #0077ff;
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #005fd1;
      }
      &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }
    }
  }
`;
