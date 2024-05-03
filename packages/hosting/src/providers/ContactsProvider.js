import React, { createContext, useContext, useEffect, useState } from "react";
import { firestore, querySnapshotToArray } from "../firebase";
import moment from "moment";
import { notification } from "../components/ui";
import useSound from "use-sound";
import { ContactSound } from "../multimedia";

const ContactsContext = createContext({
  contacts: [],
  loadingContacts: true,
});

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [contactsData, setContactsData] = useState([]); //Contacts data of provider
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [play] = useSound(ContactSound, { volume: 7 });

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    setContactsData(contacts);

    if (contacts.length > contactsData.length) play();
  }, [contacts]);

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
        contacts: contactsData,
        loadingContacts,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => useContext(ContactsContext);
