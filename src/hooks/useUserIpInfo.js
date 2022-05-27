import { useEffect, useState } from "react";
import { ipInfoApi } from "../firebase";

export const useUserIpInfo = () => {
  const [userIpInfo, setUserIpInfo] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await fetch(ipInfoApi);

      const userIpInfo = await response.json();

      setUserIpInfo(userIpInfo);
    })();
  }, []);

  return { userIpInfo };
};
