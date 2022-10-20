import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth, firestore } from "../firebase/index";
import { firebase } from "../firebase/config";
import { isError } from "lodash";
import { useDocument } from "react-firebase-hooks/firestore";
import { timeoutPromise } from "../utils";
import { notification, Spinner } from "../components/ui";

const AuthenticationContext = createContext({
  authUser: null,
  registerAuthUser: () =>
    Promise.reject("Unable to find AuthenticationProvider."),
  login: () => Promise.reject("Unable to find AuthenticationProvider."),
  logout: () => Promise.reject("Unable to find AuthenticationProvider."),
  loginLoading: false,
});

export const useAuthentication = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const [authenticating, setAuthenticating] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerAuthUserData, setRegisterAuthUserData] = useState(null);

  const [userSnapshot, loadingUser, errorUser] = useDocument(
    firebaseUser ? firestore.collection("users").doc(firebaseUser.uid) : null
  );

  useMemo(() => {
    auth.onAuthStateChanged((currentUser) =>
      currentUser ? previusAuthenticationUser(currentUser) : onLogout()
    );
  }, []);

  const previusAuthenticationUser = async (currentUser) => {
    try {
      const uid = currentUser.uid;
      const [providerData] = currentUser.providerData;

      const userExists = (
        await firestore.collection("users").doc(uid).get()
      ).data();

      if (userExists) {
        setFirebaseUser(currentUser);
        await timeoutPromise(1700);
        return setLoginLoading(false);
      }

      await firestore
        .collection("users")
        .doc(uid)
        .set(
          {
            id: uid,
            ...registerAuthUserData,
            nickName:
              providerData?.displayName ||
              registerAuthUserData?.firstName ||
              null,
            providerData: mapProviderData(providerData),
            ...(providerData?.displayName && {
              nickName: providerData.displayName,
            }),
            ...(providerData?.email && { email: providerData.email }),
            createAt: new Date(),
          },
          { merge: true }
        );

      setFirebaseUser(currentUser);

      await timeoutPromise(1700);
      setLoginLoading(false);
      setFirebaseUser(null);
    } catch (e) {
      console.error("previusAuthenticationUser:", e);
    }
  };

  useEffect(() => {
    !loadingUser && userSnapshot && !errorUser && onLogin(userSnapshot?.data());
  }, [loadingUser, userSnapshot]);

  const mapProviderData = (providerData) => ({
    displayName: providerData?.displayName || null,
    email: providerData?.email || null,
    phoneNumber: providerData?.phoneNumber || null,
    photoURL: providerData?.photoURL || null,
    providerId: providerData.providerId,
    uid: providerData.uid,
  });

  const onLogout = async () => {
    setAuthenticating(true);

    setAuthUser(null);
    setFirebaseUser(null);
    setAuthenticating(false);
    setLoginLoading(false);
    setRegisterAuthUserData(null);
  };

  const onLogin = async (user) => {
    try {
      setLoginLoading(true);

      if (!user) throw new Error("User doesn't exists");

      setAuthUser(user);
      setAuthenticating(false);
    } catch (error) {
      console.error("Login", error);

      if (isError(error)) {
        notification({
          type: "error",
          title: error.message,
        });
      }

      await logout();
    }
  };

  const login = async (email, password) => {
    try {
      setLoginLoading(true);

      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

      await auth.signInWithEmailAndPassword(email, password);
    } catch (e) {
      const error = isError(e) ? e : undefined;

      console.error("singInUser:", e);

      notification({
        type: "error",
        title: error.message,
      });

      setLoginLoading(false);
    }
  };

  const registerAuthUser = async (formData) => {
    try {
      setLoginLoading(true);
      setRegisterAuthUserData({ ...formData });

      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

      await auth.createUserWithEmailAndPassword(
        formData.email,
        formData.password
      );
    } catch (e) {
      const error = isError(e) ? e : undefined;

      console.error("singUpUser:", e);

      notification({
        type: "error",
        title: error?.message,
      });

      setLoginLoading(false);
    }
  };

  const logout = async () => {
    sessionStorage.clear();
    localStorage.clear();

    return auth.signOut();
  };

  if (authenticating) return <Spinner height="100vh" />;

  return (
    <AuthenticationContext.Provider
      value={{
        authUser,
        registerAuthUser,
        login,
        logout,
        loginLoading,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
