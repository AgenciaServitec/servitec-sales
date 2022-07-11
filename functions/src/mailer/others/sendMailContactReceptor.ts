import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, isEmpty } from "lodash";
import { environmentConfig } from "../../config";
import { capitalize } from "lodash";

interface Mail {
  contact: ContactOther;
}

const { mailer } = environmentConfig;

export const sendMailContactReceptor = async (
  contact: ContactOther,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: mailer.others.contact.to,
    bcc: mailer.others.contact.bcc,
    subject: "Email web contacto",
    html: html(template.contactEmailReceptor, mapMail(contact)),
  });

const mapMail = (contact: ContactOther): Mail => ({
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
