import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, capitalize } from "lodash";
import { environmentConfig } from "../../config";

interface Mail {
  contact: ContactPublicidadDigital;
}

const { mailer } = environmentConfig;

export const sendMailContactReceptor = async (
  contact: ContactPublicidadDigital,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: mailer.gamontLlantas.contact.to,
    bcc: mailer.gamontLlantas.contact.bcc,
    subject: contact.issue
      ? capitalize(contact.issue)
      : "Publicidad digital - Web contácto",
    html: html(template.contactEmailReceptor, mapMail(contact)),
  });

const mapMail = (contact: ContactPublicidadDigital): Mail => ({
  contact: assign({}, contact, {
    firstName: capitalize(contact.firstName),
    lastName: contact.lastName,
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
