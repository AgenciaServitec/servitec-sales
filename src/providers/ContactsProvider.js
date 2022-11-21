import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthentication } from "./AuthenticationProvider";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import moment from "moment";
import { notification } from "../components/ui";

const ContactsContext = createContext({
  contacts: [],
  onSetStartDate: (value = moment().format("YYYY-MM-DD")) => value,
  onSetEndDate: (value = moment().add(1, "hour").format("YYYY-MM-DD")) => value,
  loadingContacts: false,
});

export const ContactsProvider = ({ children }) => {
  const { authUser } = useAuthentication();

  const [startDate, setStartDate] = useState(
    moment().subtract(1, "month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment().add(1, "hour").format("YYYY-MM-DD")
  );

  const onSetStartDate = (value) => setStartDate(value);
  const onSetEndDate = (value) => setEndDate(value);

  const [contacts = [], contactsLoading, contactsError] = useCollectionData(
    authUser
      ? firestore
          .collection("contacts")
          .where("createAtString", ">=", startDate)
          .where("createAtString", "<=", endDate)
          .where(
            "searchData",
            "array-contains-any",
            authUser?.clientsIds || [""]
          )
      : null
  );

  useEffect(() => {
    contactsError && notification({ type: "error" });
  }, [contactsError]);

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
