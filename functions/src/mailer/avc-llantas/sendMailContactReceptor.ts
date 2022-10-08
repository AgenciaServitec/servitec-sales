import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, capitalize, isEmpty } from "lodash";
import { environmentConfig } from "../../config";

interface Mail {
  contact: AvcLlantas;
}

const { mailer } = environmentConfig;

export const sendMailContactReceptor = async (
  contact: AvcLlantas,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: mailer.avcLlantas.contact.to,
    bcc: mailer.avcLlantas.contact.bcc,
    subject: contact.issue
      ? capitalize(contact.issue)
      : "Avc llantas - Web contácto",
    html: html(template.contactEmailReceptor, mapMail(contact)),
  });

const mapMail = (contact: AvcLlantas): Mail => ({
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
