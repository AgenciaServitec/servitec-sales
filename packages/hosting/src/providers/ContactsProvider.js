import React, { createContext, useContext, useEffect, useState } from "react";
import { firestore, querySnapshotToArray } from "../firebase";
import moment from "moment";
import { notification } from "../components/ui";

const ContactsContext = createContext({
  contacts: [],
  loadingContacts: true,
});

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = () => {
    try {
      setLoadingContacts(true);

      const queryRef = firestore.collection("contacts");

      const unsubscribe = queryRef
        .where(
          "createAtString",
          ">=",
          moment().subtract(1, "month").format("YYYY-MM-DD")
        )
        .where(
          "createAtString",
          "<=",
          moment().add(1, "day").format("YYYY-MM-DD")
        )
        .where("isDeleted", "==", false)
        .onSnapshot((snapshot) => setContacts(querySnapshotToArray(snapshot)));

      return () => unsubscribe();
    } catch (error) {
      notification({ type: "error" });
      console.log("Error in fetchContacts: ", error);
    } finally {
      setLoadingContacts(false);
    }
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts: contacts,
        loadingContacts,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => useContext(ContactsContext);
