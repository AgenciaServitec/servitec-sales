import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, isEmpty } from "lodash";
import { environmentConfig } from "../../config";
import { capitalize } from "lodash";

interface Mail {
  contact: GenericContact;
}

const { mailer } = environmentConfig;

export const sendMailContactReceptor = async (
  contact: GenericContact,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: contact.receptorEmail || mailer.generic.contact.to,
    bcc: `${mailer.generic.contact.bcc},${contact.receptorEmailsCopy}`,
    subject: "Email web contacto",
    html: html(template.contactEmailReceptor, mapMail(contact)),
  });

const mapMail = (contact: GenericContact): Mail => ({
  contact: assign({}, contact, {
    firstName: capitalize(contact.firstName),
    lastName: !isEmpty(contact.lastName) ? contact.lastName : null,
    email: contact.email,
    phone: contact.phone,
    ...(contact.issue && {
      issue: capitalize(contact.issue),
    }),
    ...(contact.message && {
      message: contact.message,
    }),
  }),
});
