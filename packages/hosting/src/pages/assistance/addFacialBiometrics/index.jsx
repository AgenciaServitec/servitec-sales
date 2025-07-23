import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { getAuth } from "firebase/auth";
import { fetchUser, updateUser } from "../../../firebase/collections";
import styled from "styled-components";
import classNames from "classnames";

export const FaceRegistration = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState("Esperando acción...");
  const [statusType, setStatusType] = useState("info");
  const [loadingModels, setLoadingModels] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(
            "/models/tiny_face_detector"
          ),
          faceapi.nets.faceLandmark68Net.loadFromUri(
            "/models/face_landmark_68"
          ),
          faceapi.nets.faceRecognitionNet.loadFromUri(
            "/models/face_recognition"
          ),
        ]);
        setLoadingModels(false);
      } catch (err) {
        setStatus("Error al cargar modelos");
        setStatusType("error");
        console.error(err);
      }
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setStream(stream);
        videoRef.current.srcObject = stream;
        setStatus("Cámara encendida");
        setStatusType("info");
      })
      .catch((err) => {
        setStatus("No se pudo acceder a la cámara");
        setStatusType("error");
        console.error(err);
      });
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStream(null);
      setStatus("Cámara apagada");
      setStatusType("info");
    }
  };

  const captureFace = async () => {
    setStatus("Capturando rostro...");
    setStatusType("info");

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      const descriptorArray = Array.from(detection.descriptor);
      await saveDescriptorToFirestore(descriptorArray);
    } else {
      setStatus("No se detectó rostro, intenta de nuevo.");
      setStatusType("error");
    }
  };

  const saveDescriptorToFirestore = async (descriptorArray) => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser.uid;

      const userData = await fetchUser(userId);
      if (!userData) {
        setStatus("Usuario no encontrado.");
        setStatusType("error");
        return;
      }

      await updateUser(userId, { faceDescriptor: descriptorArray });

      setStatus("✅ Descriptor facial guardado con éxito.");
      setStatusType("success");
    } catch (err) {
      setStatus("❌ Error al guardar el descriptor.");
      setStatusType("error");
      console.error(err);
    }
  };

  return (
    <Container className="face-registration-container">
      <h3 className="title">Registro Facial</h3>

      <p
        className={classNames("status", {
          success: statusType === "success",
          error: statusType === "error",
        })}
      >
        {status}
      </p>

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
        <button onClick={captureFace} disabled={loadingModels || !stream}>
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
