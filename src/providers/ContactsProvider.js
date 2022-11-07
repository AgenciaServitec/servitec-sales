import React, { createContext, useContext, useState } from "react";
import { useAuthentication } from "./AuthenticationProvider";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import moment from "moment";

const ContactsContext = createContext({
  contacts: [],
  onSetStartDate: () => null,
  onSetEndDate: () => null,
  loadingContacts: false,
});

export const ContactsProvider = ({ children }) => {
  const { authUser } = useAuthentication();

  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  const onSetStartDate = (startDate) => setStartDate(startDate);
  const onSetEndDate = (endDate) => setEndDate(endDate);

  const [contacts = [], contactsLoading, contactsError] = useCollectionData(
    authUser
      ? firestore
          .collection("contacts")
          .where("createInString", ">=", startDate)
          .where("createInString", "<=", endDate)
      : null
  );

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        onSetStartDate,
        onSetEndDate,
        contactsLoading,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => useContext(ContactsContext);
