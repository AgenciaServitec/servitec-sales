import { sendMail } from "./sendMail";
import assert from "assert";
import { mapTemplateRequestMailMustache } from "./utils";
import { createSubject } from "./themes/common/subjects";
import { createBody } from "./themes";
import { Templates } from "./themes/common";
import { fetchCollection } from "../firebase/firestore";
import { firestore } from "../firebase";

interface Props {
  request: EmailRequest;
}

export const sendMailRequestToReceptor = async ({
  request,
}: Props): Promise<void> => {
  assert(request, "Missing request");

  const client: Client | undefined = await fetchClientByHostname(
    request.hostname,
  );
  assert(client, "Missing client by hostname:" + request.hostname);

  const view = mapTemplateRequestMailMustache(request, client);

  await sendMail(client, {
    to: client.receptorEmail,
    bcc: client.receptorEmailsCopy,
    subject: createSubject(Templates.EMAIL_REQUEST, view),
    html: createBody(Templates.EMAIL_REQUEST, "common", view),
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
