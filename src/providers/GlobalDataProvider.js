import React, { createContext, useContext, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import { useAuthentication } from "./AuthenticationProvider";
import { notification, Spinner } from "../components/ui";
import { orderBy } from "lodash";

const GlobalDataContext = createContext({
  contacts: [],
  clients: [],
  users: [],
});

export const GlobalDataProvider = ({ children }) => {
  const { authUser } = useAuthentication();

  const [contacts = [], contactsLoading, contactsError] = useCollectionData(
    authUser
      ? firestore
          .collection("contacts")
          .where(
            "searchData",
            "array-contains-any",
            authUser?.clientsIds || [""]
          )
      : null
  );

  const [clients = [], clientsLoading, clientsError] = useCollectionData(
    authUser ? firestore.collection("clients") : null
  );

  const [users = [], usersLoading, usersError] = useCollectionData(
    authUser ? firestore.collection("users") : null
  );

  const error = contactsError || clientsError || usersError;
  const loading = contactsLoading || clientsLoading || usersLoading;

  useEffect(() => {
    error && notification({ type: "error" });
  }, [error]);

  if (loading) return <Spinner height="100vh" />;

  return (
    <GlobalDataContext.Provider
      value={{
        contacts: orderBy(contacts, (contact) => [contact.createAt], ["asc"]),
        clients: orderBy(clients, (client) => [client.createAt], ["asc"]),
        users: orderBy(users, (user) => [user.createAt], ["asc"]),
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);
