import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, capitalize } from "lodash";
import { environmentConfig } from "../../config";

interface Mail {
  contact: ContactGamontLlantas;
}

const { mailer } = environmentConfig;

export const sendMailContactReceptor = async (
  contact: ContactGamontLlantas,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: mailer.gamontLlantas.contact.to,
    bcc: mailer.gamontLlantas.contact.bcc,
    subject: contact.issue
      ? capitalize(contact.issue)
      : "Gamont llantas - Web contácto",
    html: html(template.contactEmailReceptor, mapMail(contact)),
  });

const mapMail = (contact: ContactGamontLlantas): Mail => ({
  contact: assign({}, contact, {
    firstName: capitalize(contact.firstName),
    lastName: contact.lastName || "",
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
