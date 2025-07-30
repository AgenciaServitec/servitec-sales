import { useState, useCallback } from "react";

export const useVideoStream = (videoRef, onStatusUpdate) => {
  const [stream, setStream] = useState(null);

  const startVideo = useCallback(async () => {
    if (!videoRef.current) {
      console.error("El elemento video aún no está montado.");
      onStatusUpdate("El video aún no está listo.", "warning");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      onStatusUpdate("Cámara encendida", "info");
    } catch (error) {
      console.error("Error al iniciar cámara:", error);
      onStatusUpdate("No se pudo acceder a la cámara", "error");
    }
  }, [videoRef, onStatusUpdate]);

  const stopVideo = useCallback(() => {
    if (!videoRef.current) {
      console.error("El elemento video aún no está montado.");
      onStatusUpdate("El video aún no está listo.", "warning");
      return;
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStream(null);
      onStatusUpdate("Cámara apagada", "info");
    }
  }, [stream, videoRef, onStatusUpdate]);

  return { stream, startVideo, stopVideo };
};
