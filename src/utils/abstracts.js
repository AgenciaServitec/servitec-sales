import { clientColors } from "../data-list";

export const findClientColor = (clientCode) =>
  clientColors.find((clientColor) => clientColor.code === clientCode);
