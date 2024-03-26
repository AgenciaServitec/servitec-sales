import { NextFunction, Request, Response } from "express";
import { fetchCollection, firestore, now } from "../../_firebase";
import { assign, capitalize, isEmpty, merge } from "lodash";
import { sendMailContactReceptor } from "../../mailer/common";
import { searchDataEmail } from "../_utils";
import moment from "moment/moment";

interface Body {
  request: EmailRequest;
}

export const PostRequest = async (
  req: Request<unknown, unknown, Body, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { body: formData } = req;

    console.log("「Request email Initialize」", {
      body: req.body,
    });

    if (!formData || isEmpty(formData)) {
      res.status(412).send("form_data_no_found").end();
      return;
    }

    const { request } = formData;

    const client: Client | undefined = await fetchClient(request.hostname);

    if (!client || isEmpty(client)) {
      res.status(412).send("client_no_exists").end();
      return;
    }

    const p0 = fetchSetRequestInContacts(request, client);

    const p1 = sendMailContactReceptor({
      contact: request,
      client: client,
      to: client.receptorEmail,
      bcc: client.receptorEmailsCopy,
      subject: request?.issue
        ? capitalize(request.issue)
        : "Solicitud recibido",
    });

    await Promise.all([p0, p1]);

    res.sendStatus(200).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const fetchClient = async (hostname: string): Promise<Client | undefined> => {
  const clients = await fetchCollection<Client>(
    firestore.collection("clients").where("hostname", "==", hostname),
  );

  return clients[0];
};

const fetchSetRequestInContacts = async (
  request: EmailRequest,
  client: Client,
): Promise<void> => {
  const contactId = firestore.collection("contacts").doc().id;

  await firestore
    .collection("contacts")
    .doc(contactId)
    .set(mapContact(contactId, request, client));
};

const mapContact = (
  contactId: string,
  request: EmailRequest,
  client: Client,
): OmitDefaultFirestoreProps<EmailRequest> => {
  const contact_ = merge(request, {
    id: contactId,
    clientId: client.id,
    hostname: client.hostname,
    fullName: (request?.fullName || "").toLowerCase(),
    firstName: (request?.firstName || "").toLowerCase(),
    lastName: (request?.lastName || "").toLowerCase(),
    email: request.email.toLowerCase(),
    ...(request?.message && { message: request.message }),
    ...(request?.plan && { plan: request.plan }),
    phone: request.phone,
    termsAndConditions: request?.termsAndConditions || true,
    createAtString: moment(now().toDate()).format("YYYY-MM-DD"),
    isDeleted: false,
    status: "pending",
    type: "request",
    createAt: now(),
  });

  return assign({}, contact_, {
    searchData: searchDataEmail(contact_),
  });
};
