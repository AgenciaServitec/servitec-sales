import { toLower } from "lodash";

export const removeAccents = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const uniq = (strings) =>
  strings.map((string) =>
    string
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
  );

export const formatWord = (word = "") => removeAccents(toLower(word));

export const formatWords = (words = []) =>
  words.map((word) => removeAccents(toLower(word)));

export const findColor = (clientId, clients = []) => {
  const client = clients.find((client) => client.id === clientId);

  return {
    color: client?.textColor || "#fff",
    bg: client?.bgColor || "#c4c4c4",
  };
};
