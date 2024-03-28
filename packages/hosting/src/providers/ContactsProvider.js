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
  const [play] = useSound(ContactSound);

  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  const playToSound = () => play();

  useEffect(() => {
    try {
      setLoadingContacts(true);
      fetchContacts();
    } catch (error) {
      notification({ type: "error" });
      console.log("Error in fetchContacts: ", error);
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  const fetchContacts = () => {
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
        moment().add(1, "hour").format("YYYY-MM-DD")
      )
      .where("isDeleted", "==", false)
      .onSnapshot((snapshot) => {
        const newContacts = querySnapshotToArray(snapshot);

        if (newContacts.length > contacts.length) {
          playToSound();
        }

        setContacts(querySnapshotToArray(snapshot));
      });

    return () => unsubscribe();
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
