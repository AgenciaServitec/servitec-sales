import { useState, useEffect } from "react";
import * as faceapi from "face-api.js";

export const useFaceApiModels = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setLoading(false);
      } catch (err) {
        console.error("Error cargando modelos:", err);
        setError("Error al cargar modelos");
      }
    };

    loadModels();
  }, []);

  return { loading, error };
};
