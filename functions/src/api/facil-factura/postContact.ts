import { logger } from "../../utils";
import { NextFunction, Request, Response } from "express";
import {
  sendMailContactEmisor,
  sendMailContactReceptor,
} from "../../mailer/facil-factura";
import { firestore, FirestoreTimestamp, now } from "../../_firebase";
import { assign, toLower } from "lodash";
import { searchData } from "../_utils";

interface Body {
  contact: ContactFacilFactura;
}

export const PostContact = async (
  req: Request<unknown, unknown, Body, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body: formData } = req;

    logger.log("Contact FacilFactura.site:Initialize", {
      body: req.body,
    });

    if (!formData) res.status(412).send("error_no_found_contact_data").end();

    const p0 = fetchContacts(formData.contact);

    const p1 = sendMailContactReceptor(formData.contact);
    const p2 = sendMailContactEmisor(formData.contact);

    await Promise.all([p0, p1, p2]);

    res.sendStatus(200).end();
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const fetchContacts = async (contact: ContactFacilFactura) => {
  const contactId = firestore.collection("contacts").doc().id;
  await firestore
    .collection("contacts")
    .doc(contactId)
    .set(mapContact(contactId, contact));
};

const mapContact = (contactId: string, contact: ContactFacilFactura) => {
  const createAt = now();
  return assign(
    {},
    { ...contact },
    {
      id: contactId,
      clientCode: "facil-factura",
      firstName: toLower(contact.firstName),
      lastName: toLower(contact.lastName),
      email: toLower(contact.email),
      hostname: toLower(contact.hostname),
      searchData: searchData(mapSearchData(contactId, createAt, contact)),
      status: "pending",
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
