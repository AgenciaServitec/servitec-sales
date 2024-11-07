import assert from "assert";
import { fetchCollection } from "../firebase/firestore";
import { spamsRef } from "../collections";
import { isEmpty } from "lodash";

export const spamsDetected = async (contact: Contact): Promise<boolean> => {
  assert(contact.email, "Missing contact.email!");
  assert(contact.phone.number, "Missing phone.number!");

  const regex = /^9[0-9]{8}$/gm;

  if (!regex.test(contact.phone.number.toString())) return false;

  const p0 = fetchCollection(
    spamsRef
      .where("value", "==", contact.email)
      .where("isDeleted", "==", false),
  );

  const p1 = fetchCollection(
    spamsRef
      .where("value", "==", contact.phone.number.toString())
      .where("isDeleted", "==", false),
  );

  const [spamsWithEmails, spamsWithPhones] = await Promise.all([p0, p1]);

  return !isEmpty([...spamsWithEmails, ...spamsWithPhones]);
};
