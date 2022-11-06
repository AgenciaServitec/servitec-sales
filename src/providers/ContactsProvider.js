import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthentication } from "./AuthenticationProvider";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";

const ContactsContext = createContext({
  contacts: [],
  onSetStartDate: () => null,
  onSetEndDate: () => null,
  loadingContacts: false,
});

export const ContactsProvider = ({ children }) => {
  const { authUser } = useAuthentication();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [contacts, setContacts] = useState(null);

  const onSetStartDate = (startDate) => setStartDate(startDate);
  const onSetEndDate = (endDate) => setEndDate(endDate);

  useEffect(() => {
    fetchContacts();
  }, [startDate, endDate]);

  const fetchContacts = () => {
    const [contacts = [], contactsLoading, contactsError] = useCollectionData(
      authUser
        ? firestore
            .collection("contacts")
            .where("createAt", ">=", startDate)
            .where("createAt", "<=", endDate)
        : null
    );

    setContacts(contacts);
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts: contacts,
        onSetStartDate,
        onSetEndDate,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => useContext(ContactsContext);
