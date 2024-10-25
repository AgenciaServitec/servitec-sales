import React, { createContext, useContext, useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import { useAuthentication } from "./AuthenticationProvider";
import { notification, Spinner } from "../components/ui";
import { orderBy } from "lodash";

const GlobalDataContext = createContext({
  clients: [],
  users: [],
  spams: [],
});

export const GlobalDataProvider = ({ children }) => {
  const { authUser } = useAuthentication();

  const [clients = [], clientsLoading, clientsError] = useCollectionData(
    authUser
      ? firestore.collection("clients").where("isDeleted", "==", false)
      : null
  );

  const [users = [], usersLoading, usersError] = useCollectionData(
    authUser
      ? firestore.collection("users").where("isDeleted", "==", false)
      : null
  );

  const [spams = [], spamsLoading, spamsError] = useCollectionData(
    authUser
      ? firestore.collection("spams").where("isDeleted", "==", false)
      : null
  );

  const error = clientsError || usersError || spamsError;
  const loading = clientsLoading || usersLoading || spamsLoading;

  useEffect(() => {
    error && notification({ type: "error" });
  }, [error]);

  if (loading) return <Spinner height="100svh" />;

  return (
    <GlobalDataContext.Provider
      value={{
        clients: orderBy(clients, (client) => [client.createAt], ["asc"]),
        users: orderBy(users, (user) => [user.createAt], ["asc"]),
        spams: orderBy(spams, (spam) => [spam.createAt], ["desc"]),
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);
