import React, { useEffect, useState } from "react";
import { useGlobal } from "reactn";
import { apiUrl, auth, firestore } from "../firebase";
import { get } from "lodash";
import UrlAssembler from "url-assembler";
import { notification } from "../components/ui";

export const withAuthentication = (Component) => {
  return () => {
    const [, setGlobalUser] = useGlobal("authUser");
    const [globalRegister, setGlobalRegister] = useGlobal("register");
    const [globalIsLoadingCreateUser, setGlobalIsLoadingCreateUser] = useGlobal(
      "isLoadingCreateUser"
    );
    const [globalIsLoadingUser, setGlobalIsLoadingUser] =
      useGlobal("isLoadingUser");

    const [createUserError, setCreateUserError] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    useEffect(() => {
      const setUserApi = async (user) => {
        try {
          const response = await fetch(urlApiSetUser(user.id), {
            method: "PUT",
            body: JSON.stringify(user),
            headers: {
              "content-Type": "application/json",
              Accept: "application/json",
            },
          });

          if (!response.ok) {
            throw Error(response.statusText);
          }

          return user;
        } catch (e) {
          await auth.currentUser.delete();
          console.error("Authentication error", e);
          notification({
            type: "error",
            title: "Authentication error",
            description: createUserError,
          });
        }
      };

      const urlApiSetUser = (userId) =>
        new UrlAssembler(apiUrl)
          .template("/users/:userId")
          .param({ userId })
          .toString();

      const fetchUserFromFirestore = async (authUser) => {
        try {
          const userSnapshot = await firestore
            .collection("users")
            .doc(authUser.uid)
            .get();

          // if (userSnapshot.exists)
          //   notification({
          //     type: "error",
          //     title: "Authentication error",
          //     description: "There is a problem with your authUser.",
          //   });

          return userSnapshot.data();
        } catch (error) {
          setCreateUserError(error.message);
        }
      };

      const unsubscribeAuthStateChanged = auth.onAuthStateChanged(
        async (authUser) => {
          if (
            globalIsLoadingCreateUser &&
            get(authUser, "uid", "uid") === get(globalRegister, "id", "id")
          ) {
            const user = await setUserApi(globalRegister);

            await setGlobalRegister(null);
            await setGlobalUser(user);
            await setGlobalIsLoadingCreateUser(false);

            return setIsLoadingAuth(false);
          }

          if (authUser) {
            const user = await fetchUserFromFirestore(authUser);

            await setGlobalUser(user);
            await setGlobalIsLoadingUser(false);

            return setIsLoadingAuth(false);
          }

          if (!authUser && !globalIsLoadingCreateUser && !globalIsLoadingUser) {
            await setGlobalRegister(null);
            await setGlobalUser(null);

            return setIsLoadingAuth(false);
          }
        }
      );

      return () => unsubscribeAuthStateChanged();
      // eslint-disable-next-line
    }, [
      globalRegister,
      globalIsLoadingCreateUser,
      globalIsLoadingUser,
      setGlobalIsLoadingUser,
      setGlobalIsLoadingCreateUser,
      setGlobalUser,
      setGlobalRegister,
    ]);

    return isLoadingAuth ? null : <Component />;
  };
};
