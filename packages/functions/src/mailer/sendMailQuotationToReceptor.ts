import assert from "assert";
import { fetchCollection } from "../firebase/firestore";
import { firestore } from "../firebase";
import { sendMail } from "./sendMail";
import { createSubject } from "./themes/common/subjects";
import { Templates } from "./themes/common";
import { createBody } from "./themes";
import { mapTemplateQuotationMustache } from "./utils/mapTemplateQuotationMail";

interface Props {
  quotation: EmailQuotation;
}

export const sendMailQuotationToReceptor = async ({
  quotation,
}: Props): Promise<void> => {
  assert(quotation, "Missing quotation");
  const client: Client | undefined = await fetchClientByHostname(
    quotation.hostname,
  );

  assert(client, "Missing client by hostname:" + quotation.hostname);

  const view = mapTemplateQuotationMustache(quotation, client);

  await sendMail(client, {
    to: client.receptorEmail,
    bcc: client.receptorEmailsCopy,
    subject: createSubject(Templates.EMAIL_QUOTATION, view),
    html: createBody(Templates.EMAIL_QUOTATION, "common", view),
  });
};

const fetchClientByHostname = async (
  hostname: string,
): Promise<Client | undefined> => {
  const clients = await fetchCollection<Client>(
    firestore.collection("clients").where("hostname", "==", hostname),
  );

  return clients[0];
};
