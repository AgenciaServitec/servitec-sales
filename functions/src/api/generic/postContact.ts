import { logger } from "../../utils";
import { NextFunction, Request, Response } from "express";
import {
  sendMailContactEmisor,
  sendMailContactReceptor,
} from "../../mailer/generic";
import { firestore, FirestoreTimestamp, now } from "../../_firebase";
import { assign, capitalize, defaultTo, toLower } from "lodash";
import { searchData } from "../_utils";
import { environmentConfig, isProduction } from "../../config";

interface Body {
  contact: GenericContact;
}

export const PostContact = async (
  req: Request<unknown, unknown, Body, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { mailer } = environmentConfig;

    const { body: formData } = req;

    logger.log("「Contact generic Initialize」", {
      body: req.body,
    });

    if (!formData) res.status(412).send("error_no_found_contact_data").end();

    const { contact } = formData;

    const p0 = fetchContacts(contact);

    const p1 = sendMailContactReceptor({
      contact: contact,
      to: emailAddressesToSend(
        contact.receptorEmail,
        mailer.generic.contact.to
      ),
      bcc: `${toLower(mailer.generic.contact.bcc)},${toLower(
        contact.receptorEmailsCopy
      )}`,
      subject: capitalize(contact.issue),
    });

    const p2 = sendMailContactEmisor({
      contact: contact,
      to: toLower(contact.email),
      subject: `Gracias por contáctarnos ${
        contact.firstName && capitalize(contact.firstName)
      }`,
    });

    await Promise.all([p0, p1, p2]);

    res.sendStatus(200).end();
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const emailAddressesToSend = (
  emailAddress: string,
  emailAddressDefault: string
): string => {
  if (isProduction)
    return defaultTo(toLower(emailAddress), toLower(emailAddressDefault));

  return toLower(emailAddressDefault);
};

const fetchContacts = async (contact: GenericContact): Promise<void> => {
  const contactId = firestore.collection("contacts").doc().id;
  await firestore
    .collection("contacts")
    .doc(contactId)
    .set(mapContact(contactId, contact));
};

const mapContact = (contactId: string, contact: GenericContact) => {
  const createAt = now();

  return assign(
    {},
    { ...contact },
    {
      id: contactId,
      clientCode: contact.clientCode.toLowerCase() || "generic",
      firstName: contact.firstName.toLowerCase(),
      lastName: contact.lastName.toLowerCase(),
      email: contact.email.toLowerCase(),
      hostname: contact.hostname.toLowerCase(),
      searchData: searchData(mapSearchData(contactId, createAt, contact)),
      status: "pending",
      urlCompanyImage:
        contact.urlCompanyImage ||
        "https://firebasestorage.googleapis.com/v0/b/sendingemails-348505.appspot.com/o/resources%2Fimage-not-found.jpg?alt=media&token=35125bc7-a978-4ee0-8d01-d820b79b24b6",
      createAt: createAt,
    }
  );
};

interface SearchData extends ContactCommon {
  contactId: string;
  createAt: FirestoreTimestamp;
}

const mapSearchData = (
  contactId: string,
  createAt: FirestoreTimestamp,
  contact: ContactCommon
): SearchData => ({
  contactId: contactId,
  clientCode: contact.clientCode,
  firstName: contact.firstName,
  lastName: contact.lastName,
  email: contact.email,
  phone: contact.phone,
  hostname: contact.hostname,
  status: contact.status,
  message: contact.message,
  createAt: createAt,
});
