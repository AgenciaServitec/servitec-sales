import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign } from "lodash";

interface Mail {
  contact: ContactServitec;
}

export const sendMailContactEmisor = async (
  contact: ContactServitec,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: contact.email,
    subject: "Contacto Servitec",
    html: html(template.contactEmailEmisor, mapMail(contact)),
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
