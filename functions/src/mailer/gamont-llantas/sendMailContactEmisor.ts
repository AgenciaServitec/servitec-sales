import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, capitalize } from "lodash";

interface Mail {
  contact: ContactPublicidadDigital;
}

export const sendMailContactEmisor = async (
  contact: ContactPublicidadDigital,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: contact.email,
    subject: "Gracias por contáctarnos",
    html: html(template.contactEmailEmisor, mapMail(contact)),
  });

const mapMail = (contact: ContactPublicidadDigital): Mail => ({
  contact: assign({}, contact, {
    firstName: capitalize(contact.firstName),
  }),
});
