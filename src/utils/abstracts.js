import { clientColors } from "../data-list";

export const findClientColor = (hostname) =>
  clientColors.find((clientColor) => clientColor.code === hostname);
