import React, { useEffect, useState } from "react";
import { firestore, version } from "../firebase";
import { Spinner } from "../components/ui";
import { withConfiguration } from "../hoc";
import App from "../App";
import { UpdateVersion } from "./UpdateVersion";

const CheckVersion = () => {
  const [isLastVersion, setIsLastVersion] = useState(true);
  const [isLoadingVersion, setIsLoadingVersion] = useState(true);

  useEffect(() => {
    fetchSettingsVersion();
  }, []);

  const fetchSettingsVersion = async () =>
    await firestore
      .collection("setting")
      .doc("default")
      .onSnapshot(async (documentSnapshot) => {
        const setting = await documentSnapshot.data();

        setIsLastVersion(version === setting.version);

        setIsLoadingVersion(false);
      });

  if (isLoadingVersion) return <Spinner height="100vh" />;

  return isLastVersion ? <App /> : <UpdateVersion />;
};

export default withConfiguration(CheckVersion);
