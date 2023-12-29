import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthentication } from "./AuthenticationProvider";
import { firestore } from "../firebase";
import moment from "moment";
import { notification } from "../components/ui";
import { chunk, merge } from "lodash";
import { useGlobalData } from "./GlobalDataProvider";
import useSound from "use-sound";
import { ContactSound } from "../multimedia";

const ContactsContext = createContext({
  contacts: [],
  loadingContacts: true,
});

export const ContactsProvider = ({ children }) => {
  const { authUser } = useAuthentication();
  const { clients } = useGlobalData();

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
      console.log("Error in fetchContacts->", error);
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  const fetchContacts = () => {
    const queryRef = firestore.collection("contacts");

    const existsAllOption = (authUser?.clientsIds || []).find(
      (clientId) => clientId === "all"
    );

    chunk(
      existsAllOption
        ? clients.map((client) => client.id)
        : authUser?.clientsIds,
      10
    ).map((clientsIdsChunk) => {
      const unsubscribe = queryRef
        .where(
          "createAtString",
          ">=",
          moment().subtract(3, "month").format("YYYY-MM-DD")
        )
        .where(
          "createAtString",
          "<=",
          moment().add(1, "hour").format("YYYY-MM-DD")
        )
        .where("searchData", "array-contains-any", clientsIdsChunk)
        .where("isDeleted", "==", false)
        .onSnapshot((snapshot) => {
          const newData = [];

          snapshot.forEach((doc) => {
            const currentDateWithSubtract1Minute = moment().subtract(
              7,
              "seconds"
            );

            if (
              moment(doc?.data()?.createAt.toDate()).isBetween(
                currentDateWithSubtract1Minute
              )
            ) {
              playToSound();
            }

            newData.push({ id: doc.id, ...doc.data() });
          });

          setContacts(merge(newData, contacts));
        });

      return () => unsubscribe();
    });
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
