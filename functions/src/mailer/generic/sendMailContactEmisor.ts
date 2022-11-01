import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, capitalize } from "lodash";

interface Mail {
  contact: GenericContact;
}

interface Props {
  contact: GenericContact;
  client: Client;
  to: string;
  bcc?: string;
  subject: string;
}

export const sendMailContactEmisor = async ({
  contact,
  client,
  to,
  subject = "Gracias por contáctarnos",
}: Props): Promise<void> =>
  await sendMail({
    to: to,
    subject: subject,
    html: html(template.contactEmailEmisor, mapMail(contact, client)),
  });

const mapMail = (contact: GenericContact, client: Client): Mail => ({
  contact: assign({}, contact, {
    firstName: capitalize(contact.firstName),
    urlCompanyImage:
      client?.logo?.thumbUrl ||
      "https://firebasestorage.googleapis.com/v0/b/sendingemails-348505.appspot.com/o/resources%2Fimage-not-found.jpg?alt=media&token=35125bc7-a978-4ee0-8d01-d820b79b24b6",
  }),
});
