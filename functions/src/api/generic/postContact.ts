import { logger } from "../../utils";
import { NextFunction, Request, Response } from "express";
import { fetchCollection, firestore, now } from "../../_firebase";
import { assign, capitalize, isEmpty, merge, toLower } from "lodash";
import {
  sendMailContactEmisor,
  sendMailContactReceptor,
} from "../../mailer/generic";
import { searchDataGeneric } from "../_utils";

interface Body {
  contact: GenericContact;
}

export const PostContact = async (
  req: Request<unknown, unknown, Body, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body: formData } = req;

    logger.log("「Contact generic Initialize」", {
      body: req.body,
    });

    if (!formData || isEmpty(formData)) {
      res.status(412).send("form_data_no_found").end();
      return;
    }

    const { contact } = formData;

    const client: Client | undefined = await fetchClient(contact.hostname);

    if (!client || isEmpty(client)) {
      res.status(412).send("client_no_exists").end();
      return;
    }

    const p0 = fetchSetContact(contact, client);

    const p1 = sendMailContactReceptor({
      contact: contact,
      client: client,
      to: client.receptorEmail,
      bcc: client.receptorEmailsCopy,
      subject: contact?.issue ? capitalize(contact.issue) : "Contacto recibido",
    });

    const p2 = sendMailContactEmisor({
      contact: contact,
      client: client,
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

const fetchClient = async (hostname: string): Promise<Client | undefined> => {
  const clients = await fetchCollection<Client>(
    firestore.collection("clients").where("hostname", "==", hostname)
  );

  return clients[0];
};

const fetchSetContact = async (
  contact: GenericContact,
  client: Client
): Promise<void> => {
  const contactId = firestore.collection("contacts").doc().id;

  await firestore
    .collection("contacts")
    .doc(contactId)
    .set(mapContact(contactId, contact, client));
};

const mapContact = (
  contactId: string,
  contact: GenericContact,
  client: Client
): OmitDefaultFirestoreProps<GenericContact> => {
  const contact_ = merge(contact, {
    clientId: client.id,
    firstName: contact.firstName.toLowerCase(),
    lastName: contact.lastName.toLowerCase(),
    email: contact.email.toLowerCase(),
    hostname: client.hostname,
    id: contactId,
    issue: contact.issue,
    message: contact.message,
    phone: contact.phone,
    status: "pending",
    termsAndConditions: contact?.termsAndConditions || true,
    createAt: now(),
  });

  return assign({}, contact_, {
    searchData: searchDataGeneric(contact_),
  });
};
