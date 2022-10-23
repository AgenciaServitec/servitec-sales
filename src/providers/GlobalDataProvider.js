import React, { createContext, useContext, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import { useAuthentication } from "./AuthenticationProvider";
import { notification, Spinner } from "../components/ui";
import { orderBy } from "lodash";

const GlobalDataContext = createContext({
  contacts: [],
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

  const error = contactsError || clientsError;
  const loading = contactsLoading || clientsLoading;

  useEffect(() => {
    error && notification({ type: "error" });
  }, [error]);

  if (loading) return <Spinner height="100vh" />;

  return (
    <GlobalDataContext.Provider
      value={{
        contacts: orderBy(contacts, (contact) => [contact.createAt], ["asc"]),
        clients: orderBy(clients, (client) => [client.createAt], ["asc"]),
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);
