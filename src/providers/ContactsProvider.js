import React, { createContext, useContext, useState } from "react";
import { useAuthentication } from "./AuthenticationProvider";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import moment from "moment";

const ContactsContext = createContext({
  contacts: [],
  onSetStartDate: (value = moment().format("YYYY-MM-DD")) => value,
  onSetEndDate: (value = moment().format("YYYY-MM-DD")) => value,
  loadingContacts: false,
});

export const ContactsProvider = ({ children }) => {
  const { authUser } = useAuthentication();

  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  const onSetStartDate = (value) => setStartDate(value);
  const onSetEndDate = (value) => setEndDate(value);

  const [contacts = [], contactsLoading, contactsError] = useCollectionData(
    authUser
      ? firestore
          .collection("contacts")
          .where("createAtString", ">=", startDate)
          .where("createAtString", "<=", endDate)
      : null
  );

  console.log("contactsError->", contactsError);

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        startDate: moment(startDate, "YYYY-MM-DD"),
        endDate: moment(endDate, "YYYY-MM-DD"),
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
