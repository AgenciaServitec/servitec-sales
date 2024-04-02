import { readFileSync } from "fs";
import path from "path";

const onReadFileSync = (partialPath: string) =>
  readFileSync(path.join(__dirname, partialPath)).toString();

export const partials = {
  contactContentPartial: onReadFileSync("./contactContent.html"),
  claimContentPartial: onReadFileSync("./claimContent.html"),
  dividerPartial: onReadFileSync("./divider.html"),
  spacePartial: onReadFileSync("./space.html"),
};
