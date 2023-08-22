import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthentication } from "./AuthenticationProvider";
import { fetchCollectionOnce, firestore } from "../firebase";
import moment from "moment";
import { notification } from "../components/ui";
import { chunk } from "lodash";
import { useGlobalData } from "./GlobalDataProvider";

const ContactsContext = createContext({
  contacts: [],
  onSetStartDate: (value = moment().format("YYYY-MM-DD")) => value,
  onSetEndDate: (value = moment().add(1, "hour").format("YYYY-MM-DD")) => value,
  loadingContacts: true,
});

export const ContactsProvider = ({ children }) => {
  const { authUser } = useAuthentication();
  const { clients } = useGlobalData();

  const [contacts, setContacts] = useState([]);

  const [loadingContacts, setLoadingContacts] = useState(true);

  const [startDate, setStartDate] = useState(
    moment().subtract(1, "month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment().add(6, "hour").format("YYYY-MM-DD")
  );

  const onSetStartDate = (value) => setStartDate(value);
  const onSetEndDate = (value) => setEndDate(value);

  useEffect(() => {
    (async () => {
      try {
        setLoadingContacts(true);
        await fetchContact();
      } catch (error) {
        notification({ type: "error" });
        console.log("Error in fetchContact->", error);
      } finally {
        setLoadingContacts(false);
      }
    })();
  }, [startDate, endDate]);

  const fetchContact = async () => {
    const queryRef = firestore.collection("contacts");

    const existsAllOption = (authUser?.clientsIds || []).find(
      (clientId) => clientId === "all"
    );

    const promises = chunk(
      existsAllOption
        ? clients.map((client) => client.id)
        : authUser?.clientsIds,
      9
    ).map((clientsIdsChunk) =>
      queryRef
        .where("createAtString", ">=", startDate)
        .where("createAtString", "<=", endDate)
        .where("searchData", "array-contains-any", clientsIdsChunk)
        .where("isDeleted", "==", false)
    );

    const contactsChunk = await Promise.all(
      promises.map(async (promise) => {
        return fetchCollectionOnce(promise);
      })
    );

    const contacts_ = contactsChunk.flatMap((contacts) => contacts);

    setContacts(contacts_);
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        startDate: moment(startDate, "YYYY-MM-DD"),
        endDate: moment(endDate, "YYYY-MM-DD"),
        onSetStartDate,
        onSetEndDate,
        loadingContacts,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => useContext(ContactsContext);
