import React, { createContext, useContext, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import { useAuthentication } from "./Authentication";
import { notification, Spinner } from "../components/ui";
import { orderBy } from "lodash";

const GlobalDataContext = createContext({
  contacts: [],
});

export const GlobalDataProvider = ({ children }) => {
  const { authUser } = useAuthentication();

  const [contacts = [], contactsLoading, contactsError] = useCollectionData(
    authUser ? firestore.collection("contacts") : null
  );

  const error = contactsError;
  const loading = contactsLoading;

  useEffect(() => {
    error && notification({ type: "error" });
  }, [error]);

  if (loading) return <Spinner fullscreen />;

  return (
    <GlobalDataContext.Provider
      value={{
        contacts: orderBy(contacts, (contact) => [contact.createAt], ["asc"]),
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};
export const useGlobalData = () => useContext(GlobalDataContext);
