import url from "url";
import { isObject, isArray, toString, replace } from "lodash";

type Restriction<T> = T extends null | undefined ? never : T;

export const objectUrlEncoder = <T>(object: Restriction<T>): string => {
  const urlSearchParams = new url.URLSearchParams();

  Object.entries(object).forEach(([key, value]) => {
    if (isObject(value) || isArray(value)) {
      let valueToString = JSON.stringify(value);

      valueToString = replace(valueToString, /\\/g, "");

      urlSearchParams.append(key, valueToString);
    } else {
      urlSearchParams.append(key, toString(value));
    }
  });

  return urlSearchParams.toString();
};
