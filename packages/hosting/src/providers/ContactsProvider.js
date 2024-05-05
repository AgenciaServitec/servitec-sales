import React, { createContext, useContext, useEffect, useState } from "react";
import { firestore } from "../firebase";
import moment from "moment";
import useSound from "use-sound";
import { ContactSound } from "../multimedia";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthentication } from "./AuthenticationProvider";
import { notification } from "../components/ui";

const ContactsContext = createContext({
  contacts: [],
  loadingContacts: true,
});

export const ContactsProvider = ({ children }) => {
  const { authUser } = useAuthentication();
  const [contactsData, setContactsData] = useState([]); //Contacts data of provider
  const [play] = useSound(ContactSound, { volume: 7 });

  const [contacts = [], contactsLoading, contactsError] = useCollectionData(
    authUser
      ? firestore
          .collection("contacts")
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
      : null
  );

  useEffect(() => {
    contactsError && notification({ type: "error", message: contactsError });
  }, [contactsError]);

  useEffect(() => {
    setContactsData(contacts);
    if (contacts.length > contactsData.length) return play();
  }, [contacts]);

  return (
    <ContactsContext.Provider
      value={{
        contacts: contactsData,
        loadingContacts: contactsLoading,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => useContext(ContactsContext);
