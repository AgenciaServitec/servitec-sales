import { useEffect, useState, useCallback } from "react";

export const useUserLocation = () => {
  const [location, setLocation] = useState(null);
  const [method, setMethod] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLocationByIP = useCallback(async () => {
    try {
      const res = await fetch("https://ip-api.com/json/");
      const data = await res.json();
      if (data.status === "success") {
        setLocation({ lat: data.lat, lng: data.lon });
        setMethod("ip");
        setError(null);
      } else {
        throw new Error("IP location failed");
      }
    } catch (err) {
      setError("No se pudo obtener la ubicación por IP.");
    } finally {
      setLoading(false);
    }
  }, []);

  const getLocationByGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      getLocationByIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setMethod("gps");
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.warn("GPS error:", err.message);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Permiso denegado para acceder a la ubicación.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("La información de ubicación no está disponible.");
            break;
          case err.TIMEOUT:
            setError("Tiempo de espera agotado al obtener la ubicación.");
            break;
          default:
            setError("Error desconocido al obtener la ubicación.");
        }
        getLocationByIP();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [getLocationByIP]);

  const checkPermissionAndGetLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLocation(null);

    if (!navigator.permissions) {
      getLocationByGPS();
      return;
    }

    try {
      const status = await navigator.permissions.query({ name: "geolocation" });

      if (status.state === "granted" || status.state === "prompt") {
        getLocationByGPS();
      } else if (status.state === "denied") {
        setError(
          "Has bloqueado el acceso a la ubicación. Actívalo en la configuración del navegador."
        );
        getLocationByIP();
      }
    } catch (e) {
      getLocationByGPS();
    }
  }, [getLocationByGPS, getLocationByIP]);

  useEffect(() => {
    checkPermissionAndGetLocation();
  }, [checkPermissionAndGetLocation]);

  const refreshLocation = () => {
    checkPermissionAndGetLocation();
  };

  return {
    location,
    method,
    loading,
    error,
    refreshLocation,
  };
};
