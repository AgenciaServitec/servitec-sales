import { sendMail } from "./sendMail";
import assert from "assert";
import { mapTemplateClaimMailMustache } from "./utils";
import { createSubject } from "./themes/common/subjects";
import { createBody } from "./themes";
import { Templates } from "./themes/common";
import { fetchCollection } from "../firebase/firestore";
import { firestore } from "../firebase";

interface Props {
  claim: EmailClaim;
}

export const sendMailReviewAllWebsites = async ({
  claim,
}: Props): Promise<void> => {
  assert(claim, "Missing claim");

  const client: Client | undefined = await fetchClientByHostname(
    claim.hostname,
  );
  assert(client, "Missing client by hostname:" + claim.hostname);

  const view = mapTemplateClaimMailMustache(claim, client);

  await sendMail(client, {
    to: client.receptorEmail,
    bcc: client.receptorEmailsCopy,
    subject: "[Servitec Sales] Reporte diario de websites",
    html: createBody(Templates.EMAIL_CLAIM, "common", view),
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
