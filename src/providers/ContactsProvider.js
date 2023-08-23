import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthentication } from "./AuthenticationProvider";
import { firestore } from "../firebase";
import moment from "moment";
import { notification } from "../components/ui";
import { chunk, uniqBy } from "lodash";
import { useGlobalData } from "./GlobalDataProvider";
import useSound from "use-sound";
import { ContactSound } from "../multimedia";

const ContactsContext = createContext({
  contacts: [],
  onSetStartDate: (value = moment().format("YYYY-MM-DD")) => value,
  onSetEndDate: (value = moment().add(1, "hour").format("YYYY-MM-DD")) => value,
  loadingContacts: true,
});

export const ContactsProvider = ({ children }) => {
  const { authUser } = useAuthentication();
  const { clients } = useGlobalData();

  const [play] = useSound(ContactSound);

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

  const playToSound = () => play();

  useEffect(() => {
    try {
      setLoadingContacts(true);
      fetchContact();
    } catch (error) {
      notification({ type: "error" });
      console.log("Error in fetchContact->", error);
    } finally {
      setLoadingContacts(false);
    }
  }, [startDate, endDate]);

  const fetchContact = async () => {
    const queryRef = firestore.collection("contacts");

    const existsAllOption = (authUser?.clientsIds || []).find(
      (clientId) => clientId === "all"
    );

    chunk(
      existsAllOption
        ? clients.map((client) => client.id)
        : authUser?.clientsIds,
      10
    ).map((clientsIdsChunk) =>
      queryRef
        .where("createAtString", ">=", startDate)
        .where("createAtString", "<=", endDate)
        .where("searchData", "array-contains-any", clientsIdsChunk)
        .where("isDeleted", "==", false)
        .onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              playToSound();
            }
          });

          querySnapshot.forEach((doc) => {
            setContacts((prevContacts) =>
              uniqBy([...prevContacts, doc.data()], "id")
            );
          });
        })
    );
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
