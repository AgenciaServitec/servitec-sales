import { NextFunction, Request, Response } from "express";
import { fetchCollection, firestore, now } from "../../_firebase";
import { assign, capitalize, isEmpty, merge } from "lodash";
import { sendMailContactReceptor } from "../../mailer/common";
import { searchDataEmail } from "../_utils";
import moment from "moment/moment";

interface Body {
  claim: EmailClaim;
}

export const PostClaim = async (
  req: Request<unknown, unknown, Body, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { body: formData } = req;

    console.log("「Claim email Initialize」", {
      body: req.body,
    });

    if (!formData || isEmpty(formData)) {
      res.status(412).send("form_data_no_found").end();
      return;
    }

    const { claim } = formData;

    const client: Client | undefined = await fetchClient(claim.hostname);

    if (!client || isEmpty(client)) {
      res.status(412).send("client_no_exists").end();
      return;
    }

    const p0 = fetchSetClaimInContacts(claim, client);

    const p1 = sendMailContactReceptor({
      contact: claim,
      client: client,
      to: client.receptorEmail,
      bcc: client.receptorEmailsCopy,
      subject: claim?.issue ? capitalize(claim.issue) : "Reclamo recibido",
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

const fetchSetClaimInContacts = async (
  claim: EmailClaim,
  client: Client,
): Promise<void> => {
  const contactId = firestore.collection("contacts").doc().id;

  await firestore
    .collection("contacts")
    .doc(contactId)
    .set(mapContact(contactId, claim, client));
};

const mapContact = (
  contactId: string,
  claim: EmailClaim,
  client: Client,
): OmitDefaultFirestoreProps<EmailClaim> => {
  const contact_ = merge(claim, {
    id: contactId,
    clientId: client.id,
    hostname: client.hostname,
    fullName: (claim?.fullName || "").toLowerCase(),
    firstName: (claim?.firstName || "").toLowerCase(),
    lastName: (claim?.lastName || "").toLowerCase(),
    email: claim.email.toLowerCase(),
    ...(claim?.issue && { issue: claim?.issue }),
    ...(claim?.message && { message: claim.message }),
    phone: claim.phone,
    termsAndConditions: claim?.termsAndConditions || true,
    degree: claim.degree,
    dni: claim.dni,
    cip: claim.cip,
    situation: claim.situation,
    department: claim.department,
    province: claim.province,
    district: claim.district,
    suggestionComplaint: claim.suggestionComplaint,
    createAtString: moment(now().toDate()).format("YYYY-MM-DD"),
    isDeleted: false,
    status: "pending",
    type: "claim",
    createAt: now(),
  });

  return assign({}, contact_, {
    searchData: searchDataEmail(contact_),
  });
};
