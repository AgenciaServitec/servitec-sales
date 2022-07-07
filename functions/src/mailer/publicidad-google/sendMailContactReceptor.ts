import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, capitalize } from "lodash";
import { environmentConfig } from "../../config";

interface Mail {
  contact: ContactPublicidadGoogle;
}

const { mailer } = environmentConfig;

export const sendMailContactReceptor = async (
  contact: ContactPublicidadGoogle,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: mailer.publicidadGoogle.contact.to,
    bcc: mailer.publicidadGoogle.contact.bcc,
    subject: contact.issue
      ? capitalize(contact.issue)
      : "Publicidadgoogle.site - Web contácto",
    html: html(template.contactEmailReceptor, mapMail(contact)),
  });

const mapMail = (contact: ContactPublicidadGoogle): Mail => ({
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
