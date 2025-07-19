import React from "react";
import { useUserLocation } from "../../hooks";
import { UserLocationMap } from "../../components";

export const AssistanceIntegration = () => {
  const { location, method, loading, error } = useUserLocation();


  if (loading) return <p>Obteniendo ubicación...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!location) return <p>No se pudo determinar la ubicación.</p>;

  return (
    <div>
      <h2>Ubicación detectada ({method})</h2>
      <UserLocationMap location={location} />
    </div>
  );
};

