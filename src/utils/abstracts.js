import { toLower } from "lodash";

export const removeAccents = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const formatWord = (word = "") => removeAccents(toLower(word));

export const formatWords = (words = []) =>
  words.map((word) => removeAccents(toLower(word)));
