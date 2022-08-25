import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, capitalize } from "lodash";

interface Mail {
  contact: GenericContact;
}

export const sendMailContactEmisor = async (
  contact: GenericContact,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: contact.email,
    subject: "Contacto sitio web",
    html: html(template.contactEmailEmisor, mapMail(contact)),
  });

const mapMail = (contact: GenericContact): Mail => ({
  contact: assign({}, contact, {
    firstName: capitalize(contact.firstName),
  }),
});
