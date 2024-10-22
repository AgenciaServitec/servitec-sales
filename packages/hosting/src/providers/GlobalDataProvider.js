import React, { createContext, useContext, useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase";
import { useAuthentication } from "./AuthenticationProvider";
import { notification, Spinner } from "../components/ui";
import { orderBy } from "lodash";

const GlobalDataContext = createContext({
  clients: [],
  users: [],
  //
    spams: [],
    addSpam:()=>{},
    removeSpam:()=>{},
  //
});

export const GlobalDataProvider = ({ children }) => {
  const { authUser } = useAuthentication();

  const [clients = [], clientsLoading, clientsError] = useCollectionData(
    authUser
      ? firestore.collection("clients").where("isDeleted", "==", false)
      : null
  );

  const [users = [], usersLoading, usersError] = useCollectionData(
    authUser
      ? firestore.collection("users").where("isDeleted", "==", false)
      : null
  );

  ///////////////////////////////////////////////////

  const [spams,setSpams] = useState([])

  const addSpam = async(spamData) =>{
    try {
      const spamRef = firestore.collection("spams");
      const docRef = await spamRef.add({ ...spamData, createAt: new Date() }); // Agrega una fecha de creación
      setSpams((prevSpams) => [...prevSpams, { id: docRef.id, ...spamData }]); // Incluye el ID en el estado local
    } catch (error) {
      notification({ type: "error" });
    }
  }

  const removeSpam = async(spamId) =>{
    console.log(spamId)
    try {
      const spamRef = firestore.collection("spams").doc(spamId);
      await spamRef.delete();
      setSpams((prevSpams) => prevSpams.filter(spam => spam.id !== spamId));
    } catch (error) {
      notification({ type: "error" });
    }
  }

  /////////////////////////////////////////////////

  const error = clientsError || usersError;
  const loading = clientsLoading || usersLoading;

  useEffect(() => {
    error && notification({ type: "error" });
  }, [error]);

  if (loading) return <Spinner height="100vh" />;

  return (
    <GlobalDataContext.Provider
      value={{
        clients: orderBy(clients, (client) => [client.createAt], ["asc"]),
        users: orderBy(users, (user) => [user.createAt], ["asc"]),
        ////////////
        spams: orderBy(spams, (spam) => [spam.createAt], ["asc"]),
        addSpam,
        removeSpam,
        ///////////
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);
