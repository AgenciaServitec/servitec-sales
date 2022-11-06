import React, { createContext, useContext, useEffect } from "react";

const ContactsContext = createContext({
  contacts: [],
});

const ContactsProvider = ({ children }) => {
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = () => {};

  return (
    <ContactsContext.Provider
      value={{
        contacts: [],
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};
