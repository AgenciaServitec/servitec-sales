import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, capitalize } from "lodash";

interface Mail {
  contact: ContactGamontLlantas;
}

export const sendMailContactEmisor = async (
  contact: ContactGamontLlantas,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: contact.email,
    subject: "Gracias por contáctarnos",
    html: html(template.contactEmailEmisor, mapMail(contact)),
  });

const mapMail = (contact: ContactGamontLlantas): Mail => ({
  contact: assign({}, contact, {
    firstName: capitalize(contact.firstName),
  }),
});
