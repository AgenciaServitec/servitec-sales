import { logger, uniq } from "../../utils";
import moment from "moment";
import { FirestoreTimestamp } from "../../_firebase";

interface Props extends ContactCommon {
  contactId: string;
  createAt: FirestoreTimestamp;
}

export const searchData = (contact: Props): string[] => {
  logger.log("contact->", contact);

  const strings = [
    contact.contactId,
    contact.clientCode,
    ...contact.firstName.split(" "),
    ...contact.lastName.split(" "),
    `${contact.phone.countryCode}${contact.phone.number}`.trim(),
    contact.phone.number,
    contact.phone.operator || "",
    contact.email,
    contact?.hostname || "",
    contact.status || "pending",
    moment(contact.createAt, "DD/MM/YYYY").format("DD/MM/YYYY"),
  ]
    .filter((string) => string)
    .map((string) => string.toString());

  logger.log("[SEARCH-DATA]", strings);

  return uniq(strings);
};
