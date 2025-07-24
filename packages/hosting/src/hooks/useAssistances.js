import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { useUserLocation } from "./useUserLocation";
import {
  addAssistance,
  fetchTodayAssistancesByUserId,
  fetchUsersByDni,
  getAssistancesId,
  updateAssistance,
} from "../firebase/collections";
import { notification } from "../components";
import { firestoreTimestamp } from "../firebase/firestore";

export const useAssistance = (assignCreateProps) => {
  const navigate = useNavigate();

  const [dni, setDni] = useState("");
  const [user, setUser] = useState(null);
  const [buttons, setButtons] = useState({
    entry: false,
    outlet: false,
  });
  const [feedback, setFeedback] = useState({
    show: false,
    type: "",
  });
  const [assistanceSaved, setAssistanceSaved] = useState(false);

  const {
    location,
    method,
    loading: loadingLocation,
    error: locationError,
    refreshLocation,
    setIsGeofenceValid,
  } = useUserLocation((valid) => updateGeoState(valid));

  const [isGeofenceValid, updateGeoState] = useState(false);

  const isToday = (dateStr) =>
    dayjs(dateStr, "DD-MM-YYYY HH:mm").isSame(dayjs(), "day");

  const fetchToday = useCallback(async () => {
    if (!user) return [];
    return fetchTodayAssistancesByUserId(user.id);
  }, [user]);

  const hasMarked = useCallback(
    async (type) => {
      const list = await fetchToday();
      return list.some((a) => a[type]?.date && isToday(a[type].date));
    },
    [fetchToday]
  );

  const updateButtons = useCallback(async () => {
    const [markedEntry, markedOutlet] = await Promise.all([
      hasMarked("entry"),
      hasMarked("outlet"),
    ]);
    setButtons({
      entry: !markedEntry && isGeofenceValid,
      outlet: !markedOutlet && markedEntry && isGeofenceValid,
    });
  }, [hasMarked, isGeofenceValid]);

  useEffect(() => {
    if (user || assistanceSaved || isGeofenceValid) {
      updateButtons();
    }
  }, [user, assistanceSaved, isGeofenceValid, updateButtons]);

  const searchUser = useCallback(async () => {
    if (!dni)
      return notification({ type: "warning", description: "Digite su DNI" });
    try {
      const found = await fetchUsersByDni(dni.toString());
      if (found.length) return setUser(found[0]);
      setUser(null);
      notification({ type: "warning", description: "Usuario no encontrado" });
    } catch {
      notification({ type: "error" });
    }
  }, [dni]);

  const resetUser = useCallback(() => {
    setDni("");
    setUser(null);
  }, []);

  const saveAssistance = useCallback(
    async (type) => {
      if (!user) return;
      if (!isGeofenceValid)
        return notification({
          type: "warning",
          description: "No estás dentro de tu lugar de trabajo",
        });
      if (await hasMarked(type))
        return notification({
          type: "warning",
          message: `Ya ha marcado su ${
            type === "entry" ? "ingreso" : "salida"
          } hoy`,
        });

      try {
        const date = dayjs().format("DD-MM-YYYY HH:mm");
        const todayList = await fetchToday();
        const existing = todayList.find((a) => isToday(a.createAtString)) || {};

        const data = {
          ...existing,
          id: existing.id || getAssistancesId(),
          userId: user.id,
          createAtString: existing.createAtString || date,
          entry:
            existing.entry ||
            (type === "entry" && {
              date,
              dateTimestamp: firestoreTimestamp.now(),
            }),
          outlet: type === "outlet" && existing.entry ? { date } : null,
          user,
        };

        if (type === "entry") {
          await addAssistance(assignCreateProps(data));
        } else {
          await updateAssistance(existing.id, assignCreateProps(data));
        }

        notification({
          type: "success",
          title: `Ha marcado su ${
            type === "entry" ? "entrada" : "salida"
          } correctamente`,
        });
        setFeedback({ show: true, type });
        setTimeout(() => setFeedback((f) => ({ ...f, show: false })), 4000);
        setAssistanceSaved(true);
      } catch {
        notification({ type: "error" });
      }
    },
    [user, isGeofenceValid, hasMarked, fetchToday, assignCreateProps]
  );

  const goTo = useCallback((path) => navigate(path), [navigate]);

  return {
    dni,
    setDni,
    user,
    buttons,
    feedback,
    loadingLocation,
    locationError,
    location,
    searchUser,
    resetUser,
    saveAssistance,
    goTo,
    refreshLocation,
    setIsGeofenceValid: updateGeoState,
  };
};
