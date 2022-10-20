import React, { createContext, useContext, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import { useAuthentication } from "./Authentication";
import { notification, Spinner } from "../components/ui";
import { orderBy } from "lodash";
import useSound from "use-sound";
import { ContactSound } from "../multimedia";

const GlobalDataContext = createContext({
  contacts: [],
});

export const GlobalDataProvider = ({ children }) => {
  const [play] = useSound(ContactSound);

  const { authUser } = useAuthentication();

  const [contacts = [], contactsLoading, contactsError] = useCollectionData(
    authUser
      ? firestore
          .collection("contacts")
          .where("searchData", "array-contains-any", authUser?.clientsIds || [])
      : null
  );

  const error = contactsError;
  const loading = contactsLoading;

  const playToSound = () => play();

  useEffect(() => {
    authUser && playToSound();
  }, [contacts]);

  useEffect(() => {
    error && notification({ type: "error" });
  }, [error]);

  if (loading) return <Spinner height="70vh" />;

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
