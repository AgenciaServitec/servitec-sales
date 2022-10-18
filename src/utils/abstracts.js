import { clientData } from "../data-list";

export const findClientColor = (clientCode) =>
  clientData.find((clientColor) => clientColor.code === clientCode);
