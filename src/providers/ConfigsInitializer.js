import React, { useEffect } from "react";
import moment from "moment";
import "moment/locale/es";
import "moment/locale/fr";
import "moment/locale/nl";
import { setLocale } from "yup";
import { yup } from "../config";

export const ConfigsInitializer = () => {
  moment.updateLocale("es", {
    week: {
      dow: 1,
    },
  });

  useEffect(() => {
    setLocale(yup["es"]);

    moment.locale("es");
  }, []);

  return <React.Fragment />;
};
