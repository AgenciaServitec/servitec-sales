import { useMemo, useState } from "react";

export const useCoordinates = () => {
  const [coordinates, setCoordinates] = useState(null);

  useMemo(() => {
    if (navigator.geolocation) {
      const success = (position) => {
        setCoordinates({
          latitud: position.coords.latitude || null,
          longitud: position.coords.longitude || null,
        });
      };

      navigator.geolocation.getCurrentPosition(success, (msg) => {
        console.error("Error cordinates:", msg);
      });
    }
  }, [coordinates]);

  return {
    coordinates,
  };
};
