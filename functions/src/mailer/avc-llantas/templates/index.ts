import { readFileSync } from "fs";
import path from "path";

const htmlTemplate = (url: string): string =>
  readFileSync(path.join(__dirname, url)).toString();

export const template = {
  contactEmailReceptor: htmlTemplate("./contactEmailReceptor.html"),
  contactEmailEmisor: htmlTemplate("./contactEmailEmisor.html"),
};
