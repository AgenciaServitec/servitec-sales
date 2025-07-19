
import { useEffect, useState } from "react";

export const useUserLocation = () => {
  const [location, setLocation] = useState(null);
  const [method, setMethod] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocationByIP = async () => {
      try {
        const res = await fetch("https://ip-api.com/json/");
        const data = await res.json();
        setLocation({ lat: data.lat, lng: data.lon });
        setMethod("ip");
      } catch (err) {
        setError("No se pudo obtener la ubicación por IP.");
      } finally {
        setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setMethod("gps");
          setLoading(false);
        },
        (err) => {
          console.warn("GPS falló:", err.message);
          getLocationByIP();
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      getLocationByIP();
    }
  }, []);

  return { location, method, loading, error };
}
