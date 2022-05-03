import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign } from "lodash";
import { environmentConfig } from "../../config";

interface Mail {
  contact: ContactServitec;
}

const { mailer } = environmentConfig;

export const sendMailContactReceptor = async (
  contact: ContactServitec,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: mailer.servitec.contact.to,
    bcc: mailer.servitec.contact.bcc,
    subject: "Email web contacto",
    html: html(template.contactEmailReceptor, mapMail(contact)),
  });

const mapMail = (contact: ContactServitec): Mail => ({
  contact: assign({}, contact, {
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phoneNumber: contact.phoneNumber,
    ...(contact.address && {
      address: contact.address,
    }),
    ...(contact.message && {
      message: contact.message,
    }),
  }),
});
