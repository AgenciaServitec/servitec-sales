import React, { useEffect, useState } from "react";
import { setGlobal } from "reactn";
import { yup } from "../config";
import { setLocale } from "yup";
import { ThemeProvider } from "styled-components";
import { theme } from "../styles";
import { GlobalStyle } from "../styles/themes/GlobalStyle";
import es_ES from "antd/es/locale/es_ES";
import { ConfigProvider } from "antd";
import moment from "moment";

export const withConfiguration = (Component) => {
  return () => {
    const [isLoadingConfig, setIsLoadingConfig] = useState(true);

    useEffect(() => {
      initializeConfig();
    }, []);

    const initializeConfig = async () => {
      setLocale(yup["es"]);

      moment.locale("es");

      await setGlobal({
        authUser: null,
        isLoadingAuthUser: false,
        setGlobalRegister: null,
        setGlobalIsLoadingCreateUser: null,
        setGlobalIsLoadingUser: null,
        setIsLoadingAuth: false,
      });

      setIsLoadingConfig(false);
    };

    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {isLoadingConfig ? null : (
          <ConfigProvider locale={es_ES}>
            <Component />
          </ConfigProvider>
        )}
      </ThemeProvider>
    );
  };
};
